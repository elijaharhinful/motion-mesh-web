import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | MotionMesh",
  description: "Reset your MotionMesh password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
