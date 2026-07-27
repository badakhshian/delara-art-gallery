"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";

export default function DeletePieceButton({ pieceId, pieceTitle }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${pieceTitle}"? This can't be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pieces?id=${encodeURIComponent(pieceId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Could not delete.");
      }
    } catch (err) {
      alert("Could not delete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs uppercase px-3 py-2"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: palette.oxblood,
        background: "none",
        border: `1px solid ${palette.oxblood}`,
        letterSpacing: "0.1em",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
