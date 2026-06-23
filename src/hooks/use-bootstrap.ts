"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export function useBootstrap() {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(!isAuthenticated);
  // The refresh token is single-use (rotated on the server). React StrictMode
  // double-invokes effects in dev, which would fire two refreshes and log the
  // user out on the second. Run the bootstrap exactly once.
  const didRun = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsBootstrapping(false);
      return;
    }
    if (didRun.current) return;
    didRun.current = true;

    let cancelled = false;

    (async () => {
      try {
        // 1. Use the HttpOnly refresh_token cookie to get a fresh access token
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (cancelled) return;

        if (!refreshRes.ok) {
          clearAuth();
          Cookies.remove("mm_authed");
          return;
        }

        const refreshBody = await refreshRes.json();
        const token: string =
          refreshBody?.data?.accessToken ?? refreshBody?.accessToken;

        if (!token) {
          clearAuth();
          return;
        }

        // 2. Use the new token to fetch the full user profile
        const meRes = await fetch(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (cancelled) return;

        if (!meRes.ok) {
          clearAuth();
          Cookies.remove("mm_authed");
          return;
        }

        const meBody = await meRes.json();
        const user = meBody?.data ?? meBody;

        // 3. Fully hydrate Zustand — sets user, accessToken AND isAuthenticated: true
        setAuth(user, token);
        Cookies.set("mm_authed", "1", { sameSite: "lax" });
      } catch {
        if (!cancelled) {
          clearAuth();
          Cookies.remove("mm_authed");
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isBootstrapping };
}
