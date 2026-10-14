"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";
import { STATUS_LABELS, CARRIER_OPTIONS } from "@/lib/orderAdmin";

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sans = { fontFamily: "'Inter', sans-serif" };
const fieldLabel = { ...mono, color: adminPalette.muted, letterSpacing: "0.12em" };
const inputStyle = {
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

export default function OrderUpdateForm({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [carrier, setCarrier] = useState(order.carrier || "canada_post");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingLink, setTrackingLink] = useState(order.trackingLink || "");
  const [noteToBuyer, setNoteToBuyer] = useState(order.noteToBuyer || "");
  const hasEmail = !!order.buyer?.email;
  const [notify, setNotify] = useState(hasEmail);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const showShipping = status === "shipped" || status === "delivered";

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          carrier: showShipping || order.carrier ? carrier : "",
          trackingNumber,
          trackingLink,
          noteToBuyer,
          notify: hasEmail && notify,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ ok: false, text: data.error || "Could not save. Try again." });
      } else if (data.emailError) {
        setMessage({ ok: false, text: `Saved, but the email was not sent: ${data.emailError}` });
        router.refresh();
      } else {
        setMessage({ ok: true, text: data.emailed ? "Saved — the buyer has been emailed." : "Saved." });
        router.refresh();
      }
    } catch {
      setMessage({ ok: false, text: "Could not save. Check your connection and try again." });
    }
    setSaving(false);
  }

  return (
    <form onSubmit={save}>
      <fieldset>
        <legend className="sr-only">Status</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {Object.entries(STATUS_LABELS).map(([value, label]) => {
            const checked = status === value;
            return (
              <label
                key={value}
                className="flex items-center gap-3 px-3.5 cursor-pointer text-[15px] sm:text-sm"
                style={{
                  ...sans,
                  minHeight: 48,
                  border: `1px solid ${checked ? adminPalette.brass : adminPalette.border}`,
                  background: checked ? "#F8EEDB" : "#FFFFFF",
                  color: value === "cancelled" ? "#8A2F22" : adminPalette.text,
                  fontWeight: checked ? 500 : 400,
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={checked}
                  onChange={() => setStatus(value)}
                  style={{ accentColor: adminPalette.brass, width: 18, height: 18 }}
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {showShipping && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-[220px_minmax(0,1fr)] gap-3.5 sm:gap-4">
          <label className="flex flex-col gap-2 text-[10px] uppercase" style={fieldLabel}>
            Carrier
            <select value={carrier} onChange={(e) => setCarrier(e.target.value)} style={{ ...inputStyle, ...sans }}>
              {CARRIER_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[10px] uppercase" style={fieldLabel}>
            Tracking number
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              autoComplete="off"
              style={{ ...inputStyle, ...mono, fontSize: 14 }}
            />
          </label>
          {carrier === "other" && (
            <label className="sm:col-span-2 flex flex-col gap-2 text-[10px] uppercase" style={fieldLabel}>
              Tracking link (optional)
              <input
                type="url"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                placeholder="https://"
                style={{ ...inputStyle, ...sans }}
              />
            </label>
          )}
        </div>
      )}

      <label className="mt-4 flex flex-col gap-2 text-[10px] uppercase" style={fieldLabel}>
        Note to the buyer (optional, shown on their page)
        <textarea
          value={noteToBuyer}
          onChange={(e) => setNoteToBuyer(e.target.value)}
          rows={3}
          className="p-3 normal-case"
          style={{ ...inputStyle, ...sans, height: "auto", resize: "vertical", letterSpacing: 0 }}
        />
      </label>

      <label
        className="mt-4 flex items-center gap-3 text-[15px] sm:text-sm"
        style={{ ...sans, minHeight: 44, color: hasEmail ? adminPalette.text : adminPalette.muted, cursor: hasEmail ? "pointer" : "default" }}
      >
        <input
          type="checkbox"
          checked={hasEmail && notify}
          disabled={!hasEmail}
          onChange={(e) => setNotify(e.target.checked)}
          style={{ accentColor: adminPalette.text, width: 20, height: 20 }}
        />
        {hasEmail ? "Email the buyer about this update" : "No buyer email on this order — no email will be sent"}
      </label>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-[11px] uppercase px-6 w-full sm:w-auto"
          style={{
            ...mono,
            height: 48,
            background: adminPalette.text,
            color: adminPalette.surface,
            border: "none",
            letterSpacing: "0.12em",
            cursor: saving ? "wait" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save update"}
        </button>
        {message && (
          <span role="status" className="text-sm" style={{ ...sans, color: message.ok ? "#2F5A2A" : adminPalette.oxblood }}>
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
