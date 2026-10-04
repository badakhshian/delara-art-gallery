"use client";

import { createContext, useContext } from "react";
import { getDictionary, localizePath } from "@/lib/i18n";

const LangContext = createContext("en");

// Set once in the root layout from the request's language. Switching
// language is always a full page load (see LanguageSwitch), so the value
// never goes stale during in-language client navigation.
export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

// { lang, t, href } for client components — same shape as getI18n().
export function useI18n() {
  const lang = useContext(LangContext);
  return { lang, t: getDictionary(lang), href: (path) => localizePath(lang, path) };
}
