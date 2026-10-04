"use client";

import { useEffect, useRef, useState } from "react";
import { palette } from "@/lib/palette";

// Horizontal scroll strip that also works with a plain mouse: prev/next
// arrow buttons (shown only when there's more to scroll that way) and
// click-and-drag. Touch swipes and trackpad swipes use native scrolling.
// `arrowTop` positions the arrows' centre (px from the top of the strip).
export default function HorizontalScroller({ children, arrowTop = "50%" }) {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      const max = el.scrollWidth - el.clientWidth;
      setCanLeft(el.scrollLeft > 1);
      setCanRight(el.scrollLeft < max - 1);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollByPage(direction) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  function onPointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragRef.current = { x: e.clientX, scrollLeft: ref.current.scrollLeft };
    draggedRef.current = false;
  }

  function onPointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!draggedRef.current && Math.abs(dx) < 5) return;
    draggedRef.current = true;
    ref.current.scrollLeft = drag.scrollLeft - dx;
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  // A drag ends with a click on whatever link is under the mouse — swallow it
  // so dragging doesn't navigate.
  function onClickCapture(e) {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="overflow-x-auto pb-4"
        style={{ scrollbarWidth: "thin", cursor: canLeft || canRight ? "grab" : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>

      {canLeft && <ArrowButton direction={-1} top={arrowTop} onClick={() => scrollByPage(-1)} />}
      {canRight && <ArrowButton direction={1} top={arrowTop} onClick={() => scrollByPage(1)} />}
    </div>
  );
}

function ArrowButton({ direction, top, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction < 0 ? "Scroll back" : "Scroll forward"}
      className="absolute flex items-center justify-center rounded-full"
      style={{
        top,
        [direction < 0 ? "left" : "right"]: 0,
        transform: "translateY(-50%)",
        width: 40,
        height: 40,
        background: "rgba(14,13,12,0.85)",
        border: `1px solid ${palette.brass}`,
        color: palette.brass,
        fontSize: 18,
        lineHeight: 1,
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      {direction < 0 ? "‹" : "›"}
    </button>
  );
}
