// app/not-found.tsx
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-gray-50">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <span className="text-lg font-bold">404</span>
        </div>
        <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-gray-600">
          Maaf, URL yang kamu buka tidak tersedia. Coba kembali atau gunakan pencarian di bawah.
        </p>

        {/* Search subscriptions (GET) */}
        <form
          action="/subscriptions"
          method="get"
          className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm"
        >
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            name="q"
            placeholder="Cari langganan…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:opacity-90"
          >
            Cari
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <Home className="h-4 w-4" /> Ke Beranda
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" /> Ke Dashboard
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Butuh bantuan? <a className="underline underline-offset-2" href="#faq">Lihat FAQ</a>.
        </p>
      </div>
    </div>
  );
}
