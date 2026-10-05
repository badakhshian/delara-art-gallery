"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";
import { featuredImage } from "@/lib/hero";

const PAPER = "#E4DFD6";
const INK = "#141210";
const THUMBS = 4;

// One collection laid out like an exhibition poster: the collection's
// slideshow on top with a drop-shaped cut rising from the bottom, the name
// in large capitals underneath, details bottom-left and a few of its pieces
// bottom-right.
export default function CollectionPoster({ collection, pieces, intervalSeconds = 5 }) {
  const { t, href } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pieces.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % pieces.length), intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [pieces.length, intervalSeconds]);

  if (pieces.length === 0) return null;
  const current = pieces[index];
  const years = pieces.map((p) => parseInt(p.year, 10)).filter(Boolean);
  const first = Math.min(...years);
  const last = Math.max(...years);
  const yearText = years.length === 0 ? "" : first === last ? `${first}` : `${first} | ${last}`;
  const media = [...new Set(pieces.map((p) => p.medium).filter(Boolean))].slice(0, 2);
  const collectionHref = href(`/collections/${collection.slug}`);

  return (
    <article className="overflow-hidden" style={{ background: PAPER, color: INK }}>
      <Link href={href(`/piece/${current.id}`)} className="block">
        <div className="relative w-full h-[52vh] min-h-[340px] sm:h-[58vh] sm:min-h-[420px]" style={{ background: palette.wall }}>
          {pieces.map((piece, i) => {
            const image = featuredImage(piece);
            return (
              <div
                key={piece.id}
                className="absolute inset-0"
                style={{ opacity: i === index ? 1 : 0, transition: "opacity 1.2s ease" }}
              >
                {image && (
                  <Image
                    src={image}
                    alt={t.meta.imageAlt(piece.title)}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            );
          })}

          {/* Drop-shaped cut: a hairline slit at the top that widens into two
              curves meeting the bottom corners, in the paper colour. */}
          <svg
            className="absolute left-0 top-0 w-full"
            style={{ height: "calc(100% + 2px)" }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 498 0 L 502 0 L 502 120 C 506 560, 640 930, 1000 1000 L 0 1000 C 360 930, 494 560, 498 120 Z"
              fill={PAPER}
            />
          </svg>

          <div
            className="absolute top-4 left-5 sm:top-5 sm:left-7 px-2 py-1 text-[10px] sm:text-[11px] uppercase"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.bone,
              background: "rgba(14,13,12,0.45)",
              letterSpacing: "0.1em",
            }}
          >
            {current.title}
          </div>

          {pieces.length > 1 && (
            <div className="absolute top-5 right-5 sm:right-7 flex gap-2">
              {pieces.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    width: 18,
                    height: 2,
                    background: i === index ? palette.brass : "rgba(232,227,216,0.45)",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 pb-8 sm:pb-12">
        <Link href={collectionHref} style={{ textDecoration: "none", color: INK }}>
          <h2
            className="uppercase"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: "clamp(2.25rem, 7vw, 6rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              maxWidth: "14ch",
            }}
          >
            {collection.name}
          </h2>
        </Link>

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div
            className="text-[11px] sm:text-xs uppercase leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: "0.04em" }}
          >
            <div>{t.collections.collection} · {t.pieces(pieces.length)}</div>
            {media.length > 0 && <div style={{ color: "#5E5850" }}>{media.join(" · ")}</div>}
            {yearText && <div className="mt-3">{yearText}</div>}
            <Link
              href={collectionHref}
              className="inline-block mt-4"
              style={{ color: palette.oxblood, textDecoration: "none", letterSpacing: "0.08em" }}
            >
              {t.collections.viewFull}
            </Link>
          </div>

          <div className="flex gap-2 sm:gap-3">
            {pieces.slice(0, THUMBS).map((piece) => {
              const image = featuredImage(piece);
              return (
                <Link
                  key={piece.id}
                  href={href(`/piece/${piece.id}`)}
                  title={piece.title}
                  className="relative block overflow-hidden w-[64px] h-[80px] sm:w-[84px] sm:h-[104px] lg:w-[96px] lg:h-[120px]"
                  style={{ background: palette.wall }}
                >
                  {image && (
                    <Image src={image} alt={piece.title} fill sizes="120px" style={{ objectFit: "cover" }} />
                  )}
                </Link>
              );
            })}
            {pieces.length > THUMBS && (
              <Link
                href={collectionHref}
                className="flex items-center justify-center text-xs w-[48px] h-[80px] sm:w-[60px] sm:h-[104px] lg:h-[120px]"
                style={{
                  border: `1px solid ${INK}`,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: INK,
                  textDecoration: "none",
                }}
              >
                +{pieces.length - THUMBS}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
