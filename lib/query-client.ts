import { QueryClient } from "@tanstack/react-query";

let queryClientInstance: QueryClient | undefined;

export function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    });
  }
  return queryClientInstance;
}
