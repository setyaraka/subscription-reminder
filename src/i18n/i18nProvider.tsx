"use client";

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import en from "./messages/en";
import id from "./messages/id";

type Locale = "en" | "id";
type Dict = {
    [key: string]: string | Dict;
};
type Ctx = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (path: string, vars?: Record<string, string | number>) => string;
};
type I18nProviderProps = {
    children: ReactNode;
    initialLocale?: Locale;
};

const DICTS: Record<Locale, Dict> = { en, id };
const I18nContext = createContext<Ctx | null>(null);

function get(obj: any, path: string) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}
function interpolate(s: string, vars?: Record<string, string | number>) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function I18nProvider({ children, initialLocale = "id" as Locale }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window === "undefined") return initialLocale;
        return (localStorage.getItem("locale") as Locale) || initialLocale;
    });

    useEffect(() => {
        localStorage.setItem("locale", locale);
        document.documentElement.lang = locale;
    }, [locale]);

    const t = useMemo(() => {
        const dict = DICTS[locale];
        return (path: string, vars?: Record<string, string | number>) => {
            const val = get(dict, path) ?? get(DICTS.en, path) ?? path;
            return typeof val === "string" ? interpolate(val, vars) : path;
        };
    }, [locale]);

    const setLocale = (l: Locale) => setLocaleState(l);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
        {children}
        </I18nContext.Provider>
    );
}

export function useT() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
    return ctx.t;
}
export function useLocale() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useLocale must be used inside <I18nProvider>");
    return { locale: ctx.locale, setLocale: ctx.setLocale };
}
