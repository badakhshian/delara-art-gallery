import { headers } from "next/headers";
import { getDictionary, localizePath, normalizeLang } from "@/lib/i18n";

// Language of the current request, set by middleware.js from the URL
// (/fr/... is French). Server components only.
export function getLang() {
  return normalizeLang(headers().get("x-lang"));
}

// { lang, t, href } for server components: t is the dictionary, href()
// prefixes a path with /fr when the page is French.
export function getI18n() {
  const lang = getLang();
  return { lang, t: getDictionary(lang), href: (path) => localizePath(lang, path) };
}
