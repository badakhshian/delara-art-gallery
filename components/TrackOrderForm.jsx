"use client";

import { useState } from "react";
import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";

const fieldLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  color: palette.smoke,
  letterSpacing: "0.12em",
};

const inputStyle = {
  height: 48,
  padding: "0 14px",
  background: palette.wall,
  border: "1px solid rgba(232,227,216,0.2)",
  color: palette.bone,
  fontSize: 16,
  outline: "none",
  borderRadius: 0,
};

export default function TrackOrderForm() {
  const { lang, t } = useI18n();
  const o = t.order;
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(res.status === 404 ? o.notFound : o.error);
    } catch {
      setError(o.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-[22px]">
      <label className="flex flex-col gap-2 text-[11px] uppercase" style={fieldLabel}>
        {o.orderNumber}
        <input
          type="text"
          required
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="AD-0014"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="focus:border-[#B08D57]"
          style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
        />
      </label>
      <label className="flex flex-col gap-2 text-[11px] uppercase" style={fieldLabel}>
        {o.email}
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:border-[#B08D57]"
          style={{ ...inputStyle, fontFamily: "'Inter', sans-serif" }}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#D9A08B" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="text-xs uppercase"
        style={{
          height: 50,
          background: palette.brass,
          color: palette.void,
          border: "none",
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.14em",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? o.finding : o.find}
      </button>
    </form>
  );
}
