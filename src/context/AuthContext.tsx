import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

// ---
// AuthContext provides user/session state and auth actions using Supabase
// Includes email confirmation notification and enhanced error handling
// ---

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize session and user on mount
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setIsLoading(false);
    };
    initializeAuth();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("SignIn error:", err.message);
      // Notify if email is unconfirmed
      if (err.message.toLowerCase().includes("confirm")) {
        toast.error(
          "Please confirm your email before logging in. Check your inbox."
        );
      } else {
        toast.error(err.message ?? "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (!data.session) {
        toast(
          "🎉 Almost there! A confirmation link has been sent to your email. Please check your inbox."
        );
        navigate("/login");
      } else {
        setSession(data.session);
        setUser(data.user);
        toast.success("Registration successful");
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("SignUp error:", err.message);
      toast.error(err.message ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      toast.success("Logout successful");
      navigate("/login");
    } catch (err: any) {
      console.error("SignOut error:", err.message);
      toast.error(err.message ?? "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
