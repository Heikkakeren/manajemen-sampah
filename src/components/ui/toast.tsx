"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid rgba(100, 116, 139, 0.3)",
          borderRadius: "12px",
        },
      }}
      richColors
    />
  );
}
