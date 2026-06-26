import { VideoCategory, VideoDifficulty, VideoStatus } from "@/types/enums";

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light";

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  [VideoCategory.HIP_HOP]: "Hip-Hop",
  [VideoCategory.AFROBEATS]: "Afrobeats",
  [VideoCategory.POP]: "Pop",
  [VideoCategory.LATIN]: "Latin",
  [VideoCategory.CONTEMPORARY]: "Contemporary",
  [VideoCategory.BALLET]: "Ballet",
  [VideoCategory.OTHER]: "Other",
};

export const DIFFICULTY_LABELS: Record<VideoDifficulty, string> = {
  [VideoDifficulty.BEGINNER]: "Beginner",
  [VideoDifficulty.INTERMEDIATE]: "Intermediate",
  [VideoDifficulty.ADVANCED]: "Advanced",
};

export const STATUS_BADGE: Record<
  VideoStatus,
  { label: string; color: BadgeColor }
> = {
  [VideoStatus.DRAFT]: { label: "Draft", color: "light" },
  [VideoStatus.PROCESSING]: { label: "Processing", color: "warning" },
  [VideoStatus.PUBLISHED]: { label: "Published", color: "success" },
  [VideoStatus.ARCHIVED]: { label: "Archived", color: "error" },
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(
  ([value, label]) => ({ value, label }),
);
