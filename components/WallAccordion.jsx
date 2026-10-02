"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { formatPrice } from "@/lib/pieces";

const WINDOW_SIZE = 6;
const SLIDE_COOLDOWN_MS = 550;

export default function WallAccordion({ pieces }) {
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

  if (total === 0) return null;

  return (
    <>
      {/* Desktop: hover accordion, sliding window over the whole catalog */}
      <div
        className="hidden sm:flex gap-2"
        style={{ height: 420 }}
        onMouseLeave={handleRowLeave}
      >
        {visible.map((piece, i) => {
          const isActive = piece.id === activePieceId;
          return (
            <Link
              key={piece.id}
              href={`/piece/${piece.id}`}
              onMouseEnter={() => handleHover(piece, i)}
              style={{
                position: "relative",
                flex: isActive ? 3.2 : 1,
                minWidth: 0,
                overflow: "hidden",
                background: palette.wall,
                transition: "flex 0.55s cubic-bezier(.2,.8,.2,1)",
                textDecoration: "none",
                display: "block",
              }}
            >
              {piece.images?.[0] && (
                <Image
                  src={piece.images[0]}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 1024px) 33vw, 20vw"
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
                  height: isActive ? "45%" : "70%",
                  background:
                    "linear-gradient(180deg, rgba(14,13,12,0) 0%, rgba(14,13,12,0.92) 100%)",
                  transition: "height 0.4s ease",
                }}
              />

              {isActive ? (
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
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: palette.brass,
                      fontSize: 12,
                    }}
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
        })}
      </div>

      {/* Mobile: scroll-driven vertical stack */}
      <MobileAccordionStack pieces={pieces} />
    </>
  );
}

// A single piece of logic decides which ONE panel is "active" (closest to
// the vertical center of the screen), instead of each panel deciding for
// itself. That avoids two panels both thinking they're active at once,
// which was causing a feedback loop of rapid height changes ("shaking")
// as expanding one panel shifted the positions of the others underneath it.
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
        <Image
          src={piece.images[0]}
          alt={piece.title}
          fill
          sizes="100vw"
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
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.brass,
              fontSize: 12,
            }}
          >
            {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
          </div>
        )}
      </div>
    </Link>
  );
}
