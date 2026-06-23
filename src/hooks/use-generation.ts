"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, GenerationJob } from "@/types/api.types";
import { GenerationJobStatus } from "@/types/enums";

// ---------------------------------------------------------------------------
// POST /ai/generate
// ---------------------------------------------------------------------------

export function useStartGeneration() {
  return useMutation({
    mutationFn: async (body: {
      purchaseId: string;
      facePhotoS3Key: string;
    }) => {
      const res = await apiClient.post<ApiResponse<GenerationJob>>(
        "/ai/generate",
        body,
      );
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// GET /ai/jobs/:id  — with polling
// ---------------------------------------------------------------------------

export function useJobStatus(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<GenerationJob>>(
        `/ai/jobs/${jobId}`,
      );
      return res.data;
    },
    enabled: !!jobId,
    // Poll every 5 seconds while the job is still in progress
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 5000;
      const done =
        status === GenerationJobStatus.COMPLETED ||
        status === GenerationJobStatus.FAILED;
      return done ? false : 5000;
    },
  });
}
