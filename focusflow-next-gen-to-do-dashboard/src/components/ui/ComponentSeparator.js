"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Component separator for spacing between major sections
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ComponentSeparator({
  className,
  ...props
}) {
  return /*#__PURE__*/_jsx("div", {
    className: cn("w-full py-20 flex items-center justify-center", className),
    ...props,
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-center space-x-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-24 h-0.5 bg-gradient-to-r from-transparent to-primary/20"
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex items-center justify-center",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-full border-2 border-primary/20 bg-background flex items-center justify-center shadow-lg",
          children: /*#__PURE__*/_jsx("div", {
            className: "w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("div", {
              className: "w-2 h-2 rounded-full bg-primary/30"
            })
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -top-1 -left-1 w-1 h-1 rounded-full bg-primary/40"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -top-1 -right-1 w-1 h-1 rounded-full bg-primary/40"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-primary/40"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -bottom-1 -right-1 w-1 h-1 rounded-full bg-primary/40"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "w-24 h-0.5 bg-gradient-to-l from-transparent to-primary/20"
      })]
    })
  });
}
export { ComponentSeparator };