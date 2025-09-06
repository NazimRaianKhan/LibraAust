import React, { createContext, useContext, useEffect, useState } from "react";
import cookie from "js-cookie";
import api from "../services/api";

const UserContext = createContext();

// Basic context hook
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

// The provider thing idk what to write here

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // "Prop" to determine if user is (successfully) logged in or not

  const clearUser = async () => {
    try {
      api.post("/logout");
    } catch (error) {
      console.log("Error clearing header:", error);
    } finally {
      setIsAuthenticated(false);
      cookie.remove("authToken");
      cookie.remove("XSRF-TOKEN");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    // Get token from cookie
    const token = cookie.get("authToken");

    // If no token then user is null and so Navbar will show Sign In and Sign Up

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Verify token

    try {
      const response = await api.get("/userinfo");

      // If token is valid then Navbar will show user profile and Sign Out
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // If token is there BUT its invalid then user is null and so Navbar will show Sign In and Sign Up
      console.log("Error verifying user:", error);
      clearUser();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated,
  };

  // If necessary everyone can use the user
  return <UserContext value={{ value }}>{children}</UserContext>;
};
