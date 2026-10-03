"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { formatPrice } from "@/lib/pieces";

export default function WallAccordion({ pieces }) {
  if (pieces.length === 0) return null;

  return (
    <>
      <div className="hidden sm:block">
        <AccordionRow pieces={pieces} />
      </div>

      <MobileAccordionStack pieces={pieces} />
    </>
  );
}

function AccordionRow({ pieces }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function computeActive() {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      let index = 0;
      if (maxScrollLeft > 0) {
        const progress = Math.min(1, Math.max(0, container.scrollLeft / maxScrollLeft));
        index = Math.round(progress * (pieces.length - 1));
      }
      setActiveIndex((prev) => (prev === index ? prev : index));
      tickingRef.current = false;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(computeActive);
    }

    computeActive();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pieces.length]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto"
      style={{ height: 420, WebkitOverflowScrolling: "touch" }}
    >
      {pieces.map((piece, i) => (
        <AccordionPanel
          key={piece.id}
          piece={piece}
          active={i === activeIndex}
          onMouseEnter={() => setActiveIndex(i)}
        />
      ))}
    </div>
  );
}

function AccordionPanel({ piece, active, onMouseEnter }) {
  return (
    <Link
      href={`/piece/${piece.id}`}
      onMouseEnter={onMouseEnter}
      style={{
        position: "relative",
        width: active ? 380 : 90,
        flexShrink: 0,
        overflow: "hidden",
        background: palette.wall,
        transition: "width 0.5s cubic-bezier(.2,.8,.2,1)",
        textDecoration: "none",
        display: "block",
      }}
    >
      {piece.images?.[0] && (
        <Image
          src={piece.images[0]}
          alt={piece.title}
          fill
          sizes="(max-width: 1024px) 50vw, 20vw"
          style={{ objectFit: "cover" }}
        />
      )}

      {piece.sold && (
        <div
          className="absolute top-3 right-3 px-2 py-1 text-[10px] uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            background: "rgba(14,13,12,0.85)",
            color: palette.bone,
            letterSpacing: "0.1em",
            zIndex: 2,
          }}
        >
          Sold
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: active ? "45%" : "70%",
          background: "linear-gradient(180deg, rgba(14,13,12,0) 0%, rgba(14,13,12,0.92) 100%)",
          transition: "height 0.4s ease",
        }}
      />

      {active ? (
        <div className="absolute left-0 right-0 bottom-0 p-4">
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              color: palette.bone,
              fontWeight: 400,
              fontSize: "1.1rem",
              lineHeight: 1.2,
            }}
          >
            {piece.title}
          </div>
          <div
            className="mt-1"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, fontSize: 12 }}
          >
            {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
          </div>
        </div>
      ) : (
        <div
          className="absolute left-0 bottom-4"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.bone,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "10px 6px",
            whiteSpace: "nowrap",
          }}
        >
          {piece.title}
        </div>
      )}
    </Link>
  );
}

// ---------- Below sm: vertical scroll-driven stack, proportional to this
// section's own scroll range (not the whole page) ----------
function MobileAccordionStack({ pieces }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function computeActive() {
      const rect = wrapper.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const absoluteBottom = rect.bottom + window.scrollY;
      const start = absoluteTop;
      const end = absoluteBottom - window.innerHeight;
      const range = end - start;

      let index = 0;
      if (range > 0) {
        const progress = Math.min(1, Math.max(0, (window.scrollY - start) / range));
        index = Math.round(progress * (pieces.length - 1));
      }

      setActiveIndex((prev) => (prev === index ? prev : index));
      tickingRef.current = false;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(computeActive);
    }

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pieces.length]);

  return (
    <div ref={wrapperRef} className="flex sm:hidden flex-col gap-3">
      {pieces.map((piece, i) => (
        <MobileAccordionPanel key={piece.id} piece={piece} active={i === activeIndex} />
      ))}
    </div>
  );
}

function MobileAccordionPanel({ piece, active }) {
  return (
    <Link
      href={`/piece/${piece.id}`}
      style={{
        position: "relative",
        display: "block",
        height: active ? 380 : 90,
        overflow: "hidden",
        background: palette.wall,
        transition: "height 0.5s cubic-bezier(.2,.8,.2,1)",
        textDecoration: "none",
      }}
    >
      {piece.images?.[0] && (
        <Image src={piece.images[0]} alt={piece.title} fill sizes="100vw" style={{ objectFit: "cover" }} />
      )}
      {piece.sold && (
        <div
          className="absolute top-3 right-3 px-2 py-1 text-[10px] uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            background: "rgba(14,13,12,0.85)",
            color: palette.bone,
            letterSpacing: "0.1em",
            zIndex: 2,
          }}
        >
          Sold
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          background: "linear-gradient(180deg, rgba(14,13,12,0) 0%, rgba(14,13,12,0.92) 100%)",
        }}
      />
      <div className="absolute left-0 right-0 bottom-0 p-4">
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            color: palette.bone,
            fontWeight: 400,
            fontSize: active ? "1.1rem" : "0.95rem",
            lineHeight: 1.2,
            transition: "font-size 0.4s ease",
          }}
        >
          {piece.title}
        </div>
        {active && (
          <div
            className="mt-1"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, fontSize: 12 }}
          >
            {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
          </div>
        )}
      </div>
    </Link>
  );
}
