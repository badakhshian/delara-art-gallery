"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { useI18n } from "@/components/LangProvider";
import { featuredImage } from "@/lib/hero";

const LINE = "1px solid rgba(232,227,216,0.15)";

// Homepage band between the hero and "Currently on the wall": the newest
// collection's pieces cycling in an arch, beside a numbered list of every
// collection. On desktop, hovering a row shows that collection in the arch.
// Phones stack the heading, the arch, then the list.
// `collections` is newest first: [{ slug, name, pieces }].
export default function CollectionsBand({ collections, intervalSeconds = 5 }) {
  const { t, href } = useI18n();
  const [activeSlug, setActiveSlug] = useState(collections[0]?.slug);
  const [index, setIndex] = useState(0);

  const active = collections.find((c) => c.slug === activeSlug) || collections[0];
  const slides = (active?.pieces || []).filter((p) => featuredImage(p));

  useEffect(() => {
    setIndex(0);
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [activeSlug, slides.length, intervalSeconds]);

  if (!active) return null;
  const isNewest = active.slug === collections[0].slug;
  const current = slides[index % Math.max(slides.length, 1)];

  const heading = (
    <>
      <div
        className="text-[10px] lg:text-[11px] uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.14em" }}
      >
        {t.home.collectionsEyebrow}
      </div>
      <h2
        className="m-0 mt-2.5 text-[30px] sm:text-[34px] lg:text-[52px]"
        style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300, lineHeight: 1.05 }}
      >
        {t.collections.title}
      </h2>
    </>
  );

  return (
    <section className="px-6 sm:px-10 lg:px-16 2xl:px-24 py-10 sm:py-14 lg:py-20" aria-label={t.home.collectionsEyebrow}>
      <div className="sm:hidden mb-6">
        {heading}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-7 sm:gap-10 lg:gap-16 2xl:gap-24">
        <Link
          href={href(`/collections/${active.slug}`)}
          className="relative block flex-shrink-0 overflow-hidden h-[400px] sm:h-[500px] sm:w-[320px] lg:h-[580px] lg:w-[440px] 2xl:w-[480px]"
          style={{ borderRadius: "1000px 1000px 0 0", background: palette.wall }}
        >
          {slides.map((piece, i) => (
            <div
              key={`${active.slug}:${piece.id}`}
              className="absolute inset-0"
              style={{ opacity: piece === current ? 1 : 0, transition: "opacity 1.2s ease" }}
            >
              <Image
                src={featuredImage(piece)}
                alt={t.meta.imageAlt(piece.title, piece.medium)}
                fill
                sizes="(max-width: 640px) 100vw, 480px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{ height: 160, background: "linear-gradient(180deg, rgba(14,13,12,0) 0%, rgba(14,13,12,0.85) 100%)" }}
          />
          <div className="absolute left-5 bottom-5 lg:left-7 lg:bottom-7 right-20">
            {isNewest && (
              <div
                className="text-[9px] lg:text-[10px] uppercase"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.14em" }}
              >
                {t.home.newestCollection}
              </div>
            )}
            <div
              className="mt-1 text-2xl lg:text-[30px]"
              style={{ fontFamily: "'Fraunces', serif", color: palette.bone, lineHeight: 1.1 }}
            >
              {active.name}
            </div>
          </div>
          {slides.length > 1 && (
            <div className="absolute right-5 bottom-6 lg:right-7 lg:bottom-8 flex gap-2">
              {slides.map((p) => (
                <div
                  key={p.id}
                  style={{
                    width: 18,
                    height: 2,
                    background: p === current ? palette.brass : "rgba(232,227,216,0.5)",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="hidden sm:block">{heading}</div>
          <div className="hidden sm:block my-5 lg:mt-7 lg:mb-6" style={{ width: 56, height: 1, background: palette.brass }} />

          <nav aria-label={t.home.collectionsEyebrow} style={{ borderTop: LINE }}>
            {collections.map((c, i) => (
              <Link
                key={c.slug}
                href={href(`/collections/${c.slug}`)}
                onMouseEnter={() => setActiveSlug(c.slug)}
                onFocus={() => setActiveSlug(c.slug)}
                className="flex items-baseline gap-3.5 lg:gap-5 py-3.5 pr-2"
                style={{
                  borderBottom: LINE,
                  textDecoration: "none",
                  color: palette.bone,
                  background: c.slug === active.slug ? "linear-gradient(90deg, rgba(184,141,87,0.10), rgba(184,141,87,0))" : undefined,
                  transition: "background 0.3s ease",
                }}
              >
                <span
                  className="w-6 lg:w-7 flex-shrink-0 text-[13px] lg:text-[15px]"
                  style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: palette.brass }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 min-w-0 sm:truncate text-[19px] sm:text-lg lg:text-[22px]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {c.name}
                </span>
                <span
                  className="flex-shrink-0 text-[9px] lg:text-[10px] uppercase"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke, letterSpacing: "0.1em" }}
                >
                  {t.pieces(c.pieces.length)}
                </span>
                <span className="hidden lg:inline" style={{ color: palette.brass }} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <Link
            href={href("/collections")}
            className="mt-6 lg:mt-7 self-stretch sm:self-start text-center text-[10px] lg:text-[11px] uppercase px-5 py-3.5"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
              letterSpacing: "0.12em",
              textDecoration: "none",
            }}
          >
            {t.home.viewAllCollections}
          </Link>
        </div>
      </div>
    </section>
  );
}
