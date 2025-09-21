"use client"

import { Lock, LogIn, Mail, UserIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type StoredUser = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: string;
};
  
const USERS_KEY = "users";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sha256(text: string) {
    if (typeof window !== "undefined" && window.crypto?.subtle) {
      const enc = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    // fallback (tidak seaman crypto.subtle, tapi cukup untuk demo)
    const enc = new TextEncoder().encode(text);
    let hash = 0;
    for (const n of enc) hash = (hash * 31 + n) | 0;
    return String(hash);
  }
  
function saveUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadUsers(): StoredUser[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

export default function Register(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [pass2, setPass2] = useState("");
    const [remember, setRemember] = useState(true);
    const [autoLogin, setAutoLogin] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const has = localStorage.getItem("auth") || sessionStorage.getItem("auth");
            if (has) router.replace(redirectTo);
        }   catch {}
    }, [router, redirectTo]);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setErr(null);

        if (name.trim().length < 2) return setErr("Nama minimal 2 karakter.");
        if (!isValidEmail(email)) return setErr("Email tidak valid.");
        if (pass.length < 6) return setErr("Password minimal 6 karakter.");
        if (pass !== pass2) return setErr("Konfirmasi password tidak cocok.");

        setLoading(true);

        try {
            const users = loadUsers();
            const exists = users.some((u) => u.email.toLocaleLowerCase());
            if(exists){
                setErr("Email sudah terdaftar. Silakan login.");
                setLoading(false);
                return;
            }

            const passwordHash = await sha256(pass);
            const user: StoredUser = {
                id: crypto.randomUUID(),
                name: name.trim(),
                email: email.trim(),
                passwordHash,
                createdAt: new Date().toISOString(),
              };
            saveUsers([...users, user]);

            localStorage.setItem(
                "profile",
                JSON.stringify({ name: user.name, email: user.email })
            );

            if (autoLogin) {
                const payload = {
                  token: crypto.randomUUID(),
                  profile: { name: user.name, email: user.email },
                  createdAt: new Date().toISOString(),
                };
                if (remember)
                    localStorage.setItem("auth", JSON.stringify(payload));
                    else sessionStorage.setItem("auth", JSON.stringify(payload));
                router.replace(redirectTo);
              } else {
                    router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
              }
        } catch {
            setErr("Registrasi failed. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid min-h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        {/* Brand */}
        <div className="mb-6 text-center">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Subscription Helper
          </Link>
          <p className="text-xs text-gray-500">Buat akun baru untuk mulai mengelola langganan.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <div className="flex items-center gap-2 rounded-lg border px-3">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 rounded-lg border px-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <input
                type="email"
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="kamu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="flex items-center gap-2 rounded-lg border px-3">
              <Lock className="h-4 w-4 text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="Minimal 6 karakter"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm password</label>
            <div className="flex items-center gap-2 rounded-lg border px-3">
              <Lock className="h-4 w-4 text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="Ulangi password"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              Auto-login setelah daftar
            </label>
          </div>

          {err && <div className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{err}</div>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Sudah punya akun?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-gray-900 underline-offset-2 hover:underline">
            Login
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:underline">
            <LogIn className="h-3 w-3" /> Kembali ke login
          </Link>
        </div>
      </div>
    </div>
    )
}