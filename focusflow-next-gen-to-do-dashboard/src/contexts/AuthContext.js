"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jsx as _jsx } from "react/jsx-runtime";
const AuthContext = /*#__PURE__*/createContext(undefined);
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: session,
    status
  } = useSession();
  useEffect(() => {
    // If NextAuth session exists, use it to set user
    if (status === 'authenticated' && session?.user) {
      const nextAuthUser = {
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        profileImage: session.user.image || ''
      };
      setUser(nextAuthUser);
      // Store in localStorage for persistence
      localStorage.setItem("focusflow-user", JSON.stringify(nextAuthUser));
      setIsLoading(false);
      return;
    }

    // Check for stored token on mount (for traditional login)
    const token = localStorage.getItem("focusflow-token");
    const storedUser = localStorage.getItem("focusflow-user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("focusflow-token");
        localStorage.removeItem("focusflow-user");
      }
    }
    setIsLoading(false);
  }, [session, status]);
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem("focusflow-token", `jwt.token.${Date.now()}`);
      localStorage.setItem("focusflow-user", JSON.stringify(data.user));

      // Load user profile data from database
      try {
        const profileResponse = await fetch(`/api/user/profile?userId=${data.user.id}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const fullUser = {
            ...data.user,
            ...profileData.user
          };
          localStorage.setItem("focusflow-user", JSON.stringify(fullUser));
          setUser(fullUser);
        } else {
          setUser(data.user);
        }
      } catch (profileError) {
        console.error('Failed to load profile:', profileError);
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem("focusflow-token", `jwt.token.${Date.now()}`);
      localStorage.setItem("focusflow-user", JSON.stringify(data.user));
      setUser(data.user);

      // Force page reload to ensure all components load fresh data
      window.location.reload();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    // Clear all user-specific data on logout
    localStorage.removeItem("focusflow-token");
    localStorage.removeItem("focusflow-user");
    localStorage.removeItem("focusflow-tasks");
    localStorage.removeItem("appearance");
    localStorage.removeItem("profile");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("notifications");
    localStorage.removeItem("twoFactorEnabled");
    localStorage.removeItem("password");
    setUser(null);
  };
  return /*#__PURE__*/_jsx(AuthContext.Provider, {
    value: {
      user,
      login,
      register,
      logout,
      isLoading
    },
    children: children
  });
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}