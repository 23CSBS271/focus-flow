"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated' && !user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if either AuthContext has user or NextAuth is authenticated
  if (!user && status !== 'authenticated') {
    return null;
  }

  return <Dashboard />;
}
