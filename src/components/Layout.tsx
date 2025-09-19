"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />

      {/* Area konten */}
      <div className={cn("flex-1 transition-[padding] duration-200", collapsed ? "md:pl-16" : "md:pl-72")}>
        {/* Topbar: ada di semua ukuran */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-white/80 px-3 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            {/* Mobile: buka drawer */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop: collapse/expand */}
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden rounded-lg p-2 hover:bg-gray-100 md:inline-flex"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <span className="font-semibold">Subscription Helper</span>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
