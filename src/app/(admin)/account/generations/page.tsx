import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlaceholderPanel from "@/components/common/PlaceholderPanel";

export const metadata: Metadata = {
  title: "My Generations | MotionMesh",
  description: "Your AI-generated dance videos on MotionMesh.",
};

/**
 * Buyer's generated-video library. The AI generation pipeline (photo upload →
 * Kling → downloadable result) is built in M5; this is the M1 shell.
 */
export default function MyGenerationsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="My Generations" />
      <PlaceholderPanel
        icon={<Sparkles size={28} />}
        title="Your generated videos will live here"
        description="After you purchase a template and upload a photo, the personalized videos we generate for you will appear here, ready to download."
        comingIn="AI generation arrives in M5"
      />
    </div>
  );
}
