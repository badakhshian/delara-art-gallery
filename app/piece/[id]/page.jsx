import { notFound } from "next/navigation";
import Link from "next/link";
import { pieces, getPiece, formatPrice } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DetailGallery from "@/components/DetailGallery";
import BuyButton from "@/components/BuyButton";
import PieceQRCode from "@/components/PieceQRCode";

export function generateStaticParams() {
  return pieces.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const piece = getPiece(params.id);
  if (!piece) return {};
  return {
    title: `${piece.title} — Delara Art Gallery`,
    description: piece.story,
  };
}

export default function PieceDetailPage({ params }) {
  const piece = getPiece(params.id);
  if (!piece) notFound();

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-6 sm:px-14 py-10 max-w-5xl mx-auto">
        <a
          href="/"
          className="mb-8 text-xs uppercase inline-flex items-center gap-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.smoke,
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          ← Back to collection
        </a>

        <div className="grid sm:grid-cols-2 gap-10">
          <DetailGallery piece={piece} />

          {/* Info column */}
          <div className="flex flex-col">
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                color: palette.bone,
                fontWeight: 300,
                fontSize: "2rem",
                lineHeight: 1.15,
              }}
            >
              {piece.title}
            </h1>
            <div
              className="mt-2 text-sm"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass }}
            >
              {piece.artist}, {piece.year}
            </div>
            <div
              className="mt-1 text-sm"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
            >
              {piece.medium} · {piece.dims}
            </div>
            <div
              className="mt-4 text-lg"
              style={{ fontFamily: "'Fraunces', serif", color: palette.bone }}
            >
              {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
            </div>

            <div className="mt-8 pt-8" style={{ borderTop: `1px solid rgba(184,141,87,0.15)` }}>
              <h2
                className="text-xs uppercase mb-3"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: palette.smoke,
                  letterSpacing: "0.12em",
                }}
              >
                The story
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
              >
                {piece.story}
              </p>
            </div>

            <div className="mt-8 pt-8" style={{ borderTop: `1px solid rgba(184,141,87,0.15)` }}>
              <h2
                className="text-xs uppercase mb-4"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: palette.smoke,
                  letterSpacing: "0.12em",
                }}
              >
                Certificate of authenticity
              </h2>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <PieceQRCode piece={piece} />
                <Link
                  href={`/piece/${piece.id}/certificate`}
                  className="text-xs uppercase px-4 py-2 whitespace-nowrap"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: palette.bone,
                    border: `1px solid rgba(184,141,87,0.4)`,
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                >
                  View certificate
                </Link>
              </div>
            </div>

            <BuyButton piece={piece} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
