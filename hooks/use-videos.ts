"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, DanceVideo, PresignedUrlData } from "@/types/api.types";
import { VideoCategory, VideoDifficulty } from "@/types/enums";

export interface VideoFilters {
  category?: VideoCategory;
  difficulty?: VideoDifficulty;
  minPriceCents?: number;
  maxPriceCents?: number;
}

// ---------------------------------------------------------------------------
// GET /videos  (public)
// ---------------------------------------------------------------------------

export function useVideos(filters: VideoFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.minPriceCents !== undefined)
    params.set("minPriceCents", String(filters.minPriceCents));
  if (filters.maxPriceCents !== undefined)
    params.set("maxPriceCents", String(filters.maxPriceCents));

  const qs = params.toString();

  return useQuery({
    queryKey: ["videos", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DanceVideo[]>>(
        `/videos${qs ? `?${qs}` : ""}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

// ---------------------------------------------------------------------------
// GET /videos/:id  (public)
// ---------------------------------------------------------------------------

export function useVideo(id: string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DanceVideo>>(`/videos/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// POST /videos  (creator)
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
// PATCH /videos/:id  (creator, owner)
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
      const res = await apiClient.patch<ApiResponse<DanceVideo>>(
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
// DELETE /videos/:id  (creator, owner)
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
// POST /videos/:id/publish  (creator, owner)
// ---------------------------------------------------------------------------

export function usePublishVideo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post<ApiResponse<DanceVideo>>(
        `/videos/${id}/publish`,
      );
      return res.data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["video", id] });
      qc.invalidateQueries({ queryKey: ["myVideos"] });
    },
  });
}

// ---------------------------------------------------------------------------
// POST /videos/:id/presigned-url  (creator, owner)
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
