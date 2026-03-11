"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/context/SidebarContext";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-auth";
import {
  Zap,
  LayoutDashboard,
  Video,
  Upload,
  DollarSign,
  Settings,
  User,
  ShoppingBag,
  Ellipsis,
  TrendingUp,
} from "lucide-react";

// ── Nav definitions ──────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const creatorNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, name: "Overview",     path: "/dashboard" },
  { icon: <Video size={20} />,          name: "My Videos",    path: "/dashboard/videos" },
  { icon: <Upload size={20} />,         name: "Upload Video", path: "/dashboard/videos/new" },
  { icon: <DollarSign size={20} />,     name: "Payouts",      path: "/dashboard/payouts" },
  { icon: <Settings size={20} />,       name: "Settings",     path: "/dashboard/settings" },
];

const accountNavItems: NavItem[] = [
  { icon: <User size={20} />,       name: "Profile",      path: "/account/profile" },
  { icon: <ShoppingBag size={20} />, name: "My Purchases", path: "/account/purchases" },
];

// ── Shared classes ────────────────────────────────────────────────────────────

const itemBase =
  "relative flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150";
const itemActive =
  "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400";
const itemInactive =
  "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5";
const iconActive = "text-violet-600 dark:text-violet-400";
const iconInactive = "text-gray-500 dark:text-gray-400";

// ── Component ─────────────────────────────────────────────────────────────────

interface AppSidebarProps {
  variant?: "creator" | "account";
}

const AppSidebar: React.FC<AppSidebarProps> = ({ variant = "creator" }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const isCreator = !!user?.creatorProfile;

  let navItems: NavItem[] = [];
  let sectionLabel = "";

  if (isCreator) {
    if (variant === "account") {
      navItems = accountNavItems;
      sectionLabel = "My Account";
    } else {
      navItems = creatorNavItems;
      sectionLabel = "Creator Studio";
    }
  } else {
    // Normal users see unified nav
    navItems = [
      { icon: <LayoutDashboard size={20} />, name: "Overview",     path: "/dashboard" },
      { icon: <ShoppingBag size={20} />, name: "My Purchases", path: "/account/purchases" },
      { icon: <User size={20} />,       name: "Profile",      path: "/account/profile" },
    ];
    sectionLabel = "My Dashboard";
  }

  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const showText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 shadow-lg">
            <Zap size={16} className="text-white" />
          </div>
          {showText && (
            <span className="text-gray-800 dark:text-white font-bold text-lg tracking-tight">
              Motion<span className="text-violet-500">Mesh</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <div className="flex flex-col overflow-y-auto no-scrollbar flex-1 gap-6">
        <nav>
          {/* Section label */}
          <h2
            className={`mb-3 text-[11px] font-semibold uppercase tracking-wider flex leading-5 text-gray-400 dark:text-gray-500 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {showText ? sectionLabel : <Ellipsis size={16} />}
          </h2>

          <ul className="flex flex-col gap-0.5">
            {navItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  href={nav.path}
                  className={`${itemBase} ${isActive(nav.path) ? itemActive : itemInactive} ${
                    !isExpanded && !isHovered ? "lg:justify-center" : ""
                  }`}
                >
                  <span className={isActive(nav.path) ? iconActive : iconInactive}>
                    {nav.icon}
                  </span>
                  {showText && (
                    <span className="truncate">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Cross-section links */}
        {showText && (
          <nav>
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {isCreator ? (variant === "creator" ? "Account" : "Creator") : "Earn"}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {isCreator ? (
                variant === "creator" ? (
                  <li>
                    <Link href="/account/profile" className={`${itemBase} ${itemInactive}`}>
                      <span className={iconInactive}><User size={20} /></span>
                      <span className="truncate">My Account</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/dashboard" className={`${itemBase} ${itemInactive}`}>
                      <span className={iconInactive}><LayoutDashboard size={20} /></span>
                      <span className="truncate">Creator Dashboard</span>
                    </Link>
                  </li>
                )
              ) : (
                <li>
                  <Link href="/become-creator" className={`${itemBase} text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10`}>
                    <span className="text-violet-600 dark:text-violet-400"><TrendingUp size={20} /></span>
                    <span className="truncate font-semibold">Become a Creator</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      {/* ── User info ────────────────────────────── */}
      <div className="pb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        {showText && user && (
          <div className="mb-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80">
            <p className="text-xs font-semibold text-gray-800 dark:text-white/90 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {user.email}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
