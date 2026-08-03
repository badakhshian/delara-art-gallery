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

  return (
    <button
      onClick={handleBack}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: palette.bone,
        background: "rgba(14,13,12,0.45)",
        border: "none",
        padding: "7px 12px",
        backdropFilter: "blur(3px)",
        cursor: "pointer",
      }}
    >
      ← Back
    </button>
  );
}
