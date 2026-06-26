import {
  UserRole,
  ActiveMode,
  VideoDifficulty,
  VideoCategory,
  VideoStatus,
  PurchaseStatus,
  GenerationJobStatus,
} from "./enums";

// ---------------------------------------------------------------------------
// Standard API response envelope
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  _message: string;
  data: T;
}

// ---------------------------------------------------------------------------
// Domain objects
// ---------------------------------------------------------------------------

export interface CreatorProfile {
  id: string;
  userId: string;
  user?: User;
  displayName: string;
  bio: string | null;
  socialLink: string | null;
  status: "active" | "suspended";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole; // 'member' | 'admin'
  isSeller: boolean; // derived: an active CreatorProfile exists → show mode toggle
  lastActiveMode: ActiveMode | null; // UI preference; default 'buyer'
  isEmailVerified: boolean;
  googleId: string | null;
  avatarUrl: string | null;
  creatorProfile: CreatorProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface DanceVideo {
  id: string;
  creatorId: string;
  creator?: CreatorProfile;
  title: string;
  description: string | null;
  difficulty: VideoDifficulty;
  category: VideoCategory;
  priceCents: number;
  status: VideoStatus;
  originalS3Key: string | null;
  previewS3Key: string | null;
  thumbnailS3Key: string | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

// Public marketplace shape. Raw S3 keys (especially the original) are never
// sent to the client; the API returns signed, time-limited URLs instead.
export interface PublicVideoCreator {
  id: string;
  displayName: string;
  isVerified: boolean;
  avatarUrl: string | null;
}

export interface PublicVideoView {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  difficulty: VideoDifficulty;
  category: VideoCategory;
  priceCents: number;
  status: VideoStatus;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  creator: PublicVideoCreator | null;
  createdAt: string;
  updatedAt: string;
}

// Seller-facing view of their own listing, with upload-completeness flags.
export interface SellerVideoView {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  difficulty: VideoDifficulty;
  category: VideoCategory;
  priceCents: number;
  status: VideoStatus;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  hasOriginal: boolean;
  hasPreview: boolean;
  hasThumbnail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  videoId: string;
  video?: DanceVideo;
  stripePaymentIntentId: string;
  amountCents: number;
  platformFeeCents: number;
  creatorPayoutCents: number;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationJob {
  id: string;
  userId: string;
  purchaseId: string;
  klingTaskId: string | null;
  facePhotoS3Key: string;
  resultVideoS3Key: string | null;
  resultVideoUrl: string | null;
  status: GenerationJobStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Auth response helpers
// ---------------------------------------------------------------------------

export interface AuthData {
  user: User;
  accessToken: string;
}

export interface PaymentIntentData {
  clientSecret: string;
  purchaseId: string;
}

export interface PresignedUrlData {
  url: string;
  key: string;
}

export interface RefreshData {
  accessToken: string;
}

// ---------------------------------------------------------------------------
// API error shape
// ---------------------------------------------------------------------------

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
