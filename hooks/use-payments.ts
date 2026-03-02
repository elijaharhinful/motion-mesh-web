"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, PaymentIntentData, Purchase } from "@/types/api.types";

// ---------------------------------------------------------------------------
// POST /payments/intent
// ---------------------------------------------------------------------------

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async (videoId: string) => {
      const res = await apiClient.post<ApiResponse<PaymentIntentData>>(
        "/payments/intent",
        {
          videoId,
        },
      );
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// GET /payments/history
// ---------------------------------------------------------------------------

export function usePurchaseHistory() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<Purchase[]>>("/payments/history");
      return res.data;
    },
  });
}
