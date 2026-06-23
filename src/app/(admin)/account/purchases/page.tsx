import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlaceholderPanel from "@/components/common/PlaceholderPanel";

export const metadata: Metadata = {
  title: "Purchases | MotionMesh",
  description: "Your purchased dance templates on MotionMesh.",
};

/**
 * Buyer's purchase history. Checkout and the purchase record arrive in M4;
 * this is the M1 shell.
 */
export default function PurchasesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Purchases" />
      <PlaceholderPanel
        icon={<ShoppingBag size={28} />}
        title="Your purchases will show up here"
        description="Templates you buy will be listed here, each one ready to take into the generation flow whenever you want a new video of yourself performing it."
        comingIn="Checkout arrives in M4"
      />
    </div>
  );
}
