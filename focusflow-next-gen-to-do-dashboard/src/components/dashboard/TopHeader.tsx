"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface TopHeaderProps {
  tasks?: any[];
}

export function TopHeader({ tasks = [] }: TopHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  // Calculate overdue tasks dynamically (including due today)
  const getOverdueTasksCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate <= today;
    });

    return overdueTasks.length;
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task Reminder",
      message: "No tasks due today",
      read: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Welcome",
      message: "Welcome to FocusFlow! Get started by adding your first task.",
      read: true,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
  ]);

  // Update notifications when tasks change
  useEffect(() => {
    const newOverdueCount = getOverdueTasksCount();
    setNotifications(prev => prev.map(notification =>
      notification.id === "1"
        ? {
            ...notification,
            message: newOverdueCount > 0
              ? `You have ${newOverdueCount} task${newOverdueCount === 1 ? '' : 's'} due today`
              : "No tasks due today",
            read: false, // Reset read status when count changes
          }
        : notification
    ));
  }, [tasks]);

  useEffect(() => {
    if (user) {
      // Use user data from AuthContext
      setProfile({
        firstName: user.name.split(' ')[0] || "",
        lastName: user.name.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
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
          profileImage: localStorage.getItem("profileImage") || "",
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
            profileImage: "",
          });
        }
      }
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-card border-b border-border"
    >
      {/* Left side - can add breadcrumbs or title later */}
      <div></div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-semibold">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read
                          ? "bg-background"
                          : "bg-muted/50 border-primary/20"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h5 className="font-medium text-sm">{notification.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={profile.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                  alt="Profile"
                />
                <AvatarFallback>
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName[0]}${profile.lastName[0]}`
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
