import type { Metadata } from "next";
import { Store } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlaceholderPanel from "@/components/common/PlaceholderPanel";

export const metadata: Metadata = {
  title: "Become a Seller | MotionMesh",
  description: "Unlock the seller workspace and license your dance templates.",
};

/**
 * Onboarding entry point. Buyer-only users reach this from the "Become a
 * Seller" CTA, or by deep-linking a seller route. The actual onboarding form
 * (which creates a CreatorProfile and unlocks seller mode without changing
 * role) is built in M2; this is the M1 shell destination.
 */
export default function BecomeCreatorPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Become a Seller" />
      <PlaceholderPanel
        icon={<Store size={28} />}
        title="Sell your choreography on MotionMesh"
        description="Becoming a seller unlocks the seller workspace where you'll upload dance templates, manage listings, and earn 70% of every sale. The onboarding form is coming next."
        comingIn="Seller onboarding arrives in M2"
      />
    </div>
  );
}
