import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-8 py-6 sticky top-0 z-20"
      style={{
        background: "rgba(14,13,12,0.85)",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid rgba(184,141,87,0.15)`,
      }}
    >
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/images/logo-gold.png"
          alt="Delara Ahmadi Darani — Delara Art Gallery"
          width={220}
          height={88}
          style={{ height: 48, width: "auto" }}
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
        <Link href="/#collection" style={{ color: palette.bone }}>
          Collection
        </Link>
        //<span>Artists</span>
       // <span>Provenance</span>
      //  <span>Visit</span>
        <span>Artists</span>
        <Link href="/visit" style={{ color: palette.bone }}>
          Visit
        </Link>
      </nav>

      <a
        href="mailto:Ahmadi.delara@gmail.com"
        className="text-xs uppercase px-4 py-2"
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
    </header>
  );
}
