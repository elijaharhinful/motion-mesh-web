"use client";

import { LayoutDashboard } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlaceholderPanel from "@/components/common/PlaceholderPanel";
import { ProtectedPage } from "@/components/protected-page";

/**
 * Seller workspace home. Gated by SELLER capability: a buyer-only user who
 * deep-links here is redirected to onboarding by ProtectedPage (capability is
 * checked on the server too; active mode is never the authorization input).
 * Listings, uploads, earnings, and stats arrive across M3 and M6.
 */
export default function SellerDashboardPage() {
  return (
    <ProtectedPage requireSeller>
      <div>
        <PageBreadcrumb pageTitle="Seller Dashboard" />
        <PlaceholderPanel
          icon={<LayoutDashboard size={28} />}
          title="Your seller workspace is ready"
          description="This is your home base for managing dance templates. Uploading and publishing listings comes next, followed by earnings and payouts."
          comingIn="Listings in M3 · Payouts in M6"
        />
      </div>
    </ProtectedPage>
  );
}
