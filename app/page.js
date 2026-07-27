import Link from "next/link";
import { getPieces } from "@/lib/piecesStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pieces = await getPieces();

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <HeroCarousel pieces={pieces} intervalSeconds={6} />

      <section className="px-8 pb-4 pt-16" id="collection">
        <div
          className="flex items-baseline justify-between mb-6"
          style={{ borderBottom: `1px solid rgba(184,141,87,0.15)`, paddingBottom: 12 }}
        >
          <h2 style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }} className="text-xl">
            Currently on the wall
          </h2>
          <span
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
            className="text-xs uppercase"
          >
            {String(pieces.length).padStart(2, "0")} works
          </span>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-6" style={{ scrollbarWidth: "thin" }}>
          {pieces.map((p, i) => (
            <div key={p.id} style={{ minWidth: 260, maxWidth: 260 }}>
              <ArtworkCard piece={p} tall={i % 2 === 0} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="px-8 py-16 flex flex-col sm:flex-row gap-10 items-start sm:items-center justify-between"
        style={{
          background: palette.wall,
          borderTop: `1px solid rgba(184,141,87,0.15)`,
          borderBottom: `1px solid rgba(184,141,87,0.15)`,
        }}
      >
        <p
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-2xl max-w-md leading-snug"
        >
          Every piece ships with its provenance, condition report, and a certificate
          of authenticity.
        </p>
        <div
          className="flex gap-10 text-xs uppercase"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke, letterSpacing: "0.1em" }}
        >
          <div>
            <div style={{ color: palette.brass }} className="text-base normal-case font-normal mb-1">
              14 day
            </div>
            return window
          </div>
          <div>
            <div style={{ color: palette.brass }} className="text-base normal-case font-normal mb-1">
              1 of 1
            </div>
            no editions, no prints
          </div>
        </div>
      </section>

      <section className="px-8 py-16 flex flex-col items-center text-center">
        <h2
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-2xl mb-4"
        >
          Explore the collections
        </h2>
        <p
          className="text-sm max-w-md mb-8"
          style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
        >
          Every body of work, browsed one collection at a time.
        </p>
        <Link
          href="/collections"
          className="text-xs uppercase px-6 py-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.void,
            background: palette.brass,
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          View collections
        </Link>
      </section>

      <Footer />
    </div>
  );
}
