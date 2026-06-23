import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailView from "@/components/auth/VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify Email | MotionMesh",
  description: "Verify your MotionMesh email address.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailView />
    </Suspense>
  );
}
