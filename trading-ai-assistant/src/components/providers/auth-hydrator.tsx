"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/client/auth-store";

export function AuthHydrator({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const reset = useAuthStore((state) => state.reset);

  useEffect(() => {
    const token = localStorage.getItem("aegis_token");
    const user = localStorage.getItem("aegis_user");
    if (token && user) {
      try {
        setAuth(token, JSON.parse(user));
      } catch {
        reset();
      }
    }
  }, [reset, setAuth]);

  return <>{children}</>;
}
