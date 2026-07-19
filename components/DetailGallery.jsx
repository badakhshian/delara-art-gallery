"use client";

import { useState } from "react";
import Image from "next/image";
import { palette } from "@/lib/palette";

export default function DetailGallery({ piece }) {
  const images = piece.images || [];
  const [active, setActive] = useState(images[0] || null);

  return (
    <div>
      <div
        className="w-full overflow-hidden relative"
        style={{ aspectRatio: "1 / 1", background: palette.wall }}
      >
        {active && (
          <Image
            src={active}
            alt={piece.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
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
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(img)}
              style={{
                width: 72,
                height: 72,
                padding: 0,
                border: img === active ? `2px solid ${palette.brass}` : "2px solid transparent",
                opacity: img === active ? 1 : 0.6,
                cursor: "pointer",
                overflow: "hidden",
                background: "none",
                position: "relative",
              }}
            >
              <Image
                src={img}
                alt={`${piece.title} view ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p
          className="mt-4 text-xs"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
        >
          Photos coming soon.
        </p>
      )}
    </div>
  );
}
