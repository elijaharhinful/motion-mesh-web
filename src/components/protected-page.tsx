'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useModeStore } from '@/stores/mode.store';
import { UserRole, ActiveMode } from '@/types/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
  /** Gate on account role (admin). */
  requiredRole?: UserRole;
  /**
   * Gate on SELLER capability (`isSeller`). Admins bypass. A buyer-only user is
   * sent to onboarding (not bounced home), and entering a seller page syncs the
   * active workspace to Seller. See Identity & Mode-Switching Spec §4.5/§7.
   */
  requireSeller?: boolean;
}

export function ProtectedPage({
  children,
  requiredRole,
  requireSeller,
}: ProtectedPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const setMode = useModeStore((s) => s.setMode);
  const router = useRouter();

  const isAdmin = user?.role === UserRole.ADMIN;
  const roleDenied = requiredRole && user?.role !== requiredRole && !isAdmin;
  const sellerDenied = requireSeller && !user?.isSeller && !isAdmin;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (roleDenied) {
      router.replace('/');
      return;
    }
    if (sellerDenied) {
      router.replace('/become-creator');
      return;
    }
    // Allowed into a seller page → keep the active workspace in sync.
    if (requireSeller) {
      setMode(ActiveMode.SELLER);
    }
  }, [isAuthenticated, roleDenied, sellerDenied, requireSeller, router, setMode]);

  if (!isAuthenticated || roleDenied || sellerDenied) return null;

  return <>{children}</>;
}
