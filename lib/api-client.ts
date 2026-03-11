import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

/**
 * Minimal fetch wrapper that:
 *   1. Injects the access token from Zustand authStore
 *   2. Sets credentials: 'include' for the HttpOnly refresh_token cookie
 *   3. Auto-retries once after calling POST /auth/refresh if a 401 is returned
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, setAccessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && !path.startsWith("/auth/")) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { data } = await refreshRes.json();
      setAccessToken(data.accessToken);

      headers["Authorization"] = `Bearer ${data.accessToken}`;

      const retryRes = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
      });

      if (!retryRes.ok) {
        const errBody = await retryRes.json().catch(() => ({}));
        throw errBody as ApiError;
      }

      if (retryRes.status === 204) return undefined as T;
      return retryRes.json() as Promise<T>;
    } else {
      // Refresh failed — clear auth state
      useAuthStore.getState().clearAuth();
      throw {
        statusCode: 401,
        message: "Session expired. Please log in again.",
      } as ApiError;
    }
  }

  if (!res.ok) {
    const errBody = await res
      .json()
      .catch(() => ({ statusCode: res.status, message: res.statusText }));
    throw errBody as ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  /** Upload directly to S3 pre-signed URL (no auth headers sent to S3) */
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!res.ok) throw new Error("S3 upload failed");
  },
};
