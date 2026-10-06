"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";
import { localizeCollection } from "@/lib/localize";
import BilingualField from "@/components/admin/BilingualField";

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  background: adminPalette.surface,
  color: adminPalette.text,
  border: `1px solid ${adminPalette.border}`,
  padding: "10px 12px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  color: adminPalette.muted,
  letterSpacing: "0.08em",
};

// English and French names and short descriptions of every collection. The French box shows what
// the French site currently displays (saved French or built-in translation).
export default function EditCollectionsForm({ collections }) {
  const router = useRouter();
  const [rows, setRows] = useState(() =>
    collections.map((c) => {
      const frName = localizeCollection(c, "fr").name;
      return {
        slug: c.slug,
        name: c.name,
        nameFr: c.nameFr || (frName !== c.name ? frName : ""),
        description: c.description || "",
        descriptionFr: c.descriptionFr || "",
      };
    })
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (slug, key, value) => {
    setSaved(false);
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, [key]: value } : r)));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections: rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save collections.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
      {rows.length === 0 && (
        <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.muted }}>
          No collections yet — create one from a piece's form.
        </p>
      )}

      {rows.map((r) => (
        <div
          key={r.slug}
          className="flex flex-col gap-4 pb-6"
          style={{ borderBottom: `1px solid ${adminPalette.border}` }}
        >
          <BilingualField
            label={`Collection name · ${r.slug}`}
            en={r.name}
            onEn={(v) => update(r.slug, "name", v)}
            fr={r.nameFr}
            onFr={(v) => update(r.slug, "nameFr", v)}
            required
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
          <BilingualField
            label="About this collection (shown on the Collections page)"
            en={r.description}
            onEn={(v) => update(r.slug, "description", v)}
            fr={r.descriptionFr}
            onFr={(v) => update(r.slug, "descriptionFr", v)}
            rows={4}
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="text-xs uppercase px-5 py-3 self-start"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: adminPalette.text,
          background: adminPalette.brass,
          letterSpacing: "0.1em",
          border: "none",
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Saving…" : "Save changes"}
      </button>

      {saved && (
        <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.text }}>
          Saved.
        </p>
      )}
      {error && (
        <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.oxblood }}>
          {error}
        </p>
      )}
    </form>
  );
}
