"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Home() {
  const {
    user,
    isLoading
  } = useAuth();
  const {
    data: session,
    status
  } = useSession();
  const router = useRouter();
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated' && !user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, status, router]);
  if (isLoading || status === 'loading') {
    return /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center min-h-screen",
      children: /*#__PURE__*/_jsxs("div", {
        className: "text-center",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground",
          children: "Loading..."
        })]
      })
    });
  }

  // Allow access if either AuthContext has user or NextAuth is authenticated
  if (!user && status !== 'authenticated') {
    return null;
  }
  return /*#__PURE__*/_jsx(Dashboard, {});
}