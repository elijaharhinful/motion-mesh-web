'use client';

import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireCreator?: boolean;
}

export function ProtectedPage({ children, requiredRole, requireCreator }: ProtectedPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole && user?.role !== UserRole.ADMIN) {
      router.replace('/');
      return;
    }
    if (requireCreator && !user?.creatorProfile && user?.role !== UserRole.ADMIN) {
      router.replace('/creators');
      return;
    }
  }, [isAuthenticated, user, requiredRole, requireCreator, router]);

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole && user?.role !== UserRole.ADMIN) return null;
  if (requireCreator && !user?.creatorProfile && user?.role !== UserRole.ADMIN) return null;

  return <>{children}</>;
}
