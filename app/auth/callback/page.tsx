'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useMe } from '@/hooks/use-auth';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

function AuthCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  const { data: user, isSuccess } = useMe();

  useEffect(() => {
    const token = searchParams.get('accessToken');
    if (token) {
      setAccessToken(token);
      // Remove token from URL for security
      window.history.replaceState({}, '', '/auth/callback');
      Cookies.set('mm_authed', '1', { sameSite: 'lax' });
    }
  }, [searchParams, setAccessToken]);

  useEffect(() => {
    if (isSuccess && user) {
      router.replace('/browse');
    }
  }, [isSuccess, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-violet-400 mx-auto mb-4" size={36} />
        <p className="text-white/60">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={36} />
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}

