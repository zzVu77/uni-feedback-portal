// src/components/sw-register.tsx
"use client";
import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.warn("SW registered:", reg.scope))
        .catch((err) => console.error("SW error:", err));
    }
  }, []);
  return null;
}
