"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/context/SidebarContext";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Backdrop from "@/components/layout/Backdrop";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-950">
        <AppSidebar />
        <Backdrop />
        <div className="flex flex-1 flex-col xl:ml-[290px]">
          <AppHeader />
          <main className="p-4 mx-auto max-w-screen-2xl md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
