'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { useBootstrap } from '@/hooks/use-bootstrap';
import { Loader2 } from 'lucide-react';

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isBootstrapping } = useBootstrap();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <Loader2 className="animate-spin text-violet-400" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
