import { createContext, useContext, useState, useEffect } from "react";
import { supabase, TABLES, USER_STATUS } from "../constants/supabase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simple state management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState(null);

  // Simple initialization - fail fast, app always becomes ready
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("[Auth] Starting simple initialization...");
        
        // Set a hard 3-second limit for entire auth process
        const authTimeout = setTimeout(() => {
          if (mounted) {
            console.log("[Auth] Timeout - making app ready anyway");
            setLoading(false);
            setAuthReady(true);
            setError("Authentication timeout - app running in guest mode");
          }
        }, 3000);

        // Try to get session - but don't wait forever
        const sessionPromise = supabase.auth.getSession();
        const sessionResult = await Promise.race([
          sessionPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Session check timeout")), 2000)
          )
        ]);

        if (!mounted) return;
        clearTimeout(authTimeout);

        const session = sessionResult?.data?.session;
        console.log("[Auth] Session check complete:", !!session);

        if (session?.user) {
          // Try to get user profile - but don't block app if it fails
          await tryLoadUserProfile(session.user.id);
        }

        // Always make app ready
        setLoading(false);
        setAuthReady(true);
        console.log("[Auth] Initialization complete - app ready");

      } catch (error) {
        console.log("[Auth] Initialization failed:", error.message);
        if (mounted) {
          setLoading(false);
          setAuthReady(true);
          setError("Auth initialization failed - running in guest mode");
        }
      }
    };

    // Try to load user profile without blocking
    const tryLoadUserProfile = async (userId) => {
      try {
        const profilePromise = supabase
          .from(TABLES.USERS)
          .select("*")
          .eq("id", userId)
          .single();

        const result = await Promise.race([
          profilePromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Profile timeout")), 1500)
          )
        ]);

        if (result.data && mounted) {
          const userData = result.data;
          
          // All users are now active by default - no status check needed

          // Set user data
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            status: userData.status,
            created_at: userData.created_at,
          });
          
          console.log("[Auth] User profile loaded:", userData.name);
        }
      } catch (profileError) {
        console.log("[Auth] Profile load failed:", profileError.message);
        // Don't fail the entire app - just log the issue
        setError("Could not load user profile - some features may be limited");
      }
    };

    // Start initialization
    initializeAuth();

    // Set up auth state listener - but don't let it block anything
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] State change:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setError(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        await tryLoadUserProfile(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Simple login function
  const login = async (email, password) => {
    try {
      setError(null);
      console.log("[Auth] Attempting login for:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("[Auth] Login error:", error.message);
        const message = error.message.includes("Invalid login credentials") 
          ? "Email atau password salah"
          : error.message;
        setError(message);
        toast.error(message);
        return { success: false, message };
      }

      console.log("[Auth] Login successful");
      toast.success("Login berhasil!");
      return { success: true };

    } catch (err) {
      console.log("[Auth] Login exception:", err.message);
      const message = "Gagal login: " + err.message;
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  // Simple logout function
  const logout = async () => {
    try {
      console.log("[Auth] Logging out...");
      setUser(null);
      setError(null);
      
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
      window.location.href = "/";
      
    } catch (err) {
      console.log("[Auth] Logout error:", err.message);
      toast.error("Gagal logout");
    }
  };

  // Simple register function
  const register = async (email, password, name) => {
    try {
      setError(null);
      console.log("[Auth] Attempting registration for:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        console.log("[Auth] Registration error:", error.message);
        setError(error.message);
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Try to create profile - but don't fail if it doesn't work
        try {
          await supabase
            .from(TABLES.USERS)
            .insert([{
              id: data.user.id,
              email,
              name,
              role: "user",
              status: USER_STATUS.ACTIVE,
            }]);
        } catch (profileError) {
          console.warn("[Auth] Profile creation failed:", profileError.message);
        }

        // Keep user logged in since they can access the app immediately
        toast.success("🎉 Registrasi berhasil! Anda dapat langsung login dan mulai booking!");
        return { success: true, message: "Account created successfully! You can now login and book courts immediately." };
      }

    } catch (err) {
      console.log("[Auth] Registration exception:", err.message);
      const message = "Gagal mendaftar: " + err.message;
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  // Helper functions
  const isActiveUser = () => !!user; // All logged in users are active
  const isAdmin = () => user?.role === "admin";

  // Emergency clear function
  const clearAuthState = () => {
    console.log("[Auth] Emergency clear requested");
    setUser(null);
    setError(null);
    setLoading(false);
    setAuthReady(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authReady,
        error,
        login,
        logout,
        register,
        isActiveUser,
        isAdmin,
        clearAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);