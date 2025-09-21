"use client"

import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState<string | null>("");
    const [loading, setLoading] = useState(false);

    const redirectTo = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);
    
    useEffect(() => {
        try {
            const auth = localStorage.getItem("auth");
            if(auth) router.replace(redirectTo);
        } catch {}
    }, [router, redirectTo]);

    async function onSubmit(event:React.FormEvent) {
        event.preventDefault();
        setError(null);

        if(!isValidEmail(email)) {
            setError("Email isn't valid");
            return;
        }

        if(password.length < 6){
            setError("Minimum password is 6 character");
            return;
        }

        setLoading(true);
        try {
            const authPayload = {
                token: crypto.randomUUID,
                profile: { name: email.split("@")[0], email },
                createdAt: new Date().toISOString()
            };

            if(remember) {
                localStorage.setItem("auth", JSON.stringify(authPayload));
            } else {
                sessionStorage.setItem("auth", JSON.stringify(authPayload));
            }

            localStorage.setItem("profile", JSON.stringify({ name: authPayload.profile.name, email }));

            router.replace(redirectTo);
        } catch (error) {
            setError("Login failed. Please Try Again.");
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
          <p className="text-xs text-gray-500">Masuk untuk mengelola langgananmu</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
                type="password"
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="mt-1 text-right">
              <button
                type="button"
                className="text-xs text-gray-600 underline-offset-2 hover:underline"
                onClick={() => alert("Forgot password (demo). Nanti sambungkan ke email OTP/Reset link.")}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>

          {error && <div className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Belum punya akun? <span className="cursor-not-allowed text-gray-400">Sign up (coming soon)</span>
        </p>
      </div>
    </div>
    )
}