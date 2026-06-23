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
          "text-sm px-3 py-1.5 rounded-lg border border-brand-500/40 text-brand-300 hover:border-brand-400 hover:text-brand-200 transition-all",
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
  const active = "bg-brand-600 text-white shadow-sm";
  const inactive = "text-white/60 hover:text-white";

  return (
    <div
      role="group"
      aria-label="Workspace mode"
      className={cn(
        "inline-flex items-center rounded-lg border border-white/15 bg-white/5 p-0.5",
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
