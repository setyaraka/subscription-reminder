// app/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  PlusCircle,
  Wallet,
  CalendarClock,
  CheckCircle2,
  PiggyBank,
  ChevronRight,
} from "lucide-react";

// ===== Types (bisa dipindah ke /types.ts) =====
type Subscription = {
  id: string;
  name: string;
  price: number;       // in minor currency unit nanti kalau sudah pakai i18n
  currency: string;    // "IDR", "USD", etc
  nextBilling: string; // ISO date
  status: "active" | "canceled" | "upcoming";
  notes?: string;
  cancelable?: boolean;
};

// ===== Dummy data (ganti ke fetch dari DB nanti) =====
const MOCK_SUBS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    price: 65000,
    currency: "IDR",
    nextBilling: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    status: "active",
    cancelable: true,
  },
  {
    id: "2",
    name: "Spotify",
    price: 54990,
    currency: "IDR",
    nextBilling: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "3",
    name: "ChatGPT",
    price: 300000,
    currency: "IDR",
    nextBilling: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
    status: "active",
    cancelable: true,
  },
  {
    id: "4",
    name: "Domain .com",
    price: 180000,
    currency: "IDR",
    nextBilling: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
    status: "upcoming",
  },
  {
    id: "5",
    name: "Figma",
    price: 150000,
    currency: "IDR",
    nextBilling: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    status: "active",
  },
];

// ===== Utils ringkas =====
function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
function daysUntil(dateISO: string) {
  const d = new Date(dateISO).setHours(0,0,0,0);
  const t = new Date().setHours(0,0,0,0);
  return Math.ceil((d - t) / (1000 * 3600 * 24));
}

// ===== Komponen UI kecil =====
function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="rounded-xl bg-gray-100 p-2">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

function UpcomingList({ items }: { items: Subscription[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-4 text-sm text-gray-500">
        No upcoming bills in 7 days. 🎉
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-2xl border bg-white">
      {items.map((s) => {
        const d = new Date(s.nextBilling);
        const dd = daysUntil(s.nextBilling);
        const badge =
          dd < 0 ? "Overdue" : dd === 0 ? "Today" : dd === 1 ? "Tomorrow" : `${dd} days`;

        return (
          <li key={s.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">
                {d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                {" • "}
                {formatIDR(s.price)}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                dd < 0
                  ? "bg-red-100 text-red-700"
                  : dd <= 1
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {badge}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function SubTable({ items }: { items: Subscription[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Next Billing</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/60">
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3 text-gray-600">
                {new Date(s.nextBilling).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
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
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-2 p-3">
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ===== Page =====
export default function Dashboard() {
  // Agregasi cepat dari data mock
  const { monthlySpend, upcoming, activeCount, potentialSavings } = useMemo(() => {
    const now = new Date();
    const thisMonth = MOCK_SUBS.filter((s) => {
      const d = new Date(s.nextBilling);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const spend = thisMonth.reduce((sum, s) => sum + s.price, 0);
    const upcoming = MOCK_SUBS
      .filter((s) => daysUntil(s.nextBilling) <= 7)
      .sort((a, b) => +new Date(a.nextBilling) - +new Date(b.nextBilling))
      .slice(0, 5);

    const activeCount = MOCK_SUBS.filter((s) => s.status === "active").length;
    const potential = MOCK_SUBS.filter((s) => s.cancelable).reduce((sum, s) => sum + s.price, 0);

    return {
      monthlySpend: spend,
      upcoming,
      activeCount,
      potentialSavings: potential,
    };
  }, []);

  const latest = useMemo(
    () =>
      [...MOCK_SUBS].sort((a, b) => +new Date(a.nextBilling) - +new Date(b.nextBilling)).slice(0, 6),
    []
  );

  return (
    <div className="ml-5">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Ringkasan biaya & tagihan berulang kamu.
            </p>
          </div>
          <Link
            href="/subscriptions/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <PlusCircle className="h-4 w-4" /> Add Subscription
          </Link>
        </div>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Spend"
            value={formatIDR(monthlySpend)}
            hint="Perkiraan bulan ini"
            icon={<Wallet className="h-5 w-5 text-gray-700" />}
          />
          <StatCard
            title="Upcoming Bills"
            value={`${upcoming.length}`}
            hint="≤ 7 hari ke depan"
            icon={<CalendarClock className="h-5 w-5 text-gray-700" />}
          />
          <StatCard
            title="Active Subscriptions"
            value={`${activeCount}`}
            icon={<CheckCircle2 className="h-5 w-5 text-gray-700" />}
          />
          <StatCard
            title="Potential Savings"
            value={formatIDR(potentialSavings)}
            hint="Bisa di-cancel/pause"
            icon={<PiggyBank className="h-5 w-5 text-gray-700" />}
          />
        </section>

        {/* Content grid */}
        <section className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-base font-semibold">Upcoming reminders</h2>
            <UpcomingList items={upcoming} />

            <h2 className="mt-6 text-base font-semibold">Latest subscriptions</h2>
            <SubTable items={latest} />
          </div>

          {/* Callout / tips kolom kanan */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="mb-2 text-base font-semibold">Peluang hemat</h3>
              <p className="text-sm text-gray-600">
                Tinjau 2 layanan yang bisa di-pause/cancel bulan ini untuk menghemat{" "}
                <span className="font-medium">{formatIDR(potentialSavings)}</span>.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {MOCK_SUBS.filter((s) => s.cancelable).map((s) => (
                  <li key={s.id}>
                    {s.name} — {formatIDR(s.price)} / bulan
                  </li>
                ))}
              </ul>
              <Link
                href="/subscriptions"
                className="mt-4 inline-flex items-center gap-1 text-sm text-gray-900 underline-offset-2 hover:underline"
              >
                Review subscriptions <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
    </div>
  );
}
