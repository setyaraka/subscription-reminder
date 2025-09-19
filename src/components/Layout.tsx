"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const demoNotif = [
    { id: "1", title: "Netflix due in 3 days", subtitle: "Rp 65.000", badge: "info" as const },
    { id: "2", title: "ChatGPT overdue", subtitle: "Rp 300.000", badge: "danger" as const },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />

      <div className={cn("flex-1 transition-[padding] duration-200", collapsed ? "md:pl-16" : "md:pl-72")}>
        {/* <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-white/80 px-3 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden rounded-lg p-2 hover:bg-gray-100 md:inline-flex"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="font-semibold">Subscription Helper</span>
          </div>
        </header> */}
         <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          user={{ name: "Raka", email: "raka@example.com" }}
          notifications={demoNotif}
          locale="id"
          onLocaleChange={(loc) => {
            // contoh sederhana: simpan di localStorage dan set <html lang>
            localStorage.setItem("locale", loc);
            document.documentElement.lang = loc;
          }}
          onLogout={() => {
            // Jika pakai NextAuth:
            // signOut();
            alert("Logout clicked");
          }}
        />

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
