"use client";

import { palette } from "@/lib/palette";
import { formatPrice } from "@/lib/pieces";
import { useI18n } from "@/components/LangProvider";

export default function WallLabel({ piece, dark = true }) {
  const { lang, t } = useI18n();
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: dark ? palette.bone : palette.wall,
      }}
      className="text-[11px] tracking-wide leading-relaxed"
    >
      <div className="uppercase" style={{ letterSpacing: "0.08em" }}>
        {piece.title}
      </div>
      <div style={{ color: palette.brass }}>
        {piece.artist}, {piece.year}
      </div>
      <div style={{ color: palette.smoke }}>
        {piece.medium} · {piece.dims}
      </div>
      <div className="mt-1" style={{ color: dark ? palette.bone : palette.wall }}>
        {piece.sold ? t.sold : formatPrice(piece.priceCents, lang)}
      </div>
    </div>
  );
}
