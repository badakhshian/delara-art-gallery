"use client";

import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";

export default function CertificateBackButton({ pieceId }) {
  const router = useRouter();

  function handleBack() {
    // Use real browser history so this doesn't push a new entry onto the
    // stack — otherwise going Collection -> Piece -> Certificate -> "back"
    // would leave an extra Piece entry in history, and the piece page's
    // own back button would then return to the Certificate instead of the
    // Collection page.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/piece/${pieceId}`);
    }
  }

  return (
    <button
      onClick={handleBack}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: palette.smoke,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      ← Back to piece
    </button>
  );
}
