"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // bikin helper sederhana di bawah
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Bell,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: ListChecks },
  { href: "/subscriptions/new", label: "Add Subscription", icon: PlusCircle },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}) {
  const pathname = usePathname();

  // Close drawer when route changes (mobile UX)
  useEffect(() => {
    setMobileOpen?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const Content = (
    <nav className="flex h-full w-72 flex-col gap-2 bg-white/80 p-4 backdrop-blur sm:rounded-none">
      <div className="mb-3 px-2">
        <Link
          href="/"
          className="block text-lg font-bold tracking-tight hover:opacity-90"
        >
          Subscription Helper
        </Link>
        <p className="text-xs text-muted-foreground">
          Control your recurring costs
        </p>
      </div>

      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active && "opacity-90")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-2 text-[11px] text-muted-foreground">
        v0.1 • MVP
      </div>
    </nav>
  );

  // Desktop (static left rail)
  // Mobile (slide-over drawer)
  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col md:border-r md:bg-background">
        {Content}
      </aside>

      {/* Mobile overlay & drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen?.(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 -translate-x-full bg-background shadow-lg transition-transform md:hidden",
          mobileOpen && "translate-x-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar navigation"
      >
        {Content}
      </aside>
    </>
  );
}
