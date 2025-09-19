"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

type Cycle = "monthly" | "yearly";
type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: string;        // "IDR" | "USD" | ...
  cycle: Cycle;
  nextBilling: string;     // ISO date
  reminderDays: number;    // hari sebelum tagihan
  notes?: string;
  status: "active" | "canceled" | "upcoming";
  cancelable?: boolean;
};

// ----- helpers -----
const CURRENCIES = ["IDR", "USD", "SGD", "EUR"] as const;

function saveToLocalStorage(sub: Subscription) {
  const key = "subs";
  const prev: Subscription[] = JSON.parse(localStorage.getItem(key) || "[]");
  prev.push(sub);
  localStorage.setItem(key, JSON.stringify(prev));
}

export default function NewSubscriptionPage() {
  const router = useRouter();

  // form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("IDR");
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [nextBilling, setNextBilling] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  });
  const [reminderDays, setReminderDays] = useState(3);
  const [cancelable, setCancelable] = useState(true);
  const [notes, setNotes] = useState("");

  const valid = useMemo(() => {
    const p = Number(price);
    return name.trim().length >= 2 && !Number.isNaN(p) && p > 0 && !!nextBilling;
  }, [name, price, nextBilling]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;

    const p = Number(price);
    const sub: Subscription = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price: Math.round(p),
      currency,
      cycle,
      nextBilling: new Date(nextBilling).toISOString(),
      reminderDays: Number(reminderDays),
      notes: notes.trim() || undefined,
      status: "active",
      cancelable,
    };

    saveToLocalStorage(sub);
    router.push("/subscriptions?created=1");
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page heading */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <h1 className="text-2xl font-semibold">Add Subscription</h1>
      <p className="mb-4 text-sm text-gray-600">
        Masukkan detail langganan untuk pengingat & kalkulasi biaya.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-5">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Netflix, Spotify, ChatGPT…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Minimal 2 karakter.</p>
        </div>

        {/* Price + Currency */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="w-full rounded-lg border px-3 py-2"
              placeholder="65000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Currency</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cycle + Next billing */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Billing cycle</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={cycle}
              onChange={(e) => setCycle(e.target.value as Cycle)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Next billing date</label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2"
              value={nextBilling}
              onChange={(e) => setNextBilling(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Reminder & flags */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Reminder</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>7 days before</option>
              <option value={14}>14 days before</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Dipakai saat membuat jadwal pengingat email/WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="cancelable"
              type="checkbox"
              className="h-4 w-4"
              checked={cancelable}
              onChange={(e) => setCancelable(e.target.checked)}
            />
            <label htmlFor="cancelable" className="text-sm">
              Mark as cancelable/pause-able
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea
            className="h-24 w-full rounded-lg border px-3 py-2"
            placeholder="Catatan vendor, email tagihan, dsb."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/subscriptions")}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </form>
    </div>
  );
}
