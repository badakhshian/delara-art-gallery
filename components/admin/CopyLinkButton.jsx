"use client";

import { useState } from "react";
import { adminPalette } from "@/lib/palette";

export default function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center px-3 truncate text-xs"
        style={{
          height: 44,
          border: `1px solid ${adminPalette.border}`,
          background: "#FFFFFF",
          color: adminPalette.muted,
          fontFamily: "'IBM Plex Mono', monospace",
          textDecoration: "none",
        }}
        title="Open the buyer's page"
      >
        <span className="truncate">{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="text-[11px] uppercase px-4"
        style={{
          height: 44,
          border: `1px solid ${adminPalette.text}`,
          background: "#FFFFFF",
          color: adminPalette.text,
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.1em",
          cursor: "pointer",
        }}
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
