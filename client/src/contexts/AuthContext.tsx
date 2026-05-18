import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, getUserData, removeAuthToken, setAuthToken, setUserData } from "../utils/api";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = (await authApi.me()) as User;
        setUser(userData);
        setUserData(userData);
      } catch {
        removeAuthToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setUser(response.user);
      setUserData(response.user);
      setAuthToken(response.token);
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      const err = error as Error & { response?: { message?: string } };
      const errorMessage =
        err.message || err.response?.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    navigate("/admin/login");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
