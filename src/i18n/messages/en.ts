const en = {
    nav: {
        dashboard: "Dashboard",
        subscriptions: "Subscriptions",
        addSubscription: "Add Subscription",
        reminders: "Reminders",
        settings: "Settings",
    },
    common: {
        appName: "Subscription Helper",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        search: "Search…",
        seeAll: "See all",
    },
    dashboard: {
        title: "Dashboard",
        subtitle: "Overview of your recurring costs.",
        monthlySpend: "Monthly Spend",
        upcomingBills: "Upcoming Bills",
        activeSubs: "Active Subscriptions",
        potentialSavings: "Potential Savings",
        upcomingReminders: "Upcoming reminders",
        latestSubs: "Latest subscriptions",
    },
    subscriptions: {
        title: "Subscriptions",
        add: "Add Subscription",
        nextBilling: "Next Billing",
        price: "Price",
        status: "Status",
        active: "active",
        upcoming: "upcoming",
        canceled: "canceled",
        searchPlaceholder: "Find a subscription…",
    },
    reminders: {
        title: "Reminders",
        globalSettings: "Global settings",
    },
    settings: {
        title: "Profile & Settings",
        language: "Language",
        currency: "Currency",
        theme: "Theme",
    },
} as const;
  
export default en;
export type EnMessages = typeof en;
