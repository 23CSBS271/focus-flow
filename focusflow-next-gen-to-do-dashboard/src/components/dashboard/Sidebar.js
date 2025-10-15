"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Calendar, CheckSquare, Settings, Moon, Sun, BarChart3, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function Sidebar({
  currentView,
  onViewChange
}) {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    logout
  } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const navItems = [{
    icon: LayoutDashboard,
    label: "Dashboard",
    view: "daily"
  }, {
    icon: CheckSquare,
    label: "Kanban",
    view: "kanban"
  }, {
    icon: Calendar,
    label: "Calendar",
    view: "calendar"
  }, {
    icon: BarChart3,
    label: "Analytics",
    view: "weekly"
  }];
  return /*#__PURE__*/_jsxs(motion.aside, {
    initial: {
      x: -300,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    },
    transition: {
      duration: 0.3
    },
    className: "w-64 h-screen bg-card border-r border-border flex flex-col",
    children: [/*#__PURE__*/_jsx("div", {
      className: "p-6 border-b border-border",
      children: /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          scale: 0.8,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          delay: 0.2
        },
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center",
          children: /*#__PURE__*/_jsx(CheckSquare, {
            className: "w-6 h-6 text-white"
          })
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-xl font-bold",
            children: "FocusFlow"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Stay productive"
          })]
        })]
      })
    }), /*#__PURE__*/_jsx("nav", {
      className: "flex-1 p-4 space-y-2",
      children: navItems.map((item, index) => /*#__PURE__*/_jsx(motion.div, {
        initial: {
          x: -20,
          opacity: 0
        },
        animate: {
          x: 0,
          opacity: 1
        },
        transition: {
          delay: 0.1 * index
        },
        children: /*#__PURE__*/_jsxs(Button, {
          variant: currentView === item.view ? "default" : "ghost",
          className: "w-full justify-start gap-3",
          onClick: () => onViewChange(item.view),
          children: [/*#__PURE__*/_jsx(item.icon, {
            className: "w-5 h-5"
          }), item.label]
        })
      }, item.view))
    }), /*#__PURE__*/_jsxs("div", {
      className: "p-4 border-t border-border space-y-2",
      children: [/*#__PURE__*/_jsx(Link, {
        href: "/settings",
        children: /*#__PURE__*/_jsxs(Button, {
          variant: "ghost",
          className: "w-full justify-start gap-3",
          children: [/*#__PURE__*/_jsx(Settings, {
            className: "w-5 h-5"
          }), "Settings"]
        })
      }), /*#__PURE__*/_jsx(Button, {
        variant: "ghost",
        className: "w-full justify-start gap-3",
        onClick: toggleTheme,
        children: theme === "dark" ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Sun, {
            className: "w-5 h-5"
          }), "Light Mode"]
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Moon, {
            className: "w-5 h-5"
          }), "Dark Mode"]
        })
      }), /*#__PURE__*/_jsxs(Button, {
        variant: "ghost",
        className: "w-full justify-start gap-3 text-destructive hover:text-destructive",
        onClick: handleLogout,
        children: [/*#__PURE__*/_jsx(LogOut, {
          className: "w-5 h-5"
        }), "Logout"]
      })]
    })]
  });
}