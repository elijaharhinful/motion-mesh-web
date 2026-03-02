'use client';

import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedPage({ children, requiredRole }: ProtectedPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole && user?.role !== UserRole.ADMIN) {
      router.replace('/');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated()) return null;
  if (requiredRole && user?.role !== requiredRole && user?.role !== UserRole.ADMIN) return null;

  return <>{children}</>;
}
