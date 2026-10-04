"use client";

import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";

export default function PrintButton() {
  const { t } = useI18n();
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden text-xs uppercase px-5 py-3"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: palette.void,
        background: palette.brass,
        letterSpacing: "0.1em",
        border: "none",
        cursor: "pointer",
      }}
    >
      {t.certificate.print}
    </button>
  );
}
