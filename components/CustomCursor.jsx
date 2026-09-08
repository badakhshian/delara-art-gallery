"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const pathname = usePathname();
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(e) {
      target.current = { x: e.clientX, y: e.clientY };
    }
    function onOver(e) {
      if (e.target.closest && e.target.closest("a, button")) {
        dotRef.current?.classList.add("cursor-hover");
      }
    }
    function onOut(e) {
      if (e.target.closest && e.target.closest("a, button")) {
        dotRef.current?.classList.remove("cursor-hover");
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.body.classList.add("custom-cursor-active");

    let raf;
    function animate() {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return <div ref={dotRef} className="custom-cursor-dot" />;
}
