import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
  title: "FocusFlow - Next-Gen Task Management",
  description: "Beautiful and powerful task management for modern teams"
};
export default function RootLayout({
  children
}) {
  return /*#__PURE__*/_jsx("html", {
    lang: "en",
    children: /*#__PURE__*/_jsx("body", {
      className: "antialiased",
      children: /*#__PURE__*/_jsxs(Providers, {
        children: [/*#__PURE__*/_jsx(ErrorReporter, {}), /*#__PURE__*/_jsx(Script, {
          src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js",
          strategy: "afterInteractive",
          "data-target-origin": "*",
          "data-message-type": "ROUTE_CHANGE",
          "data-include-search-params": "true",
          "data-only-in-iframe": "true",
          "data-debug": "true",
          "data-custom-data": "{\"appName\": \"YourApp\", \"version\": \"1.0.0\", \"greeting\": \"hi\"}"
        }), children, /*#__PURE__*/_jsx(VisualEditsMessenger, {})]
      })
    })
  });
}