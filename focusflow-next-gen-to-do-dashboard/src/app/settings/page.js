"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Bell, Shield, Palette, ArrowLeft, Camera, Save } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SettingsPage() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    weeklyReport: true
  });
  const [appearance, setAppearance] = useState({
    accentColor: "purple",
    fontSize: "medium",
    compactMode: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    timezone: "utc-5"
  });
  const [notification, setNotification] = useState(null);

  // Load settings from localStorage and database on mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedAppearance = localStorage.getItem("appearance");
      if (savedAppearance) {
        const parsedAppearance = JSON.parse(savedAppearance);
        setAppearance(parsedAppearance);
        applyAppearanceSettings(parsedAppearance);
      }
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Load from user data if available
        const userData = localStorage.getItem("focusflow-user");
        if (userData) {
          const user = JSON.parse(userData);
          setProfile({
            firstName: user.name?.split(' ')[0] || "",
            lastName: user.name?.split(' ').slice(1).join(' ') || "",
            email: user.email || "",
            bio: user.bio || "",
            timezone: user.timezone || "utc-5"
          });
        }
      }
      const savedProfileImage = localStorage.getItem("profileImage");
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      const savedTwoFactor = localStorage.getItem("twoFactorEnabled");
      if (savedTwoFactor) {
        setTwoFactorEnabled(JSON.parse(savedTwoFactor));
      }

      // Ensure theme is applied on settings page load
      const storedTheme = localStorage.getItem("focusflow-theme");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    loadSettings();
  }, []);

  // Save appearance settings to localStorage
  const saveAppearanceSettings = () => {
    localStorage.setItem("appearance", JSON.stringify(appearance));
    // Apply changes immediately
    applyAppearanceSettings(appearance);
    setNotification("Appearance settings saved successfully!");
  };

  // Apply appearance settings
  const applyAppearanceSettings = settings => {
    const root = document.documentElement;

    // Apply compact mode
    root.className = settings.compactMode ? "compact" : "";

    // Apply accent color (you can extend this with CSS custom properties)
    root.style.setProperty("--accent-color", settings.accentColor);

    // Apply font size
    root.style.fontSize = settings.fontSize === "small" ? "14px" : settings.fontSize === "large" ? "18px" : "16px";
  };

  // Save profile settings to localStorage and database
  const saveProfileSettings = async () => {
    try {
      const userData = localStorage.getItem("focusflow-user");
      if (userData) {
        const user = JSON.parse(userData);
        const updateData = {
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          bio: profile.bio,
          timezone: profile.timezone
        };
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            ...updateData
          })
        });
        if (response.ok) {
          // Update local storage
          localStorage.setItem("profile", JSON.stringify(profile));
          localStorage.setItem("profileImage", profileImage || "");

          // Update user data in localStorage
          const updatedUser = {
            ...user,
            ...updateData
          };
          localStorage.setItem("focusflow-user", JSON.stringify(updatedUser));
          setNotification("Profile updated successfully!");
        } else {
          setNotification("Failed to update profile. Please try again.");
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setNotification("Failed to update profile. Please try again.");
    }
  };

  // Handle profile image upload
  const handleImageUpload = event => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target?.result;
        setProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile input changes
  const handleProfileChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  // Auto-clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  return /*#__PURE__*/_jsx("div", {
    className: "min-h-screen bg-background",
    children: /*#__PURE__*/_jsxs("div", {
      className: "max-w-5xl mx-auto p-8",
      children: [/*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: -20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        className: "mb-8",
        children: [/*#__PURE__*/_jsx(Link, {
          href: "/dashboard",
          children: /*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            className: "mb-4",
            children: [/*#__PURE__*/_jsx(ArrowLeft, {
              className: "w-4 h-4 mr-2"
            }), "Back to Dashboard"]
          })
        }), /*#__PURE__*/_jsx("h1", {
          className: "text-4xl font-bold",
          children: "Settings"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-2",
          children: "Manage your account settings and preferences"
        })]
      }), notification && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: -10
        },
        animate: {
          opacity: 1,
          y: 0
        },
        exit: {
          opacity: 0,
          y: -10
        },
        className: "mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded",
        children: notification
      }), /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          delay: 0.1
        },
        children: /*#__PURE__*/_jsxs(Tabs, {
          defaultValue: "profile",
          className: "space-y-6",
          children: [/*#__PURE__*/_jsxs(TabsList, {
            className: "grid w-full grid-cols-4",
            children: [/*#__PURE__*/_jsxs(TabsTrigger, {
              value: "profile",
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(User, {
                className: "w-4 h-4"
              }), "Profile"]
            }), /*#__PURE__*/_jsxs(TabsTrigger, {
              value: "appearance",
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Palette, {
                className: "w-4 h-4"
              }), "Appearance"]
            }), /*#__PURE__*/_jsxs(TabsTrigger, {
              value: "notifications",
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Bell, {
                className: "w-4 h-4"
              }), "Notifications"]
            }), /*#__PURE__*/_jsxs(TabsTrigger, {
              value: "security",
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Shield, {
                className: "w-4 h-4"
              }), "Security"]
            })]
          }), /*#__PURE__*/_jsx(TabsContent, {
            value: "profile",
            className: "space-y-6",
            children: /*#__PURE__*/_jsxs(Card, {
              className: "p-6",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold mb-4",
                children: "Profile Information"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-6",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-4",
                  children: [/*#__PURE__*/_jsxs(Avatar, {
                    className: "w-20 h-20",
                    children: [/*#__PURE__*/_jsx(AvatarImage, {
                      src: profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    }), /*#__PURE__*/_jsx(AvatarFallback, {
                      children: "JD"
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("input", {
                      type: "file",
                      accept: "image/*",
                      onChange: handleImageUpload,
                      className: "hidden",
                      id: "profile-image-upload"
                    }), /*#__PURE__*/_jsx("label", {
                      htmlFor: "profile-image-upload",
                      children: /*#__PURE__*/_jsx(Button, {
                        variant: "outline",
                        size: "sm",
                        className: "gap-2 cursor-pointer",
                        asChild: true,
                        children: /*#__PURE__*/_jsxs("span", {
                          children: [/*#__PURE__*/_jsx(Camera, {
                            className: "w-4 h-4"
                          }), "Change Photo"]
                        })
                      })
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-xs text-muted-foreground mt-1",
                      children: "JPG, PNG or GIF. Max 2MB."
                    })]
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "grid grid-cols-2 gap-4",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "space-y-2",
                    children: [/*#__PURE__*/_jsx(Label, {
                      htmlFor: "firstName",
                      children: "First Name"
                    }), /*#__PURE__*/_jsx(Input, {
                      id: "firstName",
                      value: profile.firstName,
                      onChange: e => handleProfileChange("firstName", e.target.value)
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "space-y-2",
                    children: [/*#__PURE__*/_jsx(Label, {
                      htmlFor: "lastName",
                      children: "Last Name"
                    }), /*#__PURE__*/_jsx(Input, {
                      id: "lastName",
                      value: profile.lastName,
                      onChange: e => handleProfileChange("lastName", e.target.value)
                    })]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "email",
                    children: "Email"
                  }), /*#__PURE__*/_jsx(Input, {
                    id: "email",
                    type: "email",
                    value: profile.email,
                    onChange: e => handleProfileChange("email", e.target.value)
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "bio",
                    children: "Bio"
                  }), /*#__PURE__*/_jsx(Input, {
                    id: "bio",
                    value: profile.bio,
                    onChange: e => handleProfileChange("bio", e.target.value)
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "timezone",
                    children: "Timezone"
                  }), /*#__PURE__*/_jsxs(Select, {
                    value: profile.timezone,
                    onValueChange: value => handleProfileChange("timezone", value),
                    children: [/*#__PURE__*/_jsx(SelectTrigger, {
                      id: "timezone",
                      children: /*#__PURE__*/_jsx(SelectValue, {})
                    }), /*#__PURE__*/_jsxs(SelectContent, {
                      children: [/*#__PURE__*/_jsx(SelectItem, {
                        value: "utc-5",
                        children: "Eastern Time (ET)"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "utc-6",
                        children: "Central Time (CT)"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "utc-7",
                        children: "Mountain Time (MT)"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "utc-8",
                        children: "Pacific Time (PT)"
                      })]
                    })]
                  })]
                }), /*#__PURE__*/_jsxs(Button, {
                  onClick: saveProfileSettings,
                  className: "gap-2",
                  children: [/*#__PURE__*/_jsx(Save, {
                    className: "w-4 h-4"
                  }), "Save Changes"]
                })]
              })]
            })
          }), /*#__PURE__*/_jsx(TabsContent, {
            value: "appearance",
            className: "space-y-6",
            children: /*#__PURE__*/_jsxs(Card, {
              className: "p-6",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold mb-4",
                children: "Appearance Settings"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-6",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Dark Mode"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Toggle between light and dark theme"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: theme === "dark",
                    onCheckedChange: toggleTheme
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "accentColor",
                    children: "Accent Color"
                  }), /*#__PURE__*/_jsxs(Select, {
                    value: appearance.accentColor,
                    onValueChange: value => setAppearance({
                      ...appearance,
                      accentColor: value
                    }),
                    children: [/*#__PURE__*/_jsx(SelectTrigger, {
                      id: "accentColor",
                      children: /*#__PURE__*/_jsx(SelectValue, {})
                    }), /*#__PURE__*/_jsxs(SelectContent, {
                      children: [/*#__PURE__*/_jsx(SelectItem, {
                        value: "purple",
                        children: "Purple"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "blue",
                        children: "Blue"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "green",
                        children: "Green"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "red",
                        children: "Red"
                      })]
                    })]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "fontSize",
                    children: "Font Size"
                  }), /*#__PURE__*/_jsxs(Select, {
                    value: appearance.fontSize,
                    onValueChange: value => setAppearance({
                      ...appearance,
                      fontSize: value
                    }),
                    children: [/*#__PURE__*/_jsx(SelectTrigger, {
                      id: "fontSize",
                      children: /*#__PURE__*/_jsx(SelectValue, {})
                    }), /*#__PURE__*/_jsxs(SelectContent, {
                      children: [/*#__PURE__*/_jsx(SelectItem, {
                        value: "small",
                        children: "Small"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "medium",
                        children: "Medium"
                      }), /*#__PURE__*/_jsx(SelectItem, {
                        value: "large",
                        children: "Large"
                      })]
                    })]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Compact Mode"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Show more content with reduced spacing"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: appearance.compactMode,
                    onCheckedChange: checked => setAppearance({
                      ...appearance,
                      compactMode: checked
                    })
                  })]
                }), /*#__PURE__*/_jsxs(Button, {
                  onClick: saveAppearanceSettings,
                  className: "gap-2",
                  children: [/*#__PURE__*/_jsx(Save, {
                    className: "w-4 h-4"
                  }), "Save Changes"]
                })]
              })]
            })
          }), /*#__PURE__*/_jsx(TabsContent, {
            value: "notifications",
            className: "space-y-6",
            children: /*#__PURE__*/_jsxs(Card, {
              className: "p-6",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold mb-4",
                children: "Notification Preferences"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-6",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Email Notifications"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Receive email updates about your tasks"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: notifications.email,
                    onCheckedChange: checked => setNotifications({
                      ...notifications,
                      email: checked
                    })
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Push Notifications"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Get push notifications on your device"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: notifications.push,
                    onCheckedChange: checked => setNotifications({
                      ...notifications,
                      push: checked
                    })
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Task Reminders"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Remind me about upcoming tasks"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: notifications.taskReminders,
                    onCheckedChange: checked => setNotifications({
                      ...notifications,
                      taskReminders: checked
                    })
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Weekly Report"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Receive weekly productivity summary"
                    })]
                  }), /*#__PURE__*/_jsx(Switch, {
                    checked: notifications.weeklyReport,
                    onCheckedChange: checked => setNotifications({
                      ...notifications,
                      weeklyReport: checked
                    })
                  })]
                })]
              })]
            })
          }), /*#__PURE__*/_jsx(TabsContent, {
            value: "security",
            className: "space-y-6",
            children: /*#__PURE__*/_jsxs(Card, {
              className: "p-6",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold mb-4",
                children: "Security Settings"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-6",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "currentPassword",
                    children: "Current Password"
                  }), /*#__PURE__*/_jsx(Input, {
                    id: "currentPassword",
                    type: "password"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "newPassword",
                    children: "New Password"
                  }), /*#__PURE__*/_jsx(Input, {
                    id: "newPassword",
                    type: "password"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2",
                  children: [/*#__PURE__*/_jsx(Label, {
                    htmlFor: "confirmPassword",
                    children: "Confirm New Password"
                  }), /*#__PURE__*/_jsx(Input, {
                    id: "confirmPassword",
                    type: "password"
                  })]
                }), /*#__PURE__*/_jsx(Button, {
                  onClick: () => {
                    // Basic validation
                    const current = document.getElementById('currentPassword')?.value;
                    const newPass = document.getElementById('newPassword')?.value;
                    const confirm = document.getElementById('confirmPassword')?.value;
                    if (!current || !newPass || !confirm) {
                      setNotification('Please fill in all password fields');
                      return;
                    }
                    if (newPass !== confirm) {
                      setNotification('New passwords do not match');
                      return;
                    }
                    if (newPass.length < 8) {
                      setNotification('Password must be at least 8 characters long');
                      return;
                    }

                    // Save to localStorage (in a real app, this would make an API call)
                    localStorage.setItem("password", newPass);
                    setNotification('Password updated successfully!');

                    // Clear the form
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                  },
                  children: "Update Password"
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx(Label, {
                      children: "Two-Factor Authentication"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Add an extra layer of security to your account"
                    })]
                  }), /*#__PURE__*/_jsx(Button, {
                    variant: "outline",
                    onClick: () => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      localStorage.setItem("twoFactorEnabled", JSON.stringify(!twoFactorEnabled));
                      setNotification(`Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"} successfully!`);
                    },
                    children: twoFactorEnabled ? "Disable" : "Enable"
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx(Label, {
                    className: "text-destructive",
                    children: "Danger Zone"
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-sm text-muted-foreground mb-4",
                    children: "Permanently delete your account and all data"
                  }), /*#__PURE__*/_jsxs(AlertDialog, {
                    children: [/*#__PURE__*/_jsx(AlertDialogTrigger, {
                      asChild: true,
                      children: /*#__PURE__*/_jsx(Button, {
                        variant: "destructive",
                        children: "Delete Account"
                      })
                    }), /*#__PURE__*/_jsxs(AlertDialogContent, {
                      children: [/*#__PURE__*/_jsxs(AlertDialogHeader, {
                        children: [/*#__PURE__*/_jsx(AlertDialogTitle, {
                          children: "Are you absolutely sure?"
                        }), /*#__PURE__*/_jsx(AlertDialogDescription, {
                          children: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                        })]
                      }), /*#__PURE__*/_jsxs(AlertDialogFooter, {
                        children: [/*#__PURE__*/_jsx(AlertDialogCancel, {
                          children: "Cancel"
                        }), /*#__PURE__*/_jsx(AlertDialogAction, {
                          onClick: () => {
                            // In a real app, this would make an API call to delete the account
                            alert("Account deletion initiated. You will be logged out.");
                            // Redirect to login or home page
                          },
                          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                          children: "Delete Account"
                        })]
                      })]
                    })]
                  })]
                })]
              })]
            })
          })]
        })
      })]
    })
  });
}