"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Settings,
  Moon,
  Sun,
  BarChart3,
  LogOut
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/types/task";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", view: "daily" as ViewMode },
    { icon: CheckSquare, label: "Kanban", view: "kanban" as ViewMode },
    { icon: Calendar, label: "Calendar", view: "calendar" as ViewMode },
    { icon: BarChart3, label: "Analytics", view: "weekly" as ViewMode },
  ];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-card border-r border-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FocusFlow</h1>
            <p className="text-xs text-muted-foreground">Stay productive</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.view}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Button
              variant={currentView === item.view ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onViewChange(item.view)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </motion.div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-5 h-5" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              Dark Mode
            </>
          )}
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
}