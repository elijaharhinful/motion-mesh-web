"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxIconLine,
  DollarLineIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  PlugInIcon,
  PlusIcon,
  ShootingStarIcon,
  UserCircleIcon,
  VideoIcon,
} from "../icons/index";
import { useModeStore } from "@/stores/mode.store";
import { useAuthStore } from "@/stores/auth.store";
import { ActiveMode, UserRole } from "@/types/enums";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const buyerNav: NavItem[] = [
  { icon: <GridIcon />, name: "Browse", path: "/browse" },
  { icon: <VideoIcon />, name: "My Generations", path: "/account/generations" },
  { icon: <BoxIconLine />, name: "Purchases", path: "/account/purchases" },
  { icon: <UserCircleIcon />, name: "Account", path: "/profile" },
];

const sellerNav: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <VideoIcon />, name: "My Videos", path: "/dashboard/videos" },
  { icon: <PlusIcon />, name: "Upload Video", path: "/dashboard/videos/new" },
  {
    icon: <DollarLineIcon />,
    name: "Earnings & Payouts",
    path: "/dashboard/payouts",
  },
  { icon: <PlugInIcon />, name: "Settings", path: "/dashboard/settings" },
];

const adminNav: NavItem[] = [
  {
    icon: <ShootingStarIcon />,
    name: "Moderation",
    path: "/admin/moderation",
  },
  { icon: <GroupIcon />, name: "Users", path: "/admin/users" },
  { icon: <DollarLineIcon />, name: "Refunds", path: "/admin/refunds" },
  { icon: <BoxIconLine />, name: "Payouts", path: "/admin/payouts" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const mode = useModeStore((s) => s.mode);
  const user = useAuthStore((s) => s.user);

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(path + "/"),
    [pathname],
  );

  const onAdmin = pathname.startsWith("/admin");
  const showText = isExpanded || isHovered || isMobileOpen;

  let items: NavItem[];
  let sectionLabel: string;
  if (onAdmin && user?.role === UserRole.ADMIN) {
    items = adminNav;
    sectionLabel = "Admin";
  } else if (mode === ActiveMode.SELLER) {
    items = sellerNav;
    sectionLabel = "Seller";
  } else {
    items = buyerNav;
    sectionLabel = "Menu";
  }

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav) => (
        <li key={nav.name}>
          <Link
            href={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
          >
            <span
              className={
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }
            >
              {nav.icon}
            </span>
            {showText && <span className="menu-item-text">{nav.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 shadow-lg">
            <Zap size={18} className="text-white" />
          </span>
          {showText && (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              MotionMesh
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {showText ? sectionLabel : <HorizontaLDots />}
              </h2>
              {renderMenuItems(items)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
