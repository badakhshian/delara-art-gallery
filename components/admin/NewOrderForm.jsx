"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";
import { STATUS_LABELS } from "@/lib/orderAdmin";

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sans = { fontFamily: "'Inter', sans-serif" };
const fieldLabel = { ...mono, color: adminPalette.muted, letterSpacing: "0.12em" };
const inputStyle = {
  ...sans,
  height: 46,
  padding: "0 12px",
  border: `1px solid ${adminPalette.border}`,
  background: "#FFFFFF",
  color: adminPalette.text,
  fontSize: 15,
  borderRadius: 0,
  width: "100%",
  letterSpacing: "normal",
  textTransform: "none",
};
const card = { background: adminPalette.surface, border: `1px solid ${adminPalette.border}` };

function Field({ label, className = "", children }) {
  return (
    <label className={`flex flex-col gap-2 text-[10px] uppercase ${className}`} style={fieldLabel}>
      {label}
      {children}
    </label>
  );
}

export default function NewOrderForm({ pieces }) {
  const router = useRouter();
  const [pieceId, setPieceId] = useState("");
  const [pieceTitle, setPieceTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [shipping, setShipping] = useState({ line1: "", line2: "", city: "", state: "", postal_code: "", country: "Canada" });
  const [status, setStatus] = useState("paid");
  const [lang, setLang] = useState("en");
  const [markSold, setMarkSold] = useState(true);
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const selected = pieces.find((p) => p.id === pieceId);
  const setShip = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));

  function choosePiece(id) {
    setPieceId(id);
    const p = pieces.find((x) => x.id === id);
    if (p?.priceCents != null && !amount) setAmount(String(p.priceCents / 100));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceId,
          pieceTitle,
          amount,
          buyerName,
          buyerEmail,
          buyerPhone,
          shipping,
          status,
          lang,
          markSold: !!selected && !selected.sold && markSold,
          notify: !!buyerEmail && notify,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save. Try again.");
        setSaving(false);
        return;
      }
      const warnings = [data.soldError, data.emailError && `The email was not sent: ${data.emailError}`].filter(Boolean);
      if (warnings.length) window.alert(warnings.join("\n\n"));
      router.push(`/admin/orders/${data.order.id}`);
      router.refresh();
    } catch {
      setError("Could not save. Check your connection and try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start max-w-5xl">
      <section className="p-[18px] sm:p-7 flex flex-col gap-4" style={card}>
        <h2 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>Artwork</h2>
        <Field label="Piece">
          <select value={pieceId} onChange={(e) => choosePiece(e.target.value)} style={inputStyle}>
            <option value="">— Not on the website (type a title below) —</option>
            {pieces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
                {p.sold ? " (sold)" : ""}
              </option>
            ))}
          </select>
        </Field>
        {!pieceId && (
          <Field label="Artwork title">
            <input type="text" value={pieceTitle} onChange={(e) => setPieceTitle(e.target.value)} style={inputStyle} />
          </Field>
        )}
        <Field label="Amount paid (USD)">
          <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 2800" style={{ ...inputStyle, ...mono }} />
        </Field>
        {selected && !selected.sold && (
          <label className="flex items-center gap-3 text-[15px] sm:text-sm" style={{ ...sans, minHeight: 44 }}>
            <input type="checkbox" checked={markSold} onChange={(e) => setMarkSold(e.target.checked)} style={{ accentColor: adminPalette.text, width: 20, height: 20 }} />
            Mark this piece as sold on the website
          </label>
        )}
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            {Object.entries(STATUS_LABELS).filter(([v]) => v !== "cancelled").map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
      </section>

      <section className="p-[18px] sm:p-7 flex flex-col gap-4" style={card}>
        <h2 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>Buyer</h2>
        <Field label="Name">
          <input type="text" required value={buyerName} onChange={(e) => setBuyerName(e.target.value)} autoComplete="off" style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email (for their tracking link)">
            <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} autoComplete="off" style={inputStyle} />
          </Field>
          <Field label="Phone (optional)">
            <input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} autoComplete="off" style={inputStyle} />
          </Field>
        </div>
        <Field label="Their language">
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={inputStyle}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </Field>
        <div className="text-[10px] uppercase pt-1" style={fieldLabel}>Shipping address (leave empty if picked up or hand-delivered)</div>
        <input type="text" aria-label="Street address" placeholder="Street address" value={shipping.line1} onChange={setShip("line1")} style={inputStyle} />
        <input type="text" aria-label="Apartment, unit (optional)" placeholder="Apartment, unit (optional)" value={shipping.line2} onChange={setShip("line2")} style={inputStyle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" aria-label="City" placeholder="City" value={shipping.city} onChange={setShip("city")} style={inputStyle} />
          <input type="text" aria-label="Province / state" placeholder="Province / state" value={shipping.state} onChange={setShip("state")} style={inputStyle} />
          <input type="text" aria-label="Postal code" placeholder="Postal code" value={shipping.postal_code} onChange={setShip("postal_code")} style={inputStyle} />
          <input type="text" aria-label="Country" placeholder="Country" value={shipping.country} onChange={setShip("country")} style={inputStyle} />
        </div>
      </section>

      <div className="lg:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="flex items-center gap-3 text-[15px] sm:text-sm" style={{ ...sans, minHeight: 44, color: buyerEmail ? adminPalette.text : adminPalette.muted }}>
          <input
            type="checkbox"
            checked={!!buyerEmail && notify}
            disabled={!buyerEmail}
            onChange={(e) => setNotify(e.target.checked)}
            style={{ accentColor: adminPalette.text, width: 20, height: 20 }}
          />
          Email the buyer their private tracking link
        </label>
        <button
          type="submit"
          disabled={saving}
          className="sm:ml-auto text-[11px] uppercase px-6 w-full sm:w-auto"
          style={{ ...mono, height: 48, background: adminPalette.text, color: adminPalette.surface, border: "none", letterSpacing: "0.12em", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Saving…" : "Save order"}
        </button>
      </div>
      {error && (
        <p role="alert" className="lg:col-span-2 text-sm" style={{ ...sans, color: adminPalette.oxblood }}>
          {error}
        </p>
      )}
    </form>
  );
}
