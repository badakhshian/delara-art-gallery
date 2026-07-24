import Link from "next/link";
import { pieces } from "@/lib/pieces";
import { sortedCollections } from "@/lib/collections";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import HeroCarousel from "@/components/HeroCarousel";

export default function HomePage() {
  const orderedCollections = sortedCollections();

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      {/* Hero — rotates through the whole collection: photo, title, and
          wall label all change together every few seconds */}
      <HeroCarousel pieces={pieces} intervalSeconds={6} />

      {/* Current exhibition — horizontal strip */}
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

      {/* Statement strip */}
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
              White glove
            </div>
            delivery  
          </div>
          <div>
            <div style={{ color: palette.brass }} className="text-base normal-case font-normal mb-1">
              1 of 1
            </div>
            no editions, no prints
          </div>
        </div>
      </section>

      {/* One section per collection, most recent collection date first.
          Each shows up to its first 4 pieces, with a link through to the
          full collection page. */}
      {orderedCollections.map((collection) => {
        const collectionPieces = pieces
          .filter((p) => p.collection === collection.slug)
          .slice(0, 4);

        if (collectionPieces.length === 0) return null;

        return (
          <section key={collection.slug} className="px-8 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2
                style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }}
                className="text-xl"
              >
                {collection.name}
              </h2>
              <Link
                href={`/collections/${collection.slug}`}
                className="text-xs uppercase"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: palette.brass,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                View full collection →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
              {collectionPieces.map((p, i) => (
                <div key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
                  <ArtworkCard piece={p} tall={i === 0} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <Footer />
    </div>
  );
}
