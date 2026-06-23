import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

/**
 * A single in-flight refresh shared across all callers. The backend rotates the
 * refresh token (single-use), so concurrent refreshes would race and log the
 * user out. De-duplicating to one refresh at a time prevents that.
 */
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        useAuthStore.getState().clearAuth();
        return null;
      }
      const body = (await res.json()) as { data?: { accessToken?: string } };
      const token = body?.data?.accessToken ?? null;
      if (token) useAuthStore.getState().setAccessToken(token);
      return token;
    } catch {
      useAuthStore.getState().clearAuth();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Fetch wrapper that:
 *   1. Injects the access token from the auth store
 *   2. Sends credentials for the HttpOnly refresh_token cookie
 *   3. On a 401, refreshes once (de-duplicated) and retries the request
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken } = useAuthStore.getState();

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
    const token = await refreshAccessToken();
    if (!token) {
      throw {
        statusCode: 401,
        message: "Session expired. Please log in again.",
      } as ApiError;
    }

    headers["Authorization"] = `Bearer ${token}`;
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

  /** Upload directly to an S3 pre-signed URL (no auth headers sent to S3). */
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!res.ok) throw new Error("S3 upload failed");
  },
};
