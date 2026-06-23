"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, User } from "@/types/api.types";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = params.get("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Establish the session, then load the user and continue.
    useAuthStore.getState().setAccessToken(token);
    Cookies.set("mm_authed", "1", { sameSite: "lax" });

    apiClient
      .get<ApiResponse<User>>("/users/me")
      .then((res) => {
        useAuthStore.getState().setAuth(res.data, token);
        router.replace("/");
      })
      .catch(() => router.replace("/login"));
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <Loader2 className="animate-spin text-brand-500" size={32} />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
