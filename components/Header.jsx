"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";

const navLinkStyle = { color: palette.bone, textDecoration: "none" };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "rgba(14,13,12,0.85)",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid rgba(184,141,87,0.15)`,
      }}
    >
      <div className="flex items-center justify-between px-8 py-6">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo-gold.png"
            alt="Delara Ahmadi Darani — Delara Art Gallery"
            width={270}
            height={152}
            style={{ height: 44, width: "auto" }}
            priority
          />
        </Link>


        <nav
          className="hidden sm:flex gap-8 text-xs uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.smoke,
            letterSpacing: "0.12em",
          }}
        >
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>
          <Link href="/collections" style={navLinkStyle}>
            Collection
          </Link>
          <Link href="/artist" style={navLinkStyle}>
            Artist
          </Link>
          <Link href="/visit" style={navLinkStyle}>
            Visit
          </Link>
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
            <span style={{ display: "block", height: 1.5, background: palette.bone, width: "100%" }} />
            <span style={{ display: "block", height: 1.5, background: palette.bone, width: "100%" }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="sm:hidden flex flex-col px-8 pb-6 gap-4 text-xs uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.smoke,
            letterSpacing: "0.12em",
            borderTop: `1px solid rgba(184,141,87,0.15)`,
            paddingTop: 20,
          }}
        >
          <Link href="/" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/collections" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            Collection
          </Link>
          <Link href="/artist" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            Artist
          </Link>
          <Link href="/visit" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            Visit
          </Link>
          <a
            href="mailto:Ahmadi.delara@gmail.com"
            style={{ color: palette.void, background: palette.brass, textDecoration: "none" }}
            className="px-4 py-2 inline-block w-fit"
          >
            Inquire
          </a>
        </nav>
      )}
    </header>
  );
}
