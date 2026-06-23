"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModeStore } from "@/stores/mode.store";
import { ActiveMode } from "@/types/enums";

/**
 * The authenticated landing route. It carries no content of its own — it sends
 * the user to the home of their active workspace. Buyer is the default; sellers
 * who left off in the seller workspace land on the seller dashboard. The active
 * mode is UI state only and is never an authorization input (the target route's
 * own guard still enforces capability). See Identity & Mode-Switching Spec §4.
 */
export default function WorkspaceHome() {
  const mode = useModeStore((s) => s.mode);
  const router = useRouter();

  useEffect(() => {
    router.replace(mode === ActiveMode.SELLER ? "/dashboard" : "/browse");
  }, [mode, router]);

  return null;
}
