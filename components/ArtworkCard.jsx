"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import WallLabel from "./WallLabel";

// Deterministic placeholder gradients for pieces without a photo yet, keyed
// by piece id so the same piece always gets the same look.
const FALLBACK_GRADIENTS = {
  "vessel-no-7": "linear-gradient(180deg, #2a2622 0%, #b08d57 55%, #1a1917 100%)",
  "nocturne-third-version": "linear-gradient(220deg, #0e0d0c 0%, #1c2b33 40%, #3a2a1f 100%)",
  "untitled-fragment": "linear-gradient(140deg, #3a1f1f 0%, #1a1917 60%, #8a857c 100%)",
  "the-long-room": "linear-gradient(170deg, #1f2620 0%, #2b2320 50%, #0e0d0c 100%)",
};

export default function ArtworkCard({ piece, tall }) {
  const [hover, setHover] = useState(false);
  const image = piece.images?.[0];

  return (
    <Link
      href={`/piece/${piece.id}`}
      className="flex flex-col gap-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="w-full overflow-hidden relative"
        style={{
          height: tall ? 380 : 300,
          background: image ? palette.wall : FALLBACK_GRADIENTS[piece.id],
          transition: "transform 0.5s cubic-bezier(.2,.8,.2,1), filter 0.5s ease",
          transform: hover ? "scale(1.02)" : "scale(1)",
          filter: hover ? "brightness(1.08)" : "brightness(1)",
        }}
      >
        {image && (
          <Image
            src={image}
            alt={`${piece.title} by ${piece.artist}`}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            style={{ objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)",
          }}
        />
        {piece.sold && (
          <div
            className="absolute top-3 right-3 px-2 py-1 text-[10px] uppercase"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              background: "rgba(14,13,12,0.85)",
              color: palette.bone,
              letterSpacing: "0.1em",
            }}
          >
            Sold
          </div>
        )}
      </div>
      <WallLabel piece={piece} dark />
    </Link>
  );
}
