"use client";

import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";

export default function BackButton() {
  const router = useRouter();

  function handleBack() {
    // If there's real browser history to go back to, use it — this
    // returns to whatever page actually linked here (a collection, the
    // homepage, etc). Only falls back to the homepage if this page was
    // opened directly (no history, e.g. from a shared link or new tab).
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  // Sits just below the fixed header (logo is 60px + 12px padding top and
  // bottom) and lines up with the logo's left edge (px-8).
  return (
    <button
      onClick={handleBack}
      className="absolute left-8"
      style={{
        top: 100,
        zIndex: 10,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: palette.brass,
        background: "none",
        border: "none",
        padding: "7px 0",
        cursor: "pointer",
      }}
    >
      ← Back
    </button>
  );
}
