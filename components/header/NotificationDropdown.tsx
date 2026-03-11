"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, X, ShoppingCart, Video, DollarSign, Star, CheckCheck } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type NotificationType = "purchase" | "video" | "payout" | "review";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ── Static demo notifications (MotionMesh-contextual) ─────────────────────────

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "purchase",
    title: "New Purchase",
    message: "Alex M. purchased your \"Hip-Hop Groove\" move pack.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "video",
    title: "Video Approved",
    message: "Your \"Breakdance Windmill\" video has been approved and is now live.",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "payout",
    title: "Payout Processed",
    message: "Your payout of $124.50 has been sent to your account.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "4",
    type: "review",
    title: "New Review",
    message: "Someone left a 5-star review on \"Contemporary Flow Vol. 2\".",
    time: "3 hr ago",
    read: true,
  },
  {
    id: "5",
    type: "purchase",
    title: "New Purchase",
    message: "Jordan P. purchased your \"Popping & Locking Basics\" move pack.",
    time: "5 hr ago",
    read: true,
  },
];

// ── Icon resolver ─────────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: NotificationType }) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center shrink-0";
  switch (type) {
    case "purchase":
      return (
        <div className={`${base} bg-violet-100 dark:bg-violet-500/20`}>
          <ShoppingCart size={18} className="text-violet-600 dark:text-violet-400" />
        </div>
      );
    case "video":
      return (
        <div className={`${base} bg-blue-100 dark:bg-blue-500/20`}>
          <Video size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
      );
    case "payout":
      return (
        <div className={`${base} bg-green-100 dark:bg-green-500/20`}>
          <DollarSign size={18} className="text-green-600 dark:text-green-400" />
        </div>
      );
    case "review":
      return (
        <div className={`${base} bg-amber-100 dark:bg-amber-500/20`}>
          <Star size={18} className="text-amber-500 dark:text-amber-400" />
        </div>
      );
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-full hover:text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        {/* Pulsing badge */}
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400" />
          </span>
        )}
        <Bell size={18} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[360px] max-h-[520px] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <h5 className="text-base font-semibold text-gray-800 dark:text-white">
                Notifications
              </h5>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <ul className="overflow-y-auto flex-1">
            {notifications.map((notif) => (
              <li key={notif.id}>
                <button
                  onClick={() => markRead(notif.id)}
                  className={`w-full flex gap-3 px-4 py-3.5 text-left border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors last:border-b-0 ${
                    notif.read ? "opacity-70" : ""
                  }`}
                >
                  <NotifIcon type={notif.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white/90 leading-tight">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-violet-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      {notif.time}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm font-medium text-center py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
