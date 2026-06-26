// Identity model: docs/MotionMesh_Identity_and_ModeSwitching_Spec_v1_0.md
// `role` gates admin only; selling is a capability (isSeller); there is no `creator` role.
export enum UserRole {
  MEMBER = "member",
  ADMIN = "admin",
}

// Active workspace — UI/session state only, never an authorization input.
export enum ActiveMode {
  BUYER = "buyer",
  SELLER = "seller",
}

export enum VideoDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum VideoCategory {
  HIP_HOP = "hip-hop",
  AFROBEATS = "afrobeats",
  POP = "pop",
  LATIN = "latin",
  CONTEMPORARY = "contemporary",
  BALLET = "ballet",
  OTHER = "other",
}

export enum VideoStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum VideoSort {
  NEWEST = "newest",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

export enum PurchaseStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum GenerationJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}
