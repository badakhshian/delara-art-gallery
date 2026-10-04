"use client";

import { useState } from "react";
import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";

export default function BuyButton({ piece }) {
  const { lang, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sharedStyle = {
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.1em",
  };

  if (piece.sold) {
    return (
      <button
        disabled
        className="text-xs uppercase px-5 py-3"
        style={{
          ...sharedStyle,
          color: palette.smoke,
          background: "transparent",
          border: `1px solid ${palette.smoke}`,
          cursor: "not-allowed",
        }}
      >
        {t.sold}
      </button>
    );
  }

  if (piece.priceCents == null) {
    return (
      <a
        href={`mailto:Ahmadi.delara@gmail.com?subject=${encodeURIComponent(
          t.piece.inquirySubject(piece.title)
        )}`}
        className="text-xs uppercase px-5 py-3 inline-block"
        style={{
          ...sharedStyle,
          color: palette.void,
          background: palette.brass,
          textDecoration: "none",
        }}
      >
        {t.piece.inquireAbout}
      </a>
    );
  }

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieceId: piece.id, lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t.piece.error);
      }
    } catch (e) {
      setError(t.piece.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="text-xs uppercase px-5 py-3"
        style={{
          ...sharedStyle,
          color: palette.void,
          background: palette.brass,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? t.piece.redirecting : t.piece.buyNow}
      </button>
      {error && (
        <p className="mt-2 text-xs" style={{ color: palette.oxblood, fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
