import { createContext, useContext, useState } from "react";
// FIX 1: Use 'import type' for types
import type { ReactNode } from "react";
import type { User } from "@/types";
import api from "@/lib/api"; // Import API to call logout endpoint

interface AuthContextType {
  user: User | null;
  // REMOVED: token string (Browser handles this now)
  login: (user: User) => void; // REMOVED: token argument
  logout: () => Promise<void>; // CHANGED: async to call server
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. LAZY INITIALIZATION
  // We only care about the USER object for the UI (Name, Email, etc.)
  // The Token is hidden in a cookie.
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Loading is false by default since we read synchronous localStorage
  const [isLoading] = useState(false);

  const login = (newUser: User) => {
    // We only store non-sensitive user data in localStorage so the UI works
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    try {
      // 1. Call Backend to clear the HttpOnly Cookie
      // (Ensure your backend has a GET /api/auth/logout route)
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // 2. Clear Local Frontend State
      localStorage.removeItem("user");
      setUser(null);
      // Optional: Redirect to login is handled by the component calling logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user, // If we have a user object, we assume we are logged in
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Disable Fast Refresh warning for export
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};