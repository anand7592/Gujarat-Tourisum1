import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/types";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Optimistic Initialization
  // We load from localStorage so the UI doesn't flicker, 
  // BUT we treat this as "Potentially Fake Data"
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // 2. THE SECURITY FIX: Verify with Server on Mount
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // We ask the backend: "Based on the HttpOnly cookie, who is this?"
        // This request sends the secure cookie automatically.
        const { data } = await api.get("/auth/me");
        
        // SERVER IS THE TRUTH. Update state with real data.
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // Sync local storage
      } catch (error) {
        // If backend says 401 (Cookie invalid/expired) or fails:
        // The user is not logged in, even if localStorage says they are.
        console.error("Session verification failed", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    // Only run verification if we think we have a user
    if (user) {
      verifyUser();
    } else {
      setIsLoading(false);
    }
  }, []); // Run once on app load

  const login = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      // Force redirect to ensure clean state
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};