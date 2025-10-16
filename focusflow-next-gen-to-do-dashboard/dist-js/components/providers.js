"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { jsx as _jsx } from "react/jsx-runtime";
export function Providers({
  children
}) {
  return /*#__PURE__*/_jsx(SessionProvider, {
    children: /*#__PURE__*/_jsx(AuthProvider, {
      children: /*#__PURE__*/_jsx(ThemeProvider, {
        children: children
      })
    })
  });
}