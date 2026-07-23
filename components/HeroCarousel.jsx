"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import WallLabel from "./WallLabel";

const FALLBACK_GRADIENTS = {
  "vessel-no-7": "linear-gradient(180deg, #2a2622 0%, #b08d57 55%, #1a1917 100%)",
  "nocturne-third-version": "linear-gradient(220deg, #0e0d0c 0%, #1c2b33 40%, #3a2a1f 100%)",
  "untitled-fragment": "linear-gradient(140deg, #3a1f1f 0%, #1a1917 60%, #8a857c 100%)",
  "the-long-room": "linear-gradient(170deg, #1f2620 0%, #2b2320 50%, #0e0d0c 100%)",
};

export default function HeroCarousel({ pieces, intervalSeconds = 6 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pieces.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pieces.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [pieces.length, intervalSeconds]);

  const current = pieces[index];

  return (
    <Link href={`/piece/${current.id}`}>
      <section className="relative w-full cursor-pointer" style={{ height: "92vh", minHeight: 640 }}>
        <div className="absolute inset-0 overflow-hidden" style={{ background: palette.wall }}>
          {pieces.map((piece, i) => {
            const image = piece.images?.[0];
            return (
              <div
                key={piece.id}
                className="absolute inset-0"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: "opacity 1.2s ease",
                  background: image ? undefined : FALLBACK_GRADIENTS[piece.id],
                }}
              >
                {image && (
                  <Image
                    src={image}
                    alt={`${piece.title} by ${piece.artist}`}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(14,13,12,0.05) 0%, rgba(14,13,12,0) 35%, rgba(14,13,12,0.15) 60%, rgba(14,13,12,0.9) 100%)",
            }}
          />
        </div>

        <div className="absolute left-0 right-0 bottom-0 px-8 sm:px-14 pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-xl">
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                color: palette.bone,
                fontWeight: 300,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                transition: "opacity 0.4s ease",
              }}
              key={current.id}
            >
              {current.title}
            </h1>
            <p
              className="mt-4 text-sm max-w-md"
              style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
            >
              Original mixed-media works by Delara Ahmadi Darani — acrylic and
              modelling paste built up into raised, textured surfaces. Available
              directly from the studio, one piece at a time.
            </p>
          </div>
          <div
            className="px-5 py-4"
            style={{ background: "rgba(14,13,12,0.55)", backdropFilter: "blur(4px)" }}
          >
            <WallLabel piece={current} dark />
          </div>
        </div>

        {pieces.length > 1 && (
          <div className="absolute top-6 right-8 flex gap-2">
            {pieces.map((p, i) => (
              <div
                key={p.id}
                style={{
                  width: 24,
                  height: 2,
                  background: i === index ? palette.brass : "rgba(232,227,216,0.3)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </Link>
  );
}
