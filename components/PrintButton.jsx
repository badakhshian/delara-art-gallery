"use client";

import { palette } from "@/lib/palette";

export default function PrintButton() {
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
      Print / Save as PDF
    </button>
  );
}
