"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Toaster as Sonner } from "sonner";
import { jsx as _jsx } from "react/jsx-runtime";
const Toaster = ({
  ...props
}) => {
  const {
    theme
  } = useTheme();
  return /*#__PURE__*/_jsx(Sonner, {
    theme: theme,
    className: "toaster group",
    toastOptions: {
      classNames: {
        toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
      }
    },
    ...props
  });
};
export { Toaster };