"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide global navbar and footer on routes that have their own layouts
  const isDashboardOrAccount = pathname.startsWith('/dashboard') || pathname.startsWith('/account');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const hideChrome = isDashboardOrAccount || isAuthPage;

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className={!hideChrome ? "pt-16" : ""}>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
