"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { ApiResponse, AuthData, RefreshData, User } from "@/types/api.types";
import Cookies from "js-cookie";

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

export function useLogin() {
  const { setAuth } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await apiClient.post<ApiResponse<AuthData>>(
        "/auth/login",
        body,
      );
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      // Lightweight cookie so middleware can detect auth on next navigation
      Cookies.set("mm_authed", "1", { sameSite: "lax" });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

// ---------------------------------------------------------------------------
// register
// ---------------------------------------------------------------------------

export function useRegister() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const res = await apiClient.post<ApiResponse<AuthData>>(
        "/auth/register",
        body,
      );
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      Cookies.set("mm_authed", "1", { sameSite: "lax" });
    },
  });
}

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {
      clearAuth();
      Cookies.remove("mm_authed");
      qc.clear();
    },
  });
}

// ---------------------------------------------------------------------------
// GET /users/me
// ---------------------------------------------------------------------------

export function useMe() {
  const { accessToken, setAuth } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<User>>("/users/me");
      return res.data;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// PATCH /users/me
// ---------------------------------------------------------------------------

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    }) => {
      const res = await apiClient.patch<ApiResponse<User>>("/users/me", body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
