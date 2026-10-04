"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collection" },
  { href: "/artist", label: "Artist" },
  { href: "/timeline", label: "Timeline" },
  { href: "/visit", label: "Visit" },
];

const navStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  letterSpacing: "0.12em",
  fontWeight: 600,
  textShadow: "0 1px 2px rgba(14,13,12,0.85), 0 0 12px rgba(14,13,12,0.6)",
};

const navLinkStyle = { color: palette.brass, textDecoration: "none" };

// Floats transparently over the page with a soft fade behind it for
// legibility. On pages with a full-bleed hero (marked with `data-hero`), the
// whole header slides away once you've scrolled past the hero's bottom edge
// and slides back when you scroll back into it.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const hero = document.querySelector("[data-hero]");
      const header = headerRef.current;
      if (!hero || !header) {
        setPastHero(false);
        return;
      }
      setPastHero(hero.getBoundingClientRect().bottom <= header.offsetHeight);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const hidden = pastHero && !menuOpen;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-20"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : undefined,
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1), opacity 0.45s ease",
      }}
    >
      {/* Soft fade behind the header — extends a little below it so there's
          no hard edge against the artwork. */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          bottom: -48,
          // Stronger while the phone menu is open, since it runs down over
          // the artwork.
          background: menuOpen
            ? "linear-gradient(180deg, rgba(14,13,12,0.8) 0%, rgba(14,13,12,0.6) 70%, rgba(14,13,12,0) 100%)"
            : "linear-gradient(180deg, rgba(14,13,12,0.55) 0%, rgba(14,13,12,0.3) 55%, rgba(14,13,12,0) 100%)",
        }}
      />

      <div className="relative flex items-center justify-between px-8 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image
            src="/images/logo-gold.png"
            alt="Delara Ahmadi Darani — Delara Art Gallery"
            width={270}
            height={152}
            style={{ height: 60, width: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden sm:flex gap-6 lg:gap-8 text-[13px] uppercase" style={navStyle}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={navLinkStyle} className="hover:opacity-75">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="mailto:Ahmadi.delara@gmail.com"
            className="hidden sm:inline-block text-xs uppercase px-4 py-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
              letterSpacing: "0.1em",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Inquire
          </a>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            className="sm:hidden flex flex-col justify-center gap-1.5"
            style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ display: "block", height: 2, background: palette.brass, width: "100%" }} />
            <span style={{ display: "block", height: 2, background: palette.brass, width: "100%" }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="relative sm:hidden flex flex-col px-8 pb-6 gap-5 text-sm uppercase"
          style={{
            ...navStyle,
            borderTop: `1px solid rgba(184,141,87,0.25)`,
            paddingTop: 20,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={navLinkStyle} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}

          <a
            href="mailto:Ahmadi.delara@gmail.com"
            style={{ color: palette.void, background: palette.brass, textDecoration: "none", textShadow: "none" }}
            className="px-4 py-2 inline-block w-fit"
          >
            Inquire
          </a>
        </nav>
      )}
    </header>
  );
}
