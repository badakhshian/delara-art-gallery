"use client";

import { QRCodeSVG } from "qrcode.react";
import { palette } from "@/lib/palette";
import { SITE_URL } from "@/lib/site";

export default function PieceQRCode({ piece, size = 96 }) {
  const url = `${SITE_URL}/piece/${piece.id}?verify=${piece.certificateId}`;

  return (
    <div className="flex items-center gap-3">
      <div style={{ background: palette.bone, padding: 8, lineHeight: 0 }}>
        <QRCodeSVG value={url} size={size} bgColor={palette.bone} fgColor={palette.void} />
      </div>
      <div
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
        className="text-[11px] leading-relaxed"
      >
        <div className="uppercase" style={{ letterSpacing: "0.08em" }}>
          Scan to verify
        </div>
        <div style={{ color: palette.brass }}>{piece.certificateId}</div>
      </div>
    </div>
  );
}
