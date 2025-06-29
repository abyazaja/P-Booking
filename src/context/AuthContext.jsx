import { createContext, useContext, useState, useEffect } from "react";
import { supabase, TABLES, USER_STATUS } from "../config/supabase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log("[Auth] Checking existing session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("[Auth] Found session, fetching profile...");
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[Auth] Auth state changed:", _event);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (!data) {
        console.error("No profile found.");
        setUser(null);
        return;
      }

      if (data.status === USER_STATUS.INACTIVE) {
        console.log("Account is inactive. Signing out...");
        await supabase.auth.signOut();
        toast.error("Akun Anda menunggu persetujuan admin.");
        setUser(null);
      } else {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          status: data.status,
          created_at: data.created_at,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setUser(null);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              role: "user",
              status: USER_STATUS.INACTIVE,
            },
          ]);

        if (profileError) throw profileError;

        toast.success(
          "Registrasi berhasil! Akun Anda menunggu persetujuan admin."
        );
        return {
          success: true,
          message: "Akun Anda menunggu persetujuan admin.",
        };
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err.message || "Gagal mendaftar");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

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
      if (error) throw error;

      // After auth, always refresh profile to validate status
      if (data.user) {
        await fetchUserProfile(data.user.id);
        toast.success("Login berhasil!");
        return { success: true };
      }
    } catch (err) {
      console.error("Login failed:", err);
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
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logout berhasil");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Gagal logout");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
