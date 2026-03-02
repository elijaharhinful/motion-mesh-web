'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { UserRole } from '@/types/enums';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const authed = isAuthenticated();
  const isCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.ADMIN;

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => router.push('/') });
  };

  const navLinks = [
    { href: '/browse', label: 'Browse' },
    ...(authed ? [{ href: '/account/purchases', label: 'My Library' }] : []),
    ...(isCreator ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Motion<span className="text-violet-400">Mesh</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname.startsWith(l.href)
                    ? 'text-violet-400'
                    : 'text-white/70 hover:text-white',
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {authed ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/account/profile"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:border-white/50 hover:text-white transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors shadow-lg shadow-violet-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-4 pb-6 pt-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-white/80 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {authed ? (
              <button onClick={handleLogout} className="w-full text-left py-2 text-white/70 hover:text-white">
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-white/80">Login</Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 px-4 rounded-lg bg-violet-600 text-white text-center font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
