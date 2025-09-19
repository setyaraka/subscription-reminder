// components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu, Bell,
  Sun, Moon, User, LogOut, ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type BoolSetter = (value: boolean | ((prev: boolean) => boolean)) => void;

type Notification = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  badge?: "danger" | "warn" | "info";
};

export default function Navbar({
  collapsed,
  setCollapsed,
  setMobileOpen,
  user,
  onLogout,
  notifications = [],
  locale = "id",
  onLocaleChange,
}: {
  collapsed: boolean;
  setCollapsed: BoolSetter;
  setMobileOpen: BoolSetter;
  user?: { name?: string; email?: string; avatarUrl?: string };
  onLogout?: () => void;              // optional: integrasi NextAuth signOut()
  notifications?: Notification[];
  locale?: "id" | "en";
  onLocaleChange?: (loc: "id" | "en") => void;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // --- Search ---
  const [q, setQ] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/subscriptions?q=${encodeURIComponent(q.trim())}`);
  };

  // --- Dropdown states ---
  const [openNotif, setOpenNotif] = useState(false);
  const [openUser, setOpenUser]   = useState(false);

  // Close dropdown when click outside
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(ev.target as Node)) {
        setOpenNotif(false);
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.length;

  return (
    <header
      ref={wrapRef}
      className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-white/80 px-3 py-3 backdrop-blur dark:bg-neutral-900/80"
    >
      {/* Left cluster: toggles */}
      <div className="flex items-center gap-2">
        {/* Mobile: open drawer */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-neutral-800"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop: collapse/expand */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden rounded-lg p-2 hover:bg-gray-100 md:inline-flex dark:hover:bg-neutral-800"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="hidden text-sm font-semibold sm:inline">
          Subscription Helper
        </span>
      </div>

      {/* Right cluster: locale, theme, notifications, user */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Locale toggle */}
        <div className="hidden items-center gap-1 rounded-lg border px-1 py-1 sm:flex dark:border-neutral-800">
          <button
            onClick={() => onLocaleChange?.("id")}
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              locale === "id" ? "bg-gray-900 text-white dark:bg-neutral-700" : "hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
          >
            ID
          </button>
          <button
            onClick={() => onLocaleChange?.("en")}
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              locale === "en" ? "bg-gray-900 text-white dark:bg-neutral-700" : "hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
          >
            EN
          </button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
            aria-haspopup="menu"
            aria-expanded={openNotif}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="px-3 py-2 text-sm font-medium">Notifications</div>
              <ul className="max-h-80 divide-y overflow-auto text-sm dark:divide-neutral-800">
                {notifications.length === 0 ? (
                  <li className="px-3 py-3 text-gray-500">No notifications</li>
                ) : (
                  notifications.map((n) => (
                    <li key={n.id} className="flex items-start gap-2 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/60">
                      <span className={cn(
                        "mt-1 h-2.5 w-2.5 rounded-full",
                        n.badge === "danger" ? "bg-red-500" :
                        n.badge === "warn"   ? "bg-amber-500" : "bg-blue-500"
                      )}/>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{n.title}</div>
                        {n.subtitle && <div className="truncate text-xs text-gray-500">{n.subtitle}</div>}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpenUser((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800"
            aria-haspopup="menu"
            aria-expanded={openUser}
          >
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 dark:bg-neutral-700 dark:text-white">
                {(user?.name?.[0] ?? "N").toUpperCase()}
              </div>
            )}
            <ChevronDown className="hidden h-4 w-4 sm:block" />
          </button>

          {openUser && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="px-3 py-3">
                <div className="text-sm font-medium">{user?.name ?? "User"}</div>
                <div className="truncate text-xs text-gray-500">{user?.email ?? ""}</div>
              </div>
              <div className="h-px bg-gray-100 dark:bg-neutral-800" />
              <button
                onClick={() => router.push("/settings")}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800/60"
              >
                <User className="h-4 w-4" /> Profile & Settings
              </button>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800/60"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
