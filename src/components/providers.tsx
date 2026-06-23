'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { useBootstrap } from '@/hooks/use-bootstrap';
import { Loader2 } from 'lucide-react';

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isBootstrapping } = useBootstrap();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * App-wide data providers (React Query + session bootstrap).
 * Theme + Sidebar providers come from TailAdmin and wrap this in the root layout.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  );
}
