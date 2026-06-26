import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BrowseCatalog from "@/components/videos/BrowseCatalog";

export const metadata: Metadata = {
  title: "Browse | MotionMesh",
  description: "Browse licensable dance motion templates on MotionMesh.",
};

/**
 * Buyer workspace home: the marketplace catalogue with search, filters, sort,
 * and links into each template's detail page (M3).
 */
export default function BrowsePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Browse" />
      <BrowseCatalog />
    </div>
  );
}
