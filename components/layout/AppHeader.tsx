"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/context/SidebarContext";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { NotificationDropdown } from "@/components/header/NotificationDropdown";
import {
  Zap,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

// ── Component ─────────────────────────────────────────────────────────────────

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { user, clearAuth } = useAuthStore();
  const { mutate: logoutMutation } = useLogout();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // ⌘K shortcut focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logoutMutation(undefined, {
      onSettled: () => {
        clearAuth();
        router.replace("/login");
      },
    });
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[9999] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* ── Top bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* Hamburger */}
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 lg:h-11 lg:w-11 transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={16} />}
          </button>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white">
              Motion<span className="text-violet-500">Mesh</span>
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden lg:block">
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                <Search size={16} />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or type command..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-11 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-3 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-violet-700 xl:w-[430px] transition-colors"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-700 dark:bg-white/5 dark:text-gray-400">
                <span>⌘</span><span>K</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Right actions ─────────────────────────────────── */}
        <div className="flex items-center justify-end w-full gap-3 px-4 py-3 lg:px-0 lg:py-4 border-b border-gray-200 dark:border-gray-800 lg:border-b-0">

          {/* Theme toggle */}
          <ThemeToggleButton />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Divider */}
          <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* User avatar / dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              {/* Avatar circle */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                {initials}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90 leading-tight">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate max-w-[120px]">
                  {user?.email}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`hidden lg:block text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 z-50 overflow-hidden">
                {/* User card header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <Link
                    href="/account/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                  >
                    <User size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    Edit Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    Dashboard
                  </Link>
                  <Link
                    href="/browse"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                  >
                    <ShoppingBag size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    Browse Moves
                  </Link>

                  <div className="my-1 mx-1.5 border-t border-gray-100 dark:border-gray-800" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} className="shrink-0" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
