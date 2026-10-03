"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { formatPrice } from "@/lib/pieces";

const WINDOW_SIZE = 6;
const SLIDE_COOLDOWN_MS = 550;

export default function WallAccordion({ pieces }) {
  // Detect actual touch hardware directly, rather than relying on
  // "hover: hover" — a touchscreen Windows laptop often also has a
  // trackpad, so it can report itself as hover-capable even though
  // someone's using their finger on the screen. Any device with real
  // touch support (iPad, a touchscreen laptop, etc) gets the swipe row;
  // only devices with no touch hardware at all get the hover row.
  const [hasTouch, setHasTouch] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const touchCapable =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);
    setHasTouch(!!touchCapable);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <>
      {/* sm and up: hover-driven row on mouse-only devices, horizontal
          swipe-to-scroll row on anything with touch (iPad, touchscreen
          Windows laptops, etc) */}
      <div className="hidden sm:block">
        {hasTouch ? <TouchScrollRow pieces={pieces} /> : <HoverRow pieces={pieces} />}
      </div>

      {/* Below sm: vertical scroll-driven stack */}
      <MobileAccordionStack pieces={pieces} />
    </>
  );
}

// ---------- Desktop: hover + sliding window over the whole catalog ----------
function HoverRow({ pieces }) {
  const total = pieces.length;
  const effectiveWindowSize = Math.min(WINDOW_SIZE, total);
  const [windowStart, setWindowStart] = useState(0);
  const [activePieceId, setActivePieceId] = useState(pieces[0]?.id ?? null);
  const slidingRef = useRef(false);

  const visible = pieces.slice(windowStart, windowStart + effectiveWindowSize);

  useEffect(() => {
    if (!visible.some((p) => p.id === activePieceId)) {
      setActivePieceId(visible[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowStart]);

  function triggerSlide(direction) {
    if (slidingRef.current) return;
    slidingRef.current = true;
    setWindowStart((start) => {
      const next = start + direction;
      return Math.max(0, Math.min(next, total - effectiveWindowSize));
    });
    setTimeout(() => {
      slidingRef.current = false;
    }, SLIDE_COOLDOWN_MS);
  }

  function handleHover(piece, indexInWindow) {
    setActivePieceId(piece.id);
    if (indexInWindow === 0 && windowStart > 0) {
      triggerSlide(-1);
    } else if (
      indexInWindow >= effectiveWindowSize - 3 &&
      windowStart + effectiveWindowSize < total
    ) {
      triggerSlide(1);
    }
  }

  function handleRowLeave() {
    setActivePieceId(visible[0]?.id ?? null);
  }

  return (
    <div className="flex gap-2" style={{ height: 420 }} onMouseLeave={handleRowLeave}>
      {visible.map((piece, i) => (
        <AccordionPanel
          key={piece.id}
          piece={piece}
          active={piece.id === activePieceId}
          onMouseEnter={() => handleHover(piece, i)}
          flexMode
        />
      ))}
    </div>
  );
}

// ---------- Touch (sm+): native horizontal scroll, center panel expands ----------
function TouchScrollRow({ pieces }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const refs = useRef([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function computeActive() {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const panelCenter = rect.left + rect.width / 2;
        const distance = Math.abs(panelCenter - centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
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
          panelRef={(el) => (refs.current[i] = el)}
        />
      ))}
    </div>
  );
}

// ---------- Shared panel, used by both desktop hover row and touch scroll row ----------
function AccordionPanel({ piece, active, onMouseEnter, panelRef, flexMode }) {
  return (
    <Link
      ref={panelRef}
      href={`/piece/${piece.id}`}
      onMouseEnter={onMouseEnter}
      style={{
        position: "relative",
        ...(flexMode
          ? { flex: active ? 3.2 : 1, minWidth: 0 }
          : { width: active ? 380 : 90, flexShrink: 0 }),
        overflow: "hidden",
        background: palette.wall,
        transition: flexMode ? "flex 0.55s cubic-bezier(.2,.8,.2,1)" : "width 0.5s cubic-bezier(.2,.8,.2,1)",
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

// ---------- Below sm: vertical scroll-driven stack ----------
function MobileAccordionStack({ pieces }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    function computeActive() {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const panelCenter = rect.top + rect.height / 2;
        const distance = Math.abs(panelCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
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
  }, []);

  return (
    <div className="flex sm:hidden flex-col gap-3">
      {pieces.map((piece, i) => (
        <MobileAccordionPanel
          key={piece.id}
          piece={piece}
          active={i === activeIndex}
          panelRef={(el) => (refs.current[i] = el)}
        />
      ))}
    </div>
  );
}

function MobileAccordionPanel({ piece, active, panelRef }) {
  return (
    <Link
      ref={panelRef}
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
