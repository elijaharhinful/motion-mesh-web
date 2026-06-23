"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActiveMode } from "@/types/enums";

/**
 * The single source of truth for the active workspace (Buyer vs Seller).
 * Persisted so a returning user restores their last workspace. Active mode is
 * UI/session state only — it is NEVER an authorization check (the backend
 * authorizes by capability/role). See the Identity & Mode-Switching Spec §5.
 */
interface ModeState {
  mode: ActiveMode;
  setMode: (mode: ActiveMode) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: ActiveMode.BUYER,
      setMode: (mode) => set({ mode }),
    }),
    { name: "mm_active_mode" },
  ),
);
