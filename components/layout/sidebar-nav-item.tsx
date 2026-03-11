"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SidebarNavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function SidebarNavItem({ href, label, icon, onClick }: SidebarNavItemProps) {
  const pathname = usePathname();
  // Exact match or sub-route match (e.g. /dashboard handles /dashboard/videos too? No, /dashboard is root. So usually exact match for root, startsWith for others)
  const isActive = href === '/dashboard' || href === '/account' 
    ? pathname === href 
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/10',
        isActive ? 'bg-white/10 font-semibold text-white' : 'text-gray-400'
      )}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {label}
    </Link>
  );
}
