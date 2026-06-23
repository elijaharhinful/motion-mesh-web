import type { Metadata } from "next";
import { Search } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlaceholderPanel from "@/components/common/PlaceholderPanel";

export const metadata: Metadata = {
  title: "Browse | MotionMesh",
  description: "Browse licensable dance motion templates on MotionMesh.",
};

/**
 * Buyer workspace home. The real marketplace (catalog, filters, search, preview
 * player) lands in M3; for now this is the shell the Buyer mode routes into.
 */
export default function BrowsePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Browse" />
      <PlaceholderPanel
        icon={<Search size={28} />}
        title="The marketplace is on its way"
        description="Soon you'll browse, search, and preview licensable dance templates from creators here, then make them yours with a single photo."
        comingIn="Catalog arrives in M3"
      />
    </div>
  );
}
