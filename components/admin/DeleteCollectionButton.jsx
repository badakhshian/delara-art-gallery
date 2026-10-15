"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";

export default function DeleteCollectionButton({ slug, name, pieceCount }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const message =
      pieceCount > 0
        ? `Delete the collection "${name}"?\n\nIts ${pieceCount} ${pieceCount === 1 ? "piece stays" : "pieces stay"} on the website, but will no longer belong to a collection. This can't be undone.`
        : `Delete the collection "${name}"? This can't be undone.`;
    if (!confirm(message)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/collections?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete.");
      }
    } catch {
      alert("Could not delete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs uppercase px-3 py-2"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: adminPalette.oxblood,
        background: "none",
        border: `1px solid ${adminPalette.oxblood}`,
        letterSpacing: "0.1em",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      {loading ? "Deleting…" : "Delete collection"}
    </button>
  );
}
