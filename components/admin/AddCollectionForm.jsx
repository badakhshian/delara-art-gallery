"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";
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

const buttonStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  letterSpacing: "0.1em",
  border: "none",
};

const EMPTY = { name: "", nameFr: "", description: "", descriptionFr: "" };

// "+ Add collection" on the Collections tab: opens a small bilingual form.
export default function AddCollectionForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, unique: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add the collection.");
      setAdded(data.collection.name);
      setForm(EMPTY);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setAdded("");
          }}
          className="text-xs uppercase px-5 py-3"
          style={{ ...buttonStyle, color: adminPalette.surface, background: adminPalette.text, cursor: "pointer" }}
        >
          + Add collection
        </button>
        {added && (
          <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.text }}>
            “{added}” added — it appears on the website once a piece is in it.
          </span>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 p-5 sm:p-6 flex flex-col gap-4 max-w-4xl"
      style={{ background: adminPalette.surface, border: `1px solid ${adminPalette.border}` }}
    >
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", color: adminPalette.text }}>New collection</div>
      <BilingualField
        label="Collection name"
        en={form.name}
        onEn={set("name")}
        fr={form.nameFr}
        onFr={set("nameFr")}
        required
        inputStyle={{ ...inputStyle, background: "#FFFFFF" }}
        labelStyle={labelStyle}
      />
      <BilingualField
        label="About this collection (optional, shown on the Collections page)"
        en={form.description}
        onEn={set("description")}
        fr={form.descriptionFr}
        onFr={set("descriptionFr")}
        rows={3}
        inputStyle={{ ...inputStyle, background: "#FFFFFF" }}
        labelStyle={labelStyle}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="text-xs uppercase px-5 py-3"
          style={{ ...buttonStyle, color: adminPalette.text, background: adminPalette.brass, cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Adding…" : "Add collection"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="text-xs uppercase px-5 py-3"
          style={{ ...buttonStyle, color: adminPalette.muted, background: "none", border: `1px solid ${adminPalette.border}`, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.oxblood }}>
          {error}
        </p>
      )}
    </form>
  );
}
