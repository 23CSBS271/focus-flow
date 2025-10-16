"use client";

import { useEffect, useRef } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ErrorReporter({
  error,
  reset
}) {
  /* ─ instrumentation shared by every route ─ */
  const lastOverlayMsg = useRef("");
  const pollRef = useRef();
  useEffect(() => {
    const inIframe = window.parent !== window;
    if (!inIframe) return;
    const send = payload => window.parent.postMessage(payload, "*");
    const onError = e => send({
      type: "ERROR_CAPTURED",
      error: {
        message: e.message,
        stack: e.error?.stack,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        source: "window.onerror"
      },
      timestamp: Date.now()
    });
    const onReject = e => send({
      type: "ERROR_CAPTURED",
      error: {
        message: e.reason?.message ?? String(e.reason),
        stack: e.reason?.stack,
        source: "unhandledrejection"
      },
      timestamp: Date.now()
    });
    const pollOverlay = () => {
      const overlay = document.querySelector("[data-nextjs-dialog-overlay]");
      const node = overlay?.querySelector("h1, h2, .error-message, [data-nextjs-dialog-body]") ?? null;
      const txt = node?.textContent ?? node?.innerHTML ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: {
            message: txt,
            source: "nextjs-dev-overlay"
          },
          timestamp: Date.now()
        });
      }
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = setInterval(pollOverlay, 1000);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      pollRef.current && clearInterval(pollRef.current);
    };
  }, []);

  /* ─ extra postMessage when on the global-error route ─ */
  useEffect(() => {
    if (!error) return;
    window.parent.postMessage({
      type: "global-error-reset",
      error: {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        name: error.name
      },
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }, "*");
  }, [error]);

  /* ─ ordinary pages render nothing ─ */
  if (!error) return null;

  /* ─ global-error UI ─ */
  return /*#__PURE__*/_jsx("html", {
    children: /*#__PURE__*/_jsx("body", {
      className: "min-h-screen bg-background text-foreground flex items-center justify-center p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-md w-full text-center space-y-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-2xl font-bold text-destructive",
            children: "Something went wrong!"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-muted-foreground",
            children: "An unexpected error occurred. Please try again fixing with Orchids"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "space-y-2",
          children: process.env.NODE_ENV === "development" && /*#__PURE__*/_jsxs("details", {
            className: "mt-4 text-left",
            children: [/*#__PURE__*/_jsx("summary", {
              className: "cursor-pointer text-sm text-muted-foreground hover:text-foreground",
              children: "Error details"
            }), /*#__PURE__*/_jsxs("pre", {
              className: "mt-2 text-xs bg-muted p-2 rounded overflow-auto",
              children: [error.message, error.stack && /*#__PURE__*/_jsx("div", {
                className: "mt-2 text-muted-foreground",
                children: error.stack
              }), error.digest && /*#__PURE__*/_jsxs("div", {
                className: "mt-2 text-muted-foreground",
                children: ["Digest: ", error.digest]
              })]
            })]
          })
        })]
      })
    })
  });
}