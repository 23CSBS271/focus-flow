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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  ArrowLeft,
  Camera,
  Save,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    weeklyReport: true,
  });
  const [appearance, setAppearance] = useState({
    accentColor: "purple",
    fontSize: "medium",
    compactMode: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    timezone: "utc-5",
  });
  const [notification, setNotification] = useState<string | null>(null);

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
            timezone: user.timezone || "utc-5",
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
      const storedTheme = localStorage.getItem("focusflow-theme") as "light" | "dark";
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
  const applyAppearanceSettings = (settings: typeof appearance) => {
    const root = document.documentElement;

    // Apply compact mode
    root.className = settings.compactMode ? "compact" : "";

    // Apply accent color (you can extend this with CSS custom properties)
    root.style.setProperty("--accent-color", settings.accentColor);

    // Apply font size
    root.style.fontSize = settings.fontSize === "small" ? "14px" :
                         settings.fontSize === "large" ? "18px" : "16px";
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
          timezone: profile.timezone,
        };

        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            ...updateData,
          }),
        });

        if (response.ok) {
          // Update local storage
          localStorage.setItem("profile", JSON.stringify(profile));
          localStorage.setItem("profileImage", profileImage || "");

          // Update user data in localStorage
          const updatedUser = { ...user, ...updateData };
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
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile input changes
  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // Auto-clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
          >
            {notification}
          </motion.div>
        )}

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <label htmlFor="profile-image-upload">
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer" asChild>
                          <span>
                            <Camera className="w-4 h-4" />
                            Change Photo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleProfileChange("bio", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => handleProfileChange("timezone", value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">Eastern Time (ET)</SelectItem>
                        <SelectItem value="utc-6">Central Time (CT)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (MT)</SelectItem>
                        <SelectItem value="utc-8">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveProfileSettings} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <Select
                      value={appearance.accentColor}
                      onValueChange={(value) => setAppearance({ ...appearance, accentColor: value })}
                    >
                      <SelectTrigger id="accentColor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}
                    >
                      <SelectTrigger id="fontSize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Show more content with reduced spacing
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                    />
                  </div>

                  <Button onClick={saveAppearanceSettings} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your tasks
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Remind me about upcoming tasks
                      </p>
                    </div>
                    <Switch
                      checked={notifications.taskReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, taskReminders: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly productivity summary
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyReport: checked })
                      }
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Button onClick={() => {
                    // Basic validation
                    const current = (document.getElementById('currentPassword') as HTMLInputElement)?.value;
                    const newPass = (document.getElementById('newPassword') as HTMLInputElement)?.value;
                    const confirm = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;

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
                    (document.getElementById('currentPassword') as HTMLInputElement).value = '';
                    (document.getElementById('newPassword') as HTMLInputElement).value = '';
                    (document.getElementById('confirmPassword') as HTMLInputElement).value = '';
                  }}>Update Password</Button>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        localStorage.setItem("twoFactorEnabled", JSON.stringify(!twoFactorEnabled));
                        setNotification(`Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"} successfully!`);
                      }}
                    >
                      {twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-destructive">Danger Zone</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all data
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // In a real app, this would make an API call to delete the account
                              alert("Account deletion initiated. You will be logged out.");
                              // Redirect to login or home page
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
