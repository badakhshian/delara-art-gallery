"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";
import { featuredImage } from "@/lib/hero";

const CARD = "#1B1917";
const SOFT_TEXT = "#BDB6A8";
const ARCH_THUMBS = 3;
const LIST_ITEMS = 4;

// One collection on /collections. `variant` rotates down the page:
// - "arch": on the page background, the text beside a slideshow framed by an
//   arch (picture on the right), with a few small pieces overlapping its
//   bottom corner.
// - "curve": a dark card, the slideshow on one side ending in a soft curve,
//   the text and a list of the pieces on the other.
// - "circle": like "arch", but the slideshow is a circle on the left.
// Phones stack all of them: picture first, then the text.
export default function CollectionShowcase({ collection, pieces, number, variant, intervalSeconds = 5 }) {
  const index = useSlideshow(pieces.length, intervalSeconds);
  if (pieces.length === 0) return null;
  const props = { collection, pieces, number, index, info: collectionInfo(pieces) };
  if (variant === "curve") return <CurveCard {...props} />;
  return <FramedSection {...props} circle={variant === "circle"} />;
}

function useSlideshow(count, intervalSeconds) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [count, intervalSeconds]);
  return index;
}

function collectionInfo(pieces) {
  const years = pieces.map((p) => parseInt(p.year, 10)).filter(Boolean);
  const first = years.length ? Math.min(...years) : null;
  const last = years.length ? Math.max(...years) : null;
  return {
    years: first == null ? "" : first === last ? `${first}` : `${first}–${last}`,
    media: [...new Set(pieces.map((p) => p.medium).filter(Boolean))].slice(0, 2),
  };
}

// The collection's pieces cross-fading inside whatever frame wraps it.
function Slides({ pieces, index, sizes }) {
  const { t } = useI18n();
  return pieces.map((piece, i) => {
    const image = featuredImage(piece);
    return (
      <div
        key={piece.id}
        className="absolute inset-0"
        style={{ opacity: i === index ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        {image && (
          <Image src={image} alt={t.meta.imageAlt(piece.title)} fill sizes={sizes} style={{ objectFit: "cover" }} />
        )}
      </div>
    );
  });
}

function ProgressBars({ count, index, className }) {
  if (count < 2) return null;
  return (
    <div className={`absolute flex gap-2 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 2,
            background: i === index ? palette.brass : "rgba(232,227,216,0.5)",
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function Description({ text, color, className = "" }) {
  if (!text) return null;
  return (
    <p
      className={`m-0 text-[15px] sm:text-base lg:text-lg leading-relaxed ${className}`}
      style={{ fontFamily: "'Fraunces', serif", color, whiteSpace: "pre-line" }}
    >
      {text}
    </p>
  );
}

function ViewLink({ href, label }) {
  return (
    <Link
      href={href}
      className="self-start py-3 text-[11px] lg:text-xs uppercase"
      style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.12em", textDecoration: "none" }}
    >
      {label}
    </Link>
  );
}

function FramedSection({ collection, pieces, number, index, info, circle }) {
  const { t, href } = useI18n();
  const current = pieces[index];
  const collectionHref = href(`/collections/${collection.slug}`);
  const meta = [t.pieces(pieces.length), ...info.media, info.years].filter(Boolean).join(" · ");

  return (
    <section
      className={`flex flex-col-reverse ${circle ? "sm:flex-row-reverse" : "sm:flex-row"} sm:items-center gap-5 sm:gap-10 lg:gap-24 px-6 sm:px-10 lg:px-24 py-10 sm:py-14 lg:py-20`}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-4 lg:gap-6">
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: palette.brass }} className="text-lg lg:text-[22px]">
          {String(number).padStart(2, "0")}
        </div>
        <Link href={collectionHref} style={{ textDecoration: "none", color: palette.bone }}>
          <h2
            className="m-0 text-[46px] sm:text-[50px] lg:text-[84px]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.015em" }}
          >
            {collection.name}
          </h2>
        </Link>
        <div style={{ width: 56, height: 1, background: palette.brass }} />
        <Description text={collection.description} color={SOFT_TEXT} className="max-w-[40ch]" />
        <div
          className="text-[10px] lg:text-[11px] uppercase leading-loose"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke, letterSpacing: "0.1em" }}
        >
          {meta}
        </div>
        <ViewLink href={collectionHref} label={t.collections.viewFull} />
      </div>

      <div
        className={`relative w-full flex-shrink-0 ${
          circle
            ? "sm:w-[360px] lg:w-[500px] xl:w-[600px] pb-7 lg:pb-9"
            : "sm:w-[340px] lg:w-[520px] xl:w-[600px] pb-9 lg:pb-14"
        }`}
      >
        <Link href={href(`/piece/${current.id}`)} className="block">
          <div
            className={`relative overflow-hidden ${
              circle ? "aspect-square" : "h-[420px] sm:h-[460px] lg:h-[640px] xl:h-[720px]"
            }`}
            style={{ borderRadius: circle ? "50%" : "1000px 1000px 0 0", background: palette.wall }}
          >
            <Slides pieces={pieces} index={index} sizes="(max-width: 640px) 100vw, 600px" />
            <ProgressBars
              count={pieces.length}
              index={index}
              className={
                circle
                  ? "left-1/2 -translate-x-1/2 bottom-6 lg:bottom-9"
                  : "right-5 bottom-5 lg:right-7 lg:bottom-7"
              }
            />
          </div>
        </Link>
        <div
          className={`absolute bottom-0 flex gap-2 lg:gap-3 ${
            circle ? "right-0 sm:-right-6 lg:-right-10" : "left-3 sm:-left-7 lg:-left-12"
          }`}
        >
          {pieces.slice(0, ARCH_THUMBS).map((piece) => {
            const image = featuredImage(piece);
            return (
              <Link
                key={piece.id}
                href={href(`/piece/${piece.id}`)}
                title={piece.title}
                className="relative block overflow-hidden w-[60px] h-[76px] sm:w-[68px] sm:h-[86px] lg:w-[96px] lg:h-[120px]"
                style={{ border: `3px solid ${palette.void}`, background: palette.wall }}
              >
                {image && <Image src={image} alt={piece.title} fill sizes="100px" style={{ objectFit: "cover" }} />}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CurveCard({ collection, pieces, number, index, info }) {
  const { t, href } = useI18n();
  const current = pieces[index];
  const collectionHref = href(`/collections/${collection.slug}`);
  const eyebrow = [`${t.collections.collection} ${String(number).padStart(2, "0")}`, info.years].filter(Boolean).join(" · ");
  const extra = pieces.length - LIST_ITEMS;

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
      <article className="flex flex-col sm:flex-row sm:h-[540px] lg:h-[640px]" style={{ background: CARD, color: palette.bone }}>
        <Link
          href={href(`/piece/${current.id}`)}
          className="relative block flex-shrink-0 overflow-hidden h-[380px] sm:h-auto sm:w-[48%] lg:w-[56%]"
          style={{ background: palette.void }}
        >
          <Slides pieces={pieces} index={index} sizes="(max-width: 640px) 100vw, 56vw" />
          {/* Phones: the curve sweeps across the bottom edge. */}
          <svg
            className="sm:hidden absolute left-0 w-full h-full"
            style={{ bottom: -1 }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 0 1000 L 1000 1000 L 1000 760 C 780 930, 420 990, 0 1000 Z" fill={CARD} />
          </svg>
          {/* Tablet and desktop: the curve runs down the inner edge. */}
          <svg
            className="hidden sm:block absolute top-0 w-full h-full"
            style={{ right: -1 }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 1000 0 L 1000 1000 L 710 1000 C 895 820, 985 520, 1000 0 Z" fill={CARD} />
          </svg>
          <div
            className="absolute top-4 left-4 lg:top-6 lg:left-7 px-2 py-1 text-[9px] lg:text-[11px] uppercase"
            style={{ fontFamily: "'IBM Plex Mono', monospace", background: "rgba(14,13,12,0.5)", letterSpacing: "0.12em" }}
          >
            {current.title}
          </div>
          <ProgressBars count={pieces.length} index={index} className="right-4 top-5 sm:right-auto sm:top-auto sm:left-4 sm:bottom-5 lg:left-7 lg:bottom-7" />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col gap-4 lg:gap-5 px-5 pt-3 pb-6 sm:pl-1 sm:pr-7 sm:pt-9 sm:pb-7 lg:pr-14 lg:pt-14 lg:pb-12">
          <div
            className="text-[10px] lg:text-[11px] uppercase"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.14em" }}
          >
            {eyebrow}
          </div>
          <Link href={collectionHref} style={{ textDecoration: "none", color: palette.bone }}>
            <h2
              className="m-0 uppercase text-[40px] lg:text-[64px]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, lineHeight: 1.02, letterSpacing: "-0.01em" }}
            >
              {collection.name}
            </h2>
          </Link>
          <Description text={collection.description} color={SOFT_TEXT} className="sm:line-clamp-4 lg:line-clamp-none" />

          <div className="sm:mt-auto flex flex-col">
            <ul className="m-0 p-0 list-none">
              {pieces.slice(0, LIST_ITEMS).map((piece, i) => {
                const image = featuredImage(piece);
                return (
                  <li
                    key={piece.id}
                    style={{
                      borderTop: "1px solid rgba(232,227,216,0.18)",
                      borderBottom: i === Math.min(pieces.length, LIST_ITEMS) - 1 ? "1px solid rgba(232,227,216,0.18)" : undefined,
                    }}
                  >
                    <Link
                      href={href(`/piece/${piece.id}`)}
                      className="flex items-center gap-3 lg:gap-4 py-2.5 lg:py-3"
                      style={{ textDecoration: "none", color: palette.bone }}
                    >
                      <span className="relative block flex-shrink-0 overflow-hidden w-10 h-[50px] lg:w-11 lg:h-14" style={{ background: palette.void }}>
                        {image && <Image src={image} alt="" fill sizes="48px" style={{ objectFit: "cover" }} />}
                      </span>
                      <span className="flex-1 min-w-0 truncate text-[15px] lg:text-[17px]" style={{ fontFamily: "'Fraunces', serif" }}>
                        {piece.title}
                      </span>
                      {piece.year && (
                        <span className="text-[10px] lg:text-[11px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}>
                          {piece.year}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ViewLink href={collectionHref} label={extra > 0 ? `+${extra} · ${t.collections.viewFull}` : t.collections.viewFull} />
          </div>
        </div>
      </article>
    </div>
  );
}
