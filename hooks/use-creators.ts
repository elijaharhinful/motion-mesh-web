"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, CreatorProfile } from "@/types/api.types";

// ---------------------------------------------------------------------------
// GET /creators  (public)
// ---------------------------------------------------------------------------

export function useCreators() {
  return useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<CreatorProfile[]>>("/creators");
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// GET /creators/:id  (public)
// ---------------------------------------------------------------------------

export function useCreator(id: string) {
  return useQuery({
    queryKey: ["creator", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<CreatorProfile>>(
        `/creators/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// GET /creators/me  (auth)
// ---------------------------------------------------------------------------

export function useMyCreatorProfile() {
  return useQuery({
    queryKey: ["creatorMe"],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<CreatorProfile>>("/creators/me");
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// POST /creators/apply  (auth)
// ---------------------------------------------------------------------------

export function useApplyCreator() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: { bio?: string; socialLink?: string }) => {
      const res = await apiClient.post<ApiResponse<CreatorProfile>>(
        "/creators/apply",
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["creatorMe"] });
    },
  });
}

// ---------------------------------------------------------------------------
// PATCH /creators/me  (auth)
// ---------------------------------------------------------------------------

export function useUpdateCreatorProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: { bio?: string; socialLink?: string }) => {
      const res = await apiClient.patch<ApiResponse<CreatorProfile>>(
        "/creators/me",
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creatorMe"] });
    },
  });
}
