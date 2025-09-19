"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ListChecks, PlusCircle, Bell, Settings,
} from "lucide-react";
import { useEffect } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: ListChecks },
  { href: "/subscriptions-new", label: "Add Subscription", icon: PlusCircle },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  collapsed,              // <<< NEW
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
  collapsed?: boolean;     // <<< NEW
}) {
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const Content = (
    <nav className="flex h-full flex-col gap-2 bg-white/90 p-3 backdrop-blur">
      {/* Header */}
      <div className={cn("mb-3 px-2", collapsed && "items-center px-0 text-center")}>
        <Link href="/" className="block text-lg font-bold tracking-tight">
          {collapsed ? "SH" : "Subscription Helper"}
        </Link>
        {!collapsed && (
          <p className="text-xs text-muted-foreground">Control your recurring costs</p>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
                collapsed && "justify-center px-2"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className={cn("mt-auto px-2 text-[11px] text-muted-foreground", collapsed && "text-center px-0")}>
        v0.1 • MVP
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop rail (collapsible) */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:flex md:flex-col md:border-r md:bg-background md:transition-[width] md:duration-200",
          collapsed ? "md:w-16" : "md:w-72"
        )}
      >
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
