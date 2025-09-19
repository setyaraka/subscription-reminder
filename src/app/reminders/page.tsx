"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Mail, Phone, Play, Save } from "lucide-react";

// ===== Types =====
type Cycle = "monthly" | "yearly";
type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: string;
  cycle?: Cycle;
  nextBilling: string; // ISO
  reminderDays?: number;
  notes?: string;
  status: "active" | "canceled" | "upcoming";
  cancelable?: boolean;
};

type PerSubSetting = {
  enabled: boolean;
  days: number;
  email: boolean;
  whatsapp: boolean;
};
type ReminderSettings = {
  defaultDays: number;
  defaultEmail: boolean;
  defaultWhatsApp: boolean;
  perSub: Record<string, PerSubSetting>;
};

// ===== Helpers =====
const SUBS_KEY = "subs";
const SETTINGS_KEY = "reminderSettings";

const SAMPLE: Subscription[] = [
  { id: "1", name: "Netflix",  price: 65000,  currency: "IDR", nextBilling: new Date(Date.now()+3*864e5).toISOString(),  status: "active", cancelable: true },
  { id: "2", name: "Spotify",  price: 54990,  currency: "IDR", nextBilling: new Date(Date.now()+8*864e5).toISOString(),  status: "active" },
  { id: "3", name: "ChatGPT",  price: 300000, currency: "IDR", nextBilling: new Date(Date.now()+1*864e5).toISOString(),  status: "active", cancelable: true },
  { id: "4", name: "Domain .com", price: 180000, currency: "IDR", nextBilling: new Date(Date.now()+28*864e5).toISOString(), status: "upcoming" },
  { id: "5", name: "Figma",    price: 150000, currency: "IDR", nextBilling: new Date(Date.now()-2*864e5).toISOString(),  status: "active" },
];

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
function daysBetween(a: Date, b: Date) {
  const d1 = new Date(a).setHours(0,0,0,0);
  const d2 = new Date(b).setHours(0,0,0,0);
  return Math.ceil((d1 - d2) / 86400000);
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RemindersPage() {
  const [subs, setSubs] = useState<Subscription[]>(SAMPLE);
  const [settings, setSettings] = useState<ReminderSettings>({
    defaultDays: 3,
    defaultEmail: true,
    defaultWhatsApp: false,
    perSub: {},
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SUBS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Subscription[];
        if (Array.isArray(parsed) && parsed.length) setSubs(parsed);
      }
    } catch {}
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ReminderSettings;
        if (parsed && typeof parsed === "object") setSettings(parsed);
      }
    } catch {}
  }, []);

  // Ensure settings.perSub has entries for all subs
  useEffect(() => {
    setSettings((prev) => {
      const copy: ReminderSettings = { ...prev, perSub: { ...prev.perSub } };
      for (const s of subs) {
        if (!copy.perSub[s.id]) {
          copy.perSub[s.id] = {
            enabled: true,
            days: s.reminderDays ?? prev.defaultDays,
            email: prev.defaultEmail,
            whatsapp: prev.defaultWhatsApp,
          };
        }
      }
      return copy;
    });
  }, [subs]);

  // Derived “upcoming” (within 14 days of trigger date)
  const upcoming = useMemo(() => {
    const now = new Date();
    const horizon = new Date(now.getTime() + 14 * 86400000);
    const list = subs
      .filter((s) => settings.perSub[s.id]?.enabled !== false)
      .map((s) => {
        const st = settings.perSub[s.id] ?? {
          enabled: true, days: settings.defaultDays, email: settings.defaultEmail, whatsapp: settings.defaultWhatsApp,
        };
        const bill = new Date(s.nextBilling);
        const trigger = new Date(bill.getTime() - st.days * 86400000);
        return { sub: s, st, bill, trigger };
      })
      .filter((x) => x.trigger <= horizon) // only next 14 days
      .sort((a, b) => +a.trigger - +b.trigger);

    return list.map((x) => {
      const d = daysBetween(x.trigger, now);
      let badge = `${d} days`;
      if (d <= 0) badge = "Due now";
      else if (d === 1) badge = "Tomorrow";
      return { ...x, daysToTrigger: d, badge };
    });
  }, [subs, settings]);

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    alert("Reminder settings saved ✅");
  }

  function simulateRun() {
    const due = upcoming.filter((u) => u.daysToTrigger <= 0);
    if (due.length === 0) {
      alert("No reminders due now.");
      return;
    }
    const lines = due.map((d) => {
      const via = [
        d.st.email ? "Email" : null,
        d.st.whatsapp ? "WhatsApp" : null,
      ].filter(Boolean).join(" & ");
      return `• ${d.sub.name} — ${formatIDR(d.sub.price)} — via ${via}`;
    });
    alert(`Simulate sending reminders:\n\n${lines.join("\n")}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reminders</h1>
          <p className="text-sm text-gray-600">Atur pengingat otomatis untuk tagihan langgananmu.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveSettings}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <Save className="h-4 w-4" /> Save
          </button>
          <button
            onClick={simulateRun}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Play className="h-4 w-4" /> Run now (simulate)
          </button>
        </div>
      </div>

      {/* Global settings */}
      <section className="rounded-2xl border bg-white p-4">
        <h2 className="mb-3 text-base font-semibold">Global settings</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Default H-n reminder</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border px-3 py-2"
              value={settings.defaultDays}
              onChange={(e) =>
                setSettings((s) => ({ ...s, defaultDays: clamp(Number(e.target.value || 0), 0, 365) }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">Berapa hari sebelum jatuh tempo.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="defEmail"
              type="checkbox"
              className="h-4 w-4"
              checked={settings.defaultEmail}
              onChange={(e) => setSettings((s) => ({ ...s, defaultEmail: e.target.checked }))}
            />
            <label htmlFor="defEmail" className="text-sm inline-flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="defWa"
              type="checkbox"
              className="h-4 w-4"
              checked={settings.defaultWhatsApp}
              onChange={(e) => setSettings((s) => ({ ...s, defaultWhatsApp: e.target.checked }))}
            />
            <label htmlFor="defWa" className="text-sm inline-flex items-center gap-1">
              <Phone className="h-4 w-4" /> WhatsApp
            </label>
          </div>
        </div>
      </section>

      {/* Upcoming list */}
      <section>
        <h2 className="mb-2 text-base font-semibold">Upcoming (next 14 days)</h2>
        <div className="overflow-hidden rounded-2xl border bg-white">
          {upcoming.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">Tidak ada pengingat dalam 14 hari ke depan.</div>
          ) : (
            <ul className="divide-y">
              {upcoming.map((u) => (
                <li key={u.sub.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{u.sub.name}</div>
                    <div className="text-xs text-gray-500">
                      Billing:{" "}
                      {new Date(u.bill).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {formatIDR(u.sub.price)} • H-{u.st.days}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      {u.st.email && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
                          <Mail className="h-3 w-3" /> Email
                        </span>
                      )}
                      {u.st.whatsapp && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
                          <Phone className="h-3 w-3" /> WhatsApp
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      u.daysToTrigger <= 0
                        ? "bg-red-100 text-red-700"
                        : u.daysToTrigger === 1
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.badge}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Table: per-subscription settings */}
      <section>
        <h2 className="mb-2 text-base font-semibold">Per-subscription settings</h2>
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Subscription</th>
                <th className="px-4 py-3">Next Billing</th>
                <th className="px-4 py-3">H-n</th>
                <th className="px-4 py-3">Channels</th>
                <th className="px-4 py-3">Enable</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subs.map((s) => {
                const st = settings.perSub[s.id] ?? {
                  enabled: true,
                  days: settings.defaultDays,
                  email: settings.defaultEmail,
                  whatsapp: settings.defaultWhatsApp,
                };
                return (
                  <tr key={s.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(s.nextBilling).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        className="w-20 rounded-lg border px-2 py-1"
                        value={st.days}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            perSub: {
                              ...prev.perSub,
                              [s.id]: { ...st, days: clamp(Number(e.target.value || 0), 0, 365) },
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={st.email}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                perSub: { ...prev.perSub, [s.id]: { ...st, email: e.target.checked } },
                              }))
                            }
                          />
                          <Mail className="h-4 w-4" />
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={st.whatsapp}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                perSub: { ...prev.perSub, [s.id]: { ...st, whatsapp: e.target.checked } },
                              }))
                            }
                          />
                          <Phone className="h-4 w-4" />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={st.enabled}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              perSub: { ...prev.perSub, [s.id]: { ...st, enabled: e.target.checked } },
                            }))
                          }
                        />
                        <span className="text-xs text-gray-600">Enabled</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
              {subs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                    Belum ada subscription.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer hint */}
      {/* <div className="rounded-2xl border bg-white p-4 text-xs text-gray-600">
        <div className="mb-1 inline-flex items-center gap-2 font-medium">
          <Bell className="h-4 w-4" /> Cara otomatisasi
        </div>
        <p>
          Buat endpoint <code>/api/reminders/run</code> yang membaca pengaturan ini lalu kirim
          email (Resend) / WhatsApp (Twilio). Jalankan via cron (misal cron-job.org) 1× sehari.
        </p>
      </div> */}
    </div>
  );
}
