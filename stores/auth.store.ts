"use client";

import { create } from "zustand";
import { User } from "@/types/api.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
  isAuthenticated: false,
  updateUser: (partial) =>
    set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
}));
