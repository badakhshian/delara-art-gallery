"use client";

import { useState } from "react";
import { adminPalette } from "@/lib/palette";

export default function OrderPrivateNote({ orderId, initialNote }) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(initialNote);
  const [state, setState] = useState(null);

  async function save() {
    setState("saving");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "note", privateNote: note }),
      });
      if (!res.ok) throw new Error();
      setSaved(note);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setState(null);
        }}
        rows={3}
        placeholder="Add a note…"
        className="w-full p-3 text-[15px] sm:text-sm"
        style={{ border: `1px solid ${adminPalette.border}`, background: "#FFFFFF", fontFamily: "'Inter', sans-serif", color: adminPalette.text, resize: "vertical" }}
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={note === saved || state === "saving"}
          className="text-[11px] uppercase px-4"
          style={{
            height: 40,
            border: `1px solid ${adminPalette.text}`,
            background: "transparent",
            color: adminPalette.text,
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.1em",
            opacity: note === saved ? 0.4 : 1,
            cursor: note === saved ? "default" : "pointer",
          }}
        >
          {state === "saving" ? "Saving…" : "Save note"}
        </button>
        {state === "saved" && <span className="text-xs" style={{ color: "#2F5A2A" }}>Saved</span>}
        {state === "error" && <span className="text-xs" style={{ color: adminPalette.oxblood }}>Could not save. Try again.</span>}
      </div>
    </div>
  );
}
