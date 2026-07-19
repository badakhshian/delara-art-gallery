"use client";

import { useState } from "react";
import { palette } from "@/lib/palette";

export default function BuyButton({ piece }) {
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
        className="mt-10 text-xs uppercase px-5 py-3 self-start"
        style={{
          ...sharedStyle,
          color: palette.smoke,
          background: "transparent",
          border: `1px solid ${palette.smoke}`,
          cursor: "not-allowed",
        }}
      >
        Sold
      </button>
    );
  }

  // No price set yet — send them to email instead of a buy flow.
  if (piece.priceCents == null) {
    return (
      <a
        href={`mailto:Ahmadi.delara@gmail.com?subject=${encodeURIComponent(
          `Inquiry: ${piece.title}`
        )}`}
        className="mt-10 text-xs uppercase px-5 py-3 self-start inline-block"
        style={{
          ...sharedStyle,
          color: palette.void,
          background: palette.brass,
          textDecoration: "none",
        }}
      >
        Inquire about this piece
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
        body: JSON.stringify({ pieceId: piece.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 self-start">
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
        {loading ? "Redirecting…" : "Buy now"}
      </button>
      {error && (
        <p className="mt-2 text-xs" style={{ color: palette.oxblood, fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
