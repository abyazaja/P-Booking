import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase, TABLES, USER_STATUS } from "../constants/supabase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isProfileFetching, setIsProfileFetching] = useState(false);
  const loadingRef = useRef(true); // Use ref to avoid closure issues
  const mountedRef = useRef(true); // Track if component is mounted

  // Update refs when state changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Utility function to create timeouts for async operations
  const withTimeout = (promise, timeoutMs = 10000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  };

  // Safe setState that checks if component is still mounted
  const safeSetState = (setter, value) => {
    if (mountedRef.current) {
      setter(value);
    }
  };

  useEffect(() => {
    let initializationAborted = false;
    
    const initAuth = async () => {
      try {
        console.log("[Auth] Starting initialization...");
        safeSetState(setProfileError, null);
        
        // Test Supabase connection first with a short timeout
        console.log("[Auth] Testing Supabase connection...");
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          5000 // 5 second timeout for session check
        );
        
        if (initializationAborted) return;
        
        const session = sessionResult?.data?.session;
        console.log("[Auth] Session check result:", !!session);
        
        if (session?.user) {
          console.log("[Auth] Found session for user:", session.user.id);
          // Only fetch profile if we have a session
          await fetchUserProfile(session.user.id);
        } else {
          console.log("[Auth] No session found, app ready for guest use");
          safeSetState(setLoading, false);
          loadingRef.current = false;
        }
        
      } catch (error) {
        if (initializationAborted) return;
        
        console.error("[Auth] Initialization failed:", error);
        
        // Handle different types of errors gracefully
        if (error.message?.includes('timed out')) {
          safeSetState(setProfileError, "Koneksi ke server timeout. Periksa koneksi internet Anda.");
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          safeSetState(setProfileError, "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          safeSetState(setProfileError, "Gagal menginisialisasi aplikasi. Silakan refresh halaman.");
        }
        
        safeSetState(setLoading, false);
        loadingRef.current = false;
      }
    };

    // Start initialization
    initAuth();
    
    // Absolute safety timeout - no matter what happens, clear loading after 8 seconds
    const absoluteTimeout = setTimeout(() => {
      if (loadingRef.current && mountedRef.current) {
        console.warn("[Auth] Absolute timeout reached, forcing app to load");
        safeSetState(setLoading, false);
        loadingRef.current = false;
        
        // Only set error if we don't already have one
        if (!profileError) {
          safeSetState(setProfileError, "Aplikasi memerlukan waktu lama untuk dimuat. Silakan periksa koneksi internet atau hubungi admin.");
        }
      }
    }, 8000); // 8 second absolute timeout

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] Auth state changed:", event, "Session:", !!session?.user);
      
      // Clear error on any auth state change
      setProfileError(null);
      
      if (event === 'SIGNED_OUT') {
        console.log("[Auth] User signed out, clearing all state");
        setUser(null);
        setProfileError(null);
        setIsProfileFetching(false);
        setLoading(false);
        return;
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log("[Auth] Token refreshed, checking if we need to fetch profile");
        // For token refresh, only fetch profile if we don't have user data and there's a session
        if (session?.user) {
          // Always fetch profile on token refresh to ensure data is current
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
        return;
      }
      
      if (session?.user) {
        console.log("[Auth] Session exists, fetching profile for:", session.user.id);
        await fetchUserProfile(session.user.id);
      } else {
        console.log("[Auth] No session, clearing user state");
        setUser(null);
        setProfileError(null);
        setIsProfileFetching(false);
        setLoading(false);
      }
    });

    return () => {
      initializationAborted = true;
      mountedRef.current = false;
      subscription.unsubscribe();
      clearTimeout(absoluteTimeout);
    };
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    // Prevent concurrent profile fetches
    if (isProfileFetching) {
      console.log("[Auth] Profile fetch already in progress, skipping");
      return;
    }
    
    if (!mountedRef.current) {
      console.log("[Auth] Component unmounted, skipping profile fetch");
      return;
    }
    
    try {
      safeSetState(setIsProfileFetching, true);
      safeSetState(setProfileError, null);
      console.log("[Auth] Fetching profile for user:", userId);
      
      // Add timeout to the profile fetch
      const profileQuery = supabase
        .from(TABLES.USERS)
        .select("*")
        .eq("id", userId)
        .single();
      
      const { data, error } = await withTimeout(profileQuery, 5000); // 5 second timeout

      if (!mountedRef.current) return;

      if (error) {
        console.error("[Auth] Profile fetch error:", error);
        
        // Handle permission/RLS errors gracefully - these indicate database not setup
        if (
          error.code === '42501' || // insufficient_privilege
          error.code === 'PGRST116' || // no rows returned
          error.code === '42883' || // function does not exist
          error.message?.toLowerCase().includes('permission') ||
          error.message?.toLowerCase().includes('rls') ||
          error.message?.toLowerCase().includes('policy') ||
          error.message?.toLowerCase().includes('not allowed') ||
          error.message?.toLowerCase().includes('jwt')
        ) {
          console.log("[Auth] Database permission error - database not setup properly");
          safeSetState(setProfileError, "Database belum dikonfigurasi. Silakan jalankan database setup script di Supabase atau hubungi admin.");
          safeSetState(setUser, null);
          return;
        }
        
        // Handle timeout errors
        if (error.message?.includes('timed out')) {
          safeSetState(setProfileError, "Timeout saat mengambil data profil. Periksa koneksi internet.");
          safeSetState(setUser, null);
          return;
        }
        
        // For other errors
        safeSetState(setProfileError, "Profil pengguna tidak ditemukan atau terjadi kesalahan database.");
        safeSetState(setUser, null);
        return;
      }

      if (!data) {
        console.log("[Auth] No profile data returned");
        safeSetState(setProfileError, "Profil pengguna tidak ditemukan di database. Mungkin akun belum disetup dengan benar.");
        safeSetState(setUser, null);
        return;
      }

      console.log("[Auth] Profile loaded successfully:", { id: data.id, email: data.email, role: data.role, status: data.status });

      if (data.status === USER_STATUS.INACTIVE) {
        console.log("[Auth] User is inactive, signing out");
        try {
          await withTimeout(supabase.auth.signOut(), 3000);
        } catch (signOutError) {
          console.warn("[Auth] Sign out failed:", signOutError);
        }
        toast.error("Akun Anda menunggu persetujuan admin.");
        safeSetState(setUser, null);
        return;
      }
      
      // Success - set user data
      safeSetState(setUser, {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        status: data.status,
        created_at: data.created_at,
      });
      
      console.log("[Auth] User state updated successfully");
      
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error("[Auth] Exception in fetchUserProfile:", err);
      
      // Handle timeout
      if (err.message?.includes('timed out')) {
        safeSetState(setProfileError, "Timeout saat mengambil profil pengguna. Periksa koneksi internet Anda.");
      }
      // Handle permission errors
      else if (
        err.message?.toLowerCase().includes('permission') ||
        err.message?.toLowerCase().includes('rls') ||
        err.message?.toLowerCase().includes('policy') ||
        err.message?.toLowerCase().includes('not allowed')
      ) {
        safeSetState(setProfileError, "Database belum dikonfigurasi dengan benar. Silakan jalankan database setup script atau hubungi admin.");
      }
      // Handle other errors
      else {
        safeSetState(setProfileError, "Terjadi kesalahan saat memuat profil: " + (err.message || 'Unknown error'));
      }
      
      safeSetState(setUser, null);
    } finally {
      if (mountedRef.current) {
        safeSetState(setIsProfileFetching, false);
        safeSetState(setLoading, false);
        loadingRef.current = false;
        console.log("[Auth] Profile fetch completed, loading cleared");
      }
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      
      console.log("[Auth] Starting registration for:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Store name in auth metadata as backup
          },
        },
      });
      
      if (authError) {
        console.error("[Auth] Signup error:", authError);
        throw authError;
      }

      if (authData.user) {
        console.log("[Auth] User created in auth, creating profile...");
        
        // Try to create user profile with better error handling
        const { data: profileData, error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([
            {
              id: authData.user.id,
              email: email,
              name: name,
              role: "user",
              status: USER_STATUS.INACTIVE,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (profileError) {
          console.error("[Auth] Profile creation error:", profileError);
          
          // If profile creation fails, we should remove the auth user
          console.log("[Auth] Attempting to cleanup auth user due to profile error");
          await supabase.auth.admin.deleteUser(authData.user.id).catch(console.error);
          
          throw new Error(`Gagal membuat profil pengguna: ${profileError.message}`);
        }
        
        console.log("[Auth] Profile created successfully:", profileData);

        // Sign out immediately since they need admin approval
        await supabase.auth.signOut();
        
        toast.success(
          "Registrasi berhasil! Akun Anda menunggu persetujuan admin."
        );
        return {
          success: true,
          message: "Akun Anda menunggu persetujuan admin.",
        };
      }
      
      throw new Error("Registrasi gagal: Data pengguna tidak tersedia");
      
    } catch (err) {
      console.error("[Auth] Register error:", err);
      const message = err.message || "Gagal mendaftar";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("[Auth] Starting login for:", email);
      setLoading(true);
      setProfileError(null);
      setIsProfileFetching(false);

      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Race timeout
      const result = await Promise.race([
        loginPromise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Login timeout. Coba lagi nanti.")),
            20000
          )
        ),
      ]);

      const { data, error } = result;
      if (error) {
        console.error("[Auth] Login error:", error);
        throw error;
      }

      console.log("[Auth] Authentication successful, user ID:", data.user?.id);

      // The auth state change listener will handle profile fetching
      // Don't call fetchUserProfile directly here to avoid race conditions
      toast.success("Login berhasil!");
      return { success: true };
      
    } catch (err) {
      console.error("[Auth] Login failed:", err);
      let message = "Gagal login";
      if (err.message?.includes("Invalid login credentials")) {
        message = "Email atau password salah";
      } else if (err.message?.includes("Email not confirmed")) {
        message = "Email belum dikonfirmasi. Silakan cek email.";
      } else if (err.message?.includes("timeout")) {
        message = err.message;
      } else {
        message = err.message || "Gagal login";
      }
      toast.error(message);
      return { success: false, message };
    } finally {
      // Don't set loading to false here - let the auth state change handler do it
      // This prevents the loading state from being cleared before profile is fetched
      console.log("[Auth] Login process completed, auth state change will handle loading");
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth] Starting logout process");
      setLoading(true);
      
      // Clear all state immediately
      setUser(null);
      setProfileError(null);
      setIsProfileFetching(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[Auth] Logout error:", error);
        toast.error("Gagal logout");
      } else {
        console.log("[Auth] Logout successful");
        toast.success("Logout berhasil");
      }
      
      // Clear browser storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log("[Auth] Browser storage cleared");
      } catch (storageError) {
        console.warn("[Auth] Could not clear storage:", storageError);
      }
      
    } catch (err) {
      console.error("[Auth] Logout exception:", err);
      toast.error("Gagal logout");
    } finally {
      setLoading(false);
      console.log("[Auth] Logout completed, redirecting to home");
      // Use router navigation instead of hard redirect
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isActiveUser: () => user?.status === USER_STATUS.ACTIVE,
        isAdmin: () => user?.role === "admin",
        profileError,
        isProfileFetching,
        // Debug function to manually clear stuck states
        // Emergency bailout function
        clearStuckState: () => {
          console.log("[Auth] Emergency: Manually clearing all stuck states");
          if (mountedRef.current) {
            setLoading(false);
            setIsProfileFetching(false);
            setProfileError(null);
            loadingRef.current = false;
          }
        },
        // Force app to usable state
        forceAppReady: () => {
          console.log("[Auth] Emergency: Forcing app to ready state");
          if (mountedRef.current) {
            setLoading(false);
            setIsProfileFetching(false);
            setProfileError(null);
            setUser(null);
            loadingRef.current = false;
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
