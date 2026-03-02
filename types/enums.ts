export enum UserRole {
  USER = "user",
  CREATOR = "creator",
  ADMIN = "admin",
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
