"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useModeStore } from "@/stores/mode.store";
import { apiClient } from "@/lib/api-client";
import { ActiveMode } from "@/types/enums";
import { cn } from "@/lib/utils";

/**
 * The Buyer/Seller mode control (Upwork-style). Renders nothing for guests.
 * - Buyer-only accounts (no seller capability) get a "Become a Seller" CTA.
 * - Dual accounts get a Buyer⇄Seller toggle that swaps the workspace.
 * Switching never re-authenticates; it only changes active mode (UI state) and
 * routes to that mode's home. See Identity & Mode-Switching Spec §4.
 */
export function ModeSwitcher({ className }: { className?: string }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const router = useRouter();

  if (!isAuthenticated || !user) return null;

  if (!user.isSeller) {
    return (
      <Link
        href="/become-creator"
        className={cn(
          "text-sm font-medium px-3.5 py-2 rounded-lg border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors",
          className,
        )}
      >
        Become a Seller
      </Link>
    );
  }

  const switchTo = (next: ActiveMode) => {
    if (next === mode) return;
    setMode(next);
    // Persist as a best-effort UI preference; never blocks the switch.
    void apiClient
      .patch<unknown>("/users/me/active-mode", { mode: next })
      .catch(() => undefined);
    router.push(next === ActiveMode.SELLER ? "/dashboard" : "/browse");
  };

  const base =
    "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors";
  const active = "bg-brand-500 text-white shadow-sm";
  const inactive =
    "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white";

  return (
    <div
      role="group"
      aria-label="Workspace mode"
      className={cn(
        "inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-800 dark:bg-white/[0.03]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => switchTo(ActiveMode.BUYER)}
        aria-pressed={mode === ActiveMode.BUYER}
        className={cn(base, mode === ActiveMode.BUYER ? active : inactive)}
      >
        <ShoppingBag size={14} /> Buyer
      </button>
      <button
        type="button"
        onClick={() => switchTo(ActiveMode.SELLER)}
        aria-pressed={mode === ActiveMode.SELLER}
        className={cn(base, mode === ActiveMode.SELLER ? active : inactive)}
      >
        <Store size={14} /> Seller
      </button>
    </div>
  );
}
