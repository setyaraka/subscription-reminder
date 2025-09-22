const id = {
    nav: {
        dashboard: "Dashboard",
        subscriptions: "Subscriptions",
        addSubscription: "Tambah Langganan",
        reminders: "Reminders",
        settings: "Settings",
    },
    common: {
        appName: "Subscription Helper",
        save: "Simpan",
        cancel: "Batal",
        edit: "Ubah",
        delete: "Hapus",
        search: "Cari…",
        seeAll: "Lihat semua",
    },
    dashboard: {
        title: "Dashboard",
        subtitle: "Ringkasan biaya & tagihan berulang kamu.",
        monthlySpend: "Biaya Bulanan",
        upcomingBills: "Tagihan Mendatang",
        activeSubs: "Langganan Aktif",
        potentialSavings: "Potensi Hemat",
        upcomingReminders: "Pengingat akan datang",
        latestSubs: "Langganan terbaru",
    },
    subscriptions: {
        title: "Subscriptions",
        add: "Tambah Langganan",
        nextBilling: "Tagihan Berikutnya",
        price: "Harga",
        status: "Status",
        active: "aktif",
        upcoming: "akan datang",
        canceled: "dibatalkan",
        searchPlaceholder: "Cari langganan…",
    },
    reminders: {
        title: "Reminders",
        globalSettings: "Pengaturan global",
    },
    settings: {
        title: "Profil & Pengaturan",
        language: "Bahasa",
        currency: "Mata uang",
        theme: "Tema",
    },
} as const;
  
export default id;
export type IdMessages = typeof id;
  