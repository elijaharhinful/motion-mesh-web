"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SellerVideoList from "@/components/videos/SellerVideoList";
import { ProtectedPage } from "@/components/protected-page";

/**
 * Seller "My Videos" — manage listings, upload assets, publish/unpublish, and
 * delete. Gated by SELLER capability (M3).
 */
export default function SellerVideosPage() {
  return (
    <ProtectedPage requireSeller>
      <div>
        <PageBreadcrumb pageTitle="My Videos" />
        <SellerVideoList />
      </div>
    </ProtectedPage>
  );
}
