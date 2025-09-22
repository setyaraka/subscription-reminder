import { ArrowRight, Bell, CalendarClock, Check, Globe, ListChecks, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Subscription Helper — Track & Cancel Subscriptions Easily",
    description: "Pantau tagihan berulang, dapatkan pengingat tepat waktu, dan temukan peluang hemat.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* NAV (landing-only) */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">Subscription Helper</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a>
          <Link href="/login" className="text-sm text-gray-900 hover:underline">Login</Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        {/* mobile */}
        <div className="md:hidden">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pb-24 md:pt-16">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Kelola langganan tanpa drama.
          </h1>
          <p className="mt-4 text-gray-600 md:text-lg">
            Catat semua subscription kamu, dapatkan pengingat tepat waktu, dan temukan peluang untuk hemat—semuanya dalam satu dashboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Coba gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm shadow-sm hover:bg-gray-50"
            >
              Masuk
            </Link>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Tanpa kartu kredit</li>
            <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Reminder via Email/WhatsApp</li>
            <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Multi-currency & i18n</li>
          </ul>
        </div>

        {/* Mockup card */}
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-gray-200 to-gray-100 blur-2xl" />
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-4 py-3 text-sm text-gray-600">Dashboard preview</div>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-xs text-gray-500">Monthly Spend</div>
                <div className="mt-2 text-2xl font-semibold">Rp 580.000</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs text-gray-500">Upcoming Bills</div>
                <div className="mt-2 text-2xl font-semibold">3</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs text-gray-500">Active Subscriptions</div>
                <div className="mt-2 text-2xl font-semibold">7</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs text-gray-500">Potential Savings</div>
                <div className="mt-2 text-2xl font-semibold">Rp 120.000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-semibold">Fitur utama</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          Fokus ke hal penting—biarkan kami mengingatkan & merapikan langganan kamu.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<ListChecks className="h-5 w-5" />} title="Daftar Langganan">
            Input cepat, status aktif/akan datang/dibatalkan, dan catatan vendor.
          </Feature>
          <Feature icon={<Bell className="h-5 w-5" />} title="Pengingat Otomatis">
            Email & WhatsApp H-1/H-3/H-7—anti telat bayar.
          </Feature>
          <Feature icon={<CalendarClock className="h-5 w-5" />} title="Timeline Tagihan">
            Lihat apa saja yang jatuh tempo 14–30 hari ke depan.
          </Feature>
          <Feature icon={<Wallet className="h-5 w-5" />} title="Kontrol Biaya">
            Ringkasan pengeluaran bulanan & tren sederhana.
          </Feature>
          <Feature icon={<PiggyBank className="h-5 w-5" />} title="Peluang Hemat">
            Deteksi layanan yang bisa dipause/cancel.
          </Feature>
          <Feature icon={<Globe className="h-5 w-5" />} title="Multi-currency & i18n">
            ID/EN + IDR/USD/SGD/EUR—pilih sesuai kebutuhanmu.
          </Feature>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-semibold">Harga sederhana</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          Mulai gratis. Upgrade kapan saja.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <PricingCard
            label="Free"
            price="Rp 0"
            points={[
              "Up to 50 subscriptions",
              "Email reminders",
              "Dashboard & filters",
            ]}
            cta={{ href: "/register", text: "Mulai gratis" }}
          />
          <PricingCard
            label="Pro"
            price="Rp 39.000/bulan"
            points={[
              "Unlimited subscriptions",
              "WhatsApp reminders",
              "Export & advanced insights",
            ]}
            highlight
            cta={{ href: "/register?plan=pro", text: "Coba Pro" }}
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-semibold">Pertanyaan umum</h2>
        <div className="mx-auto mt-6 grid max-w-3xl gap-4">
          <Faq q="Apakah benar-benar gratis?"
               a="Ya, paket Free cukup untuk pemakaian personal. Kamu bisa upgrade ke Pro kapan saja." />
          <Faq q="Bagaimana cara kerja pengingat?"
               a="Kamu atur H-n dan channel (Email/WhatsApp). Sistem akan mengirim notifikasi menjelang jatuh tempo." />
          <Faq q="Apakah data saya aman?"
               a="Versi MVP menyimpan data di perangkat (local storage). Versi Pro akan menambahkan penyimpanan terenkripsi di server." />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
          <h3 className="text-xl font-semibold">Siap rapiin semua langgananmu?</h3>
          <p className="mt-2 text-gray-600">Daftar gratis, butuh {"< 1 menit"}.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/register" className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90">
              Buat akun
            </Link>
            <Link href="/login" className="rounded-xl border bg-white px-5 py-3 text-sm shadow-sm hover:bg-gray-50">
              Saya sudah punya akun
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-600 md:flex-row">
          <div>© {new Date().getFullYear()} Subscription Helper</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#features">Features</a>
            <a className="hover:underline" href="#pricing">Pricing</a>
            <a className="hover:underline" href="#faq">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );

}


function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-sm">
        {icon} <span className="font-medium">{title}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function PricingCard({
  label, price, points, cta, highlight,
}: {
  label: string; price: string; points: string[]; cta: { href: string; text: string }; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${highlight ? "ring-2 ring-gray-900" : ""}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{label}</h3>
        <div className="text-xl font-semibold">{price}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {points.map((p) => (
          <li key={p} className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" /> {p}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
          highlight ? "bg-gray-900 text-white hover:opacity-90" : "border bg-white hover:bg-gray-50"
        }`}
      >
        {cta.text}
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="font-medium">{q}</div>
      <p className="mt-1 text-sm text-gray-600">{a}</p>
    </div>
  );
}
