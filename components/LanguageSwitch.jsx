"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { palette } from "@/lib/palette";
import { localizePath, unlocalizePath } from "@/lib/i18n";
import { useI18n } from "@/components/LangProvider";

const OPTIONS = [
  { lang: "en", label: "EN", name: "English" },
  { lang: "fr", label: "FR", name: "Français" },
];

// "EN | FR" — links to the same page in the other language. Plain <a> (a
// full page load) rather than <Link>, so the whole page, including the
// root layout's language, re-renders in the new language.
export default function LanguageSwitch({ className = "" }) {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams()?.toString();
  const basePath = unlocalizePath(pathname);

  return (
    <div
      className={`flex items-center gap-2 text-[12px] ${className}`}
      role="group"
      aria-label={t.languageSwitch}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: "0.12em",
        fontWeight: 600,
        textShadow: "0 1px 2px rgba(14,13,12,0.85), 0 0 12px rgba(14,13,12,0.6)",
      }}
    >
      {OPTIONS.map((o, i) => {
        const active = o.lang === lang;
        return (
          <span key={o.lang} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: palette.smoke }}>|</span>}
            <a
              href={localizePath(o.lang, basePath) + (search ? `?${search}` : "")}
              hrefLang={o.lang}
              lang={o.lang}
              aria-label={o.name}
              aria-current={active ? "true" : undefined}
              style={{
                color: active ? palette.bone : palette.brass,
                textDecoration: "none",
                borderBottom: active ? `1px solid ${palette.brass}` : "1px solid transparent",
                paddingBottom: 2,
              }}
              className={active ? "" : "hover:opacity-75"}
            >
              {o.label}
            </a>
          </span>
        );
      })}
    </div>
  );
}
