"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  DanceVideo,
  PresignedUrlData,
  PublicVideoView,
  SellerVideoView,
} from "@/types/api.types";
import { VideoCategory, VideoDifficulty, VideoSort } from "@/types/enums";

export interface VideoFilters {
  creatorId?: string;
  category?: VideoCategory;
  difficulty?: VideoDifficulty;
  minPriceCents?: number;
  maxPriceCents?: number;
  search?: string;
  sort?: VideoSort;
}

// ---------------------------------------------------------------------------
// GET /videos  (public marketplace catalogue)
// ---------------------------------------------------------------------------

export function useVideos(filters: VideoFilters = {}) {
  const params = new URLSearchParams();
  if (filters.creatorId) params.set("creatorId", filters.creatorId);
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.minPriceCents !== undefined)
    params.set("minPriceCents", String(filters.minPriceCents));
  if (filters.maxPriceCents !== undefined)
    params.set("maxPriceCents", String(filters.maxPriceCents));
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);

  const qs = params.toString();

  return useQuery({
    queryKey: ["videos", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PublicVideoView[]>>(
        `/videos${qs ? `?${qs}` : ""}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

// ---------------------------------------------------------------------------
// GET /videos/:id  (public detail, includes signed preview URL)
// ---------------------------------------------------------------------------

export function useVideo(id: string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PublicVideoView>>(
        `/videos/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// GET /videos/mine  (seller's own listings, any status)
// ---------------------------------------------------------------------------

export function useMyVideos() {
  return useQuery({
    queryKey: ["myVideos"],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<SellerVideoView[]>>("/videos/mine");
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// POST /videos  (seller) — returns the raw listing so the caller has its id
// ---------------------------------------------------------------------------

export function useCreateVideo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      title: string;
      description?: string;
      difficulty: VideoDifficulty;
      category: VideoCategory;
      priceCents: number;
    }) => {
      const res = await apiClient.post<ApiResponse<DanceVideo>>(
        "/videos",
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
    },
  });
}

// ---------------------------------------------------------------------------
// PATCH /videos/:id  (seller, owner)
// ---------------------------------------------------------------------------

export function useUpdateVideo(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      title?: string;
      description?: string;
      difficulty?: VideoDifficulty;
      category?: VideoCategory;
      priceCents?: number;
    }) => {
      const res = await apiClient.patch<ApiResponse<SellerVideoView>>(
        `/videos/${id}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video", id] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
    },
  });
}

// ---------------------------------------------------------------------------
// DELETE /videos/:id  (seller, owner)
// ---------------------------------------------------------------------------

export function useDeleteVideo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/videos/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
    },
  });
}

// ---------------------------------------------------------------------------
// POST /videos/:id/publish  and  /unpublish  (seller, owner)
// ---------------------------------------------------------------------------

export function usePublishVideo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post<ApiResponse<SellerVideoView>>(
        `/videos/${id}/publish`,
      );
      return res.data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["video", id] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useUnpublishVideo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post<ApiResponse<SellerVideoView>>(
        `/videos/${id}/unpublish`,
      );
      return res.data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["video", id] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

// ---------------------------------------------------------------------------
// POST /videos/:id/presigned-url  (seller, owner)
// ---------------------------------------------------------------------------

export function usePresignedUrl(videoId: string) {
  return useMutation({
    mutationFn: async (body: {
      fileType: "original" | "preview" | "thumbnail";
      contentType: string;
    }) => {
      const res = await apiClient.post<ApiResponse<PresignedUrlData>>(
        `/videos/${videoId}/presigned-url`,
        body,
      );
      return res.data;
    },
  });
}
