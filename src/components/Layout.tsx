"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import { redirect, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const AUTH_ROUTES = ["/login"];
  const isAuth = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if(isAuth){
    return <main className="min-h-screen">{children}</main>
  }

  const demoNotif = [
    { id: "1", title: "Netflix due in 3 days", subtitle: "Rp 65.000", badge: "info" as const },
    { id: "2", title: "ChatGPT overdue", subtitle: "Rp 300.000", badge: "danger" as const },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />
      <div className={cn("flex-1 transition-[padding] duration-200", collapsed ? "md:pl-16" : "md:pl-72")}>
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
            localStorage.removeItem("auth");
            alert("Logout clicked");
            redirect("/login");
          }}
        />

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
