"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { BecomeCreatorForm } from "@/components/creators/BecomeCreatorForm";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Seller onboarding entry point. Buyer-only users reach this from the "Become a
 * Seller" CTA or by deep-linking a seller route. Users who are already sellers
 * are sent straight to their dashboard.
 */
export default function BecomeCreatorPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.isSeller) router.replace("/dashboard");
  }, [user?.isSeller, router]);

  if (user?.isSeller) return null;

  return (
    <div>
      <PageBreadcrumb pageTitle="Become a Seller" />
      <div className="mx-auto w-full max-w-2xl">
        <BecomeCreatorForm />
      </div>
    </div>
  );
}
