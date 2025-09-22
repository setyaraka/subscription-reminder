"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PlusCircle, Search, ArrowUpDown, Edit2, XCircle,
} from "lucide-react";

// ===== Types =====
type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: string;       // "IDR" | "USD" | ...
  nextBilling: string;    // ISO
  status: "active" | "canceled" | "upcoming";
  notes?: string;
};

// ===== Dummy data (ganti ke fetch dari API nanti) =====
const SAMPLE: Subscription[] = [
  { id: "1", name: "Netflix",  price: 65000,  currency: "IDR", nextBilling: new Date(Date.now()+3*864e5).toISOString(),  status: "active" },
  { id: "2", name: "Spotify",  price: 54990,  currency: "IDR", nextBilling: new Date(Date.now()+8*864e5).toISOString(),  status: "active" },
  { id: "3", name: "ChatGPT",  price: 300000, currency: "IDR", nextBilling: new Date(Date.now()+1*864e5).toISOString(),  status: "active" },
  { id: "4", name: "Domain .com", price: 180000, currency: "IDR", nextBilling: new Date(Date.now()+28*864e5).toISOString(), status: "upcoming" },
  { id: "5", name: "Figma",    price: 150000, currency: "IDR", nextBilling: new Date(Date.now()-2*864e5).toISOString(),  status: "active" },
];

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
function daysUntil(iso: string) {
  const d = new Date(iso).setHours(0,0,0,0);
  const t = new Date().setHours(0,0,0,0);
  return Math.ceil((d - t) / 86400000);
}

export default function Subscriptions() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL param dari navbar
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState<"all" | "active" | "upcoming" | "canceled">("all");
  const [sort, setSort] = useState<"next-asc" | "next-desc" | "price-asc" | "price-desc">("next-asc");

  const rows = useMemo(() => {
    let r = [...SAMPLE];

    if (q.trim()) {
      const t = q.trim().toLowerCase();
      r = r.filter((x) => x.name.toLowerCase().includes(t));
    }
    if (status !== "all") {
      if (status === "upcoming") {
        r = r.filter((x) => x.status === "upcoming" || (daysUntil(x.nextBilling) >= 0 && daysUntil(x.nextBilling) <= 7));
      } else {
        r = r.filter((x) => x.status === status);
      }
    }
    r.sort((a, b) => {
      if (sort === "next-asc")  return +new Date(a.nextBilling) - +new Date(b.nextBilling);
      if (sort === "next-desc") return +new Date(b.nextBilling) - +new Date(a.nextBilling);
      if (sort === "price-asc")  return a.price - b.price;
      return b.price - a.price; // price-desc
    });
    return r;
  }, [q, status, sort]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (q.trim()) p.set("q", q.trim()); else p.delete("q");
    router.replace(`/subscriptions?${p.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-gray-600">Kelola semua langganan & tagihan berulang.</p>
        </div>
        <Link
          href="/subscriptions-new"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Add Subscription
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} className="flex w-full max-w-md items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Cari langganan…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="rounded-lg px-3 py-1 text-sm font-medium text-white bg-gray-900 hover:opacity-90">
            Cari
          </button>
        </form>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="canceled">Canceled</option>
          </select>

          <button
            onClick={() =>
              setSort((s) =>
                s === "next-asc" ? "next-desc" :
                s === "next-desc" ? "price-asc" :
                s === "price-asc" ? "price-desc" : "next-asc"
              )
            }
            className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm"
            title="Sort"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sort.replace("-", " ")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Next Billing</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(s.nextBilling).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">{formatIDR(s.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      s.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : s.status === "canceled"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/subscriptions/${s.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Link>
                    <button
                      onClick={() => alert(`Cancel ${s.name} (demo)`)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-red-600 hover:bg-red-50"
                      title="Cancel"
                    >
                      <XCircle className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                  Tidak ada data. Tambah langganan baru atau ubah filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
