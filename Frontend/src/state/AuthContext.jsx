import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import serv from "../services/serv";
import cookies from "js-cookie";

// Create the context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = cookies.get("authToken");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await api.get("/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Token is invalid, clear it
      clearAuth();
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);

      // Get CSRF cookie if needed
      await serv.get("/sanctum/csrf-cookie");

      // Make login request
      const response = await api.post("/login", credentials, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // const { access_token, user: userData } = response.data;
      const { access_token, role, name } = response.data;

      console.log("Name", name);

      const userData = { email: credentials.email, role, name };

      if (access_token) {
        // Store token
        cookies.set("authToken", access_token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // Set user state
        setUser(userData);
        setIsAuthenticated(true);

        toast.success("Welcome back!");
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = cookies.get("authToken");

      if (token) {
        // Call logout endpoint
        await api.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
    }
  };

  const clearAuth = () => {
    cookies.remove("authToken");
    localStorage.removeItem("authToken"); // Remove if you're using localStorage too
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
