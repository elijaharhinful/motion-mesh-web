"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UploadVideoForm from "@/components/videos/UploadVideoForm";
import { ProtectedPage } from "@/components/protected-page";

/**
 * Seller upload flow (M3): create a listing and push assets to storage via
 * presigned URLs, then optionally publish. Gated by SELLER capability.
 */
export default function UploadVideoPage() {
  return (
    <ProtectedPage requireSeller>
      <div>
        <PageBreadcrumb pageTitle="Upload Video" />
        <div className="mx-auto w-full max-w-3xl">
          <UploadVideoForm />
        </div>
      </div>
    </ProtectedPage>
  );
}
