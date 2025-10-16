"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Avatar options - Cartoon avatars (same as settings page)
const avatarOptions = [
  { id: "avatar1", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", alt: "Cartoon Avatar 1" },
  { id: "avatar2", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", alt: "Cartoon Avatar 2" },
  { id: "avatar3", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", alt: "Cartoon Avatar 3" },
  { id: "avatar4", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", alt: "Cartoon Avatar 4" },
  { id: "avatar5", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey", alt: "Cartoon Avatar 5" },
  { id: "avatar6", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy", alt: "Cartoon Avatar 6" },
  { id: "avatar7", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna", alt: "Cartoon Avatar 7" },
  { id: "avatar8", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco", alt: "Cartoon Avatar 8" }
];
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TopHeader({
  tasks = []
}) {
  const router = useRouter();
  const {
    user
  } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: ""
  });

  // Calculate overdue tasks dynamically (including due today)
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate <= today;
    });
    return overdueTasks;
  };
  const [notifications, setNotifications] = useState([{
    id: "1",
    title: "Task Reminder",
    message: "No tasks due today",
    read: false,
    timestamp: new Date()
  }, {
    id: "2",
    title: "Welcome",
    message: "Welcome to FocusFlow! Get started by adding your first task.",
    read: true,
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  }]);

  // Update notifications when tasks change
  useEffect(() => {
    const overdueTasks = getOverdueTasks();
    const newOverdueCount = overdueTasks.length;
    const taskNames = overdueTasks.slice(0, 3).map(task => task.title).join(', ');
    const remainingCount = overdueTasks.length - 3;
    const taskNamesText = newOverdueCount > 0
      ? newOverdueCount <= 3
        ? `You have ${newOverdueCount} overdue task${newOverdueCount === 1 ? '' : 's'}: ${taskNames}`
        : `You have ${newOverdueCount} overdue tasks: ${taskNames}${remainingCount > 0 ? ` and ${remainingCount} more` : ''}`
      : "No overdue tasks";
    setNotifications(prev => prev.map(notification => notification.id === "1" ? {
      ...notification,
      message: taskNamesText,
      read: false // Reset read status when count changes
    } : notification));
  }, [tasks]);
  useEffect(() => {
    if (user) {
      // Use user data from AuthContext
      setProfile({
        firstName: user.name.split(' ')[0] || "",
        lastName: user.name.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
        profileImage: user.avatar || ""
      });
    } else {
      // Fallback to localStorage if no user in context
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({
          firstName: parsedProfile.firstName || "",
          lastName: parsedProfile.lastName || "",
          email: parsedProfile.email || "",
          profileImage: localStorage.getItem("selectedAvatar") || ""
        });
      } else {
        // Load from user registration data if available
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setProfile({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            profileImage: ""
          });
        }
      }
    }
  }, [user]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = id => {
    setNotifications(notifications.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
  };
  const handleSettingsClick = () => {
    router.push('/settings');
  };
  return /*#__PURE__*/_jsxs(motion.header, {
    initial: {
      opacity: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    className: "flex items-center justify-between p-4 bg-card border-b border-border",
    children: [/*#__PURE__*/_jsx("div", {}), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-4",
      children: [/*#__PURE__*/_jsxs(Popover, {
        children: [/*#__PURE__*/_jsx(PopoverTrigger, {
          asChild: true,
          children: /*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            size: "icon",
            className: "relative",
            children: [/*#__PURE__*/_jsx(Bell, {
              className: "w-5 h-5"
            }), unreadCount > 0 && /*#__PURE__*/_jsx(Badge, {
              variant: "destructive",
              className: "absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs",
              children: unreadCount
            })]
          })
        }), /*#__PURE__*/_jsx(PopoverContent, {
          className: "w-80",
          align: "end",
          children: /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsx("h4", {
              className: "font-semibold",
              children: "Notifications"
            }), notifications.length === 0 ? /*#__PURE__*/_jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "No notifications"
            }) : /*#__PURE__*/_jsx("div", {
              className: "space-y-2 max-h-64 overflow-y-auto",
              children: notifications.map(notification => /*#__PURE__*/_jsxs("div", {
                className: `p-3 rounded-lg border cursor-pointer transition-colors ${notification.read ? "bg-background" : "bg-muted/50 border-primary/20"}`,
                onClick: () => markAsRead(notification.id),
                children: [/*#__PURE__*/_jsx("h5", {
                  className: "font-medium text-sm",
                  children: notification.title
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-muted-foreground mt-1",
                  children: notification.message
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-muted-foreground mt-2",
                  children: notification.timestamp.toLocaleString()
                })]
              }, notification.id))
            })]
          })
        })]
      }), /*#__PURE__*/_jsxs(DropdownMenu, {
        children: [/*#__PURE__*/_jsx(DropdownMenuTrigger, {
          asChild: true,
          children: /*#__PURE__*/_jsx(Button, {
            variant: "ghost",
            className: "relative h-10 w-10 rounded-full",
            children: /*#__PURE__*/_jsxs(Avatar, {
              className: "h-10 w-10",
              children: [/*#__PURE__*/_jsx(AvatarImage, {
                src: profile.profileImage ? avatarOptions.find(a => a.id === profile.profileImage)?.src : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                alt: "Profile"
              }), /*#__PURE__*/_jsx(AvatarFallback, {
                children: profile.firstName && profile.lastName ? `${profile.firstName[0]}${profile.lastName[0]}` : "U"
              })]
            })
          })
        }), /*#__PURE__*/_jsxs(DropdownMenuContent, {
          className: "w-56",
          align: "end",
          forceMount: true,
          children: [/*#__PURE__*/_jsx(DropdownMenuLabel, {
            className: "font-normal",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex flex-col space-y-1",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-sm font-medium leading-none",
                children: [profile.firstName, " ", profile.lastName]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs leading-none text-muted-foreground",
                children: profile.email
              })]
            })
          }), /*#__PURE__*/_jsx(DropdownMenuSeparator, {}), /*#__PURE__*/_jsxs(DropdownMenuItem, {
            onClick: handleSettingsClick,
            children: [/*#__PURE__*/_jsx(Settings, {
              className: "mr-2 h-4 w-4"
            }), /*#__PURE__*/_jsx("span", {
              children: "Settings"
            })]
          })]
        })]
      })]
    })]
  });
}