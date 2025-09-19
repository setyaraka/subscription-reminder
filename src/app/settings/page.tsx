"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Save, Upload, Trash2, Download, Mail, Phone, Sun, Moon, Monitor } from "lucide-react";

type Lang = "id" | "en";
type ThemeMode = "system" | "light" | "dark";
type Currency = "IDR" | "USD" | "SGD" | "EUR";

type Profile = {
  name: string;
  email: string;
  avatarDataUrl?: string;
};

type AppSettings = {
  language: Lang;
  currency: Currency;
  theme: ThemeMode;
  defaultReminderDays: number;
  defaultEmail: boolean;
  defaultWhatsApp: boolean;
};

const PROFILE_KEY = "profile";
const APP_SETTINGS_KEY = "appSettings";
const SUBS_KEY = "subs";
const REMINDER_SETTINGS_KEY = "reminderSettings";

const DEFAULT_PROFILE: Profile = { name: "User", email: "user@example.com" };
const DEFAULT_APP_SETTINGS: AppSettings = {
  language: "id",
  currency: "IDR",
  theme: "light",
  defaultReminderDays: 3,
  defaultEmail: true,
  defaultWhatsApp: false,
};

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { setTheme: setSystemTheme } = useTheme();

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  // Load from localStorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
      if (p) setProfile(p);
    } catch {}
    try {
      const s = JSON.parse(localStorage.getItem(APP_SETTINGS_KEY) || "null");
      if (s) {
        setSettings(s);
        // sinkronkan lang ke <html>
        document.documentElement.lang = s.language;
        // apply theme ke next-themes
        setSystemTheme(s.theme === "system" ? "system" : s.theme);
      }
    } catch {}
  }, [setSystemTheme]);

  const themeIcon = useMemo(() => {
    return settings.theme === "system" ? <Monitor className="h-4 w-4" /> :
           settings.theme === "dark" ? <Moon className="h-4 w-4" /> :
           <Sun className="h-4 w-4" />;
  }, [settings.theme]);

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatarDataUrl: reader.result as string }));
    };
    reader.readAsDataURL(f);
  }

  function saveAll() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
    // sinkronkan juga ke reminderSettings (default value)
    try {
    //   const raw = localStorage.getItem(REMEDY_KEY()); // placeholder to avoid typo
    console.log('success')
    } catch {}
    try {
      const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
      if (raw) {
        const prev = JSON.parse(raw);
        const merged = {
          ...prev,
          defaultDays: settings.defaultReminderDays,
          defaultEmail: settings.defaultEmail,
          defaultWhatsApp: settings.defaultWhatsApp,
        };
        localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(merged));
      }
    } catch {}
    // apply language & theme immediately
    document.documentElement.lang = settings.language;
    setSystemTheme(settings.theme === "system" ? "system" : settings.theme);
    alert("Settings saved ✅");
  }

  function exportData() {
    const dump = {
      profile,
      appSettings: settings,
      subs: JSON.parse(localStorage.getItem(SUBS_KEY) || "[]"),
      reminderSettings: JSON.parse(localStorage.getItem(REMINDER_SETTINGS_KEY) || "null"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscription-helper-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result));
        if (obj.profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(obj.profile));
        if (obj.appSettings) localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(obj.appSettings));
        if (obj.subs) localStorage.setItem(SUBS_KEY, JSON.stringify(obj.subs));
        if (obj.reminderSettings) localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(obj.reminderSettings));
        alert("Import success. Please reload.");
      } catch {
        alert("Import failed: invalid file.");
      }
    };
    reader.readAsText(f);
  }

  function clearAll() {
    if (!confirm("This will clear local data (profile, settings, subscriptions, reminders). Continue?")) return;
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(APP_SETTINGS_KEY);
    localStorage.removeItem(SUBS_KEY);
    localStorage.removeItem(REMINDER_SETTINGS_KEY);
    alert("Cleared. Reload the page.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile & Settings</h1>
        <p className="text-sm text-gray-600">Kelola profil dan preferensi aplikasi.</p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 overflow-hidden rounded-full border bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              { profile.avatarDataUrl ? (
                    <img src={profile.avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-700 dark:bg-neutral-700 dark:text-white">
                        {(profile?.name?.[0] ?? "N").toUpperCase()}
                    </div>
                )
                }
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border px-3 py-2"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Preferences</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Language</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value as Lang }))}
            >
              <option value="id">Indonesia (ID)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Currency</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={settings.currency}
              onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value as Currency }))}
            >
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
              <option value="SGD">SGD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Theme</label>
            <div className="flex gap-2">
              {(["system", "light", "dark"] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, theme: m }))}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${settings.theme === m ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  {m === "system" ? <Monitor className="h-4 w-4" /> : m === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notification defaults */}
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Reminder defaults</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">H-n (days before)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border px-3 py-2"
              value={settings.defaultReminderDays}
              onChange={(e) => setSettings((s) => ({ ...s, defaultReminderDays: Math.max(0, Number(e.target.value || 0)) }))}
            />
          </div>
          <label className="mt-6 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.defaultEmail}
              onChange={(e) => setSettings((s) => ({ ...s, defaultEmail: e.target.checked }))}
            />
            <span className="inline-flex items-center gap-1 text-sm"><Mail className="h-4 w-4" /> Email</span>
          </label>
          <label className="mt-6 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.defaultWhatsApp}
              onChange={(e) => setSettings((s) => ({ ...s, defaultWhatsApp: e.target.checked }))}
            />
            <span className="inline-flex items-center gap-1 text-sm"><Phone className="h-4 w-4" /> WhatsApp</span>
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Nilai ini digunakan sebagai default untuk pengingat baru & disinkronkan ke halaman Reminders.
        </p>
      </section>

      {/* Data management */}
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Data management</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>

          <label className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={importData} />
          </label>

          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" /> Clear all (local)
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <button
          onClick={saveAll}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>
    </div>
  );
}
