import { createContext, useContext, useState } from "react";
// FIX 1: Use 'import type' for types
import type { ReactNode } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. LAZY INITIALIZATION
  // We read from localStorage directly inside useState.
  // This happens SYNCHRONOUSLY during the first render.

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Since we read localStorage immediately above, we don't need to load anymore.
  // We can set this to false by default.
  // FIX 2: Removed 'setIsLoading' because we don't need to update it.
  // Since we read localStorage synchronously above, loading is always false on first render.
  const [isLoading] = useState(false);

  // --- No useEffect needed for initialization anymore! ---

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// FIX 3: Disable the Fast Refresh warning for this specific export.
// It is standard practice to keep the Hook and Provider in the same file.

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
