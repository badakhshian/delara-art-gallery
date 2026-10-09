"use client";

import { useState } from "react";
import { adminPalette } from "@/lib/palette";

// Sends the backup to Delara's email right away (the same email also goes
// out automatically every Monday).
export default function EmailBackupButton() {
  const [status, setStatus] = useState("idle");

  async function send() {
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/backup-email", { method: "POST" });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const label = { idle: "Email backup now", sending: "Sending…", sent: "Backup emailed ✓", error: "Could not send — try again" }[status];

  return (
    <button
      type="button"
      onClick={send}
      disabled={status === "sending"}
      className="text-xs uppercase px-4 py-2"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: status === "error" ? adminPalette.oxblood : adminPalette.text,
        background: "none",
        border: `1px solid ${adminPalette.border}`,
        letterSpacing: "0.1em",
        cursor: status === "sending" ? "wait" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
