"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
const ThemeContext = /*#__PURE__*/createContext(undefined);
export function ThemeProvider({
  children
}) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("focusflow-theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("focusflow-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: {
      theme,
      toggleTheme
    },
    children: children
  });
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}