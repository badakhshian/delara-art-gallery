import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/pieces";
import { getPiece } from "@/lib/piecesStore";
import { splitStoryIntoChunks } from "@/lib/storySections";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyButton from "@/components/BuyButton";
import PieceQRCode from "@/components/PieceQRCode";

export async function generateMetadata({ params }) {
  const piece = await getPiece(params.id);
  if (!piece) return {};
  return {
    title: `${piece.title} — Delara Art Gallery`,
    description: piece.story,
  };
}

export const dynamic = "force-dynamic";

const ZOOM_POSITIONS = ["30% 20%", "70% 65%", "50% 90%", "20% 70%"];


export default async function PieceDetailPage({ params, searchParams }) {
  const piece = await getPiece(params.id);
  if (!piece) notFound();

  const purchaseStatus = searchParams?.purchase;

  const images = piece.images || [];
  const hero = images[0] || null;
  const remaining = images.slice(1);

  const textChunks = splitStoryIntoChunks(piece.story, 3);
  const photoBreaksNeeded = Math.max(textChunks.length - 1, 0);

  let breakPhotos = [];
  let trailingPhotos = [];

  if (remaining.length >= photoBreaksNeeded) {
    breakPhotos = remaining.slice(0, photoBreaksNeeded).map((src) => ({ src, zoom: false }));
    trailingPhotos = remaining.slice(photoBreaksNeeded).map((src) => ({ src, zoom: false }));
  } else if (remaining.length > 0) {
    breakPhotos = remaining.map((src) => ({ src, zoom: false }));
    const last = remaining[remaining.length - 1];
    while (breakPhotos.length < photoBreaksNeeded) {
      breakPhotos.push({ src: last, zoom: true });
    }
  } else if (hero) {
    for (let i = 0; i < photoBreaksNeeded; i++) {
      breakPhotos.push({ src: hero, zoom: true });
    }
  }

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div style={{ position: "relative" }}>
        {hero ? (
          <img
            src={hero}
            alt={`${piece.title} by ${piece.artist}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "60vh", background: palette.wall }} />
        )}
        <a
          href="/"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: palette.bone,
            textDecoration: "none",
            background: "rgba(14,13,12,0.45)",
            padding: "7px 12px",
            backdropFilter: "blur(3px)",
          }}
        >
          ← Back
        </a>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "60px 24px 28px",
            textAlign: "center",
            background:
              "linear-gradient(180deg, rgba(14,13,12,0) 0%, rgba(14,13,12,0.85) 100%)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: palette.brass,
              marginBottom: 10,
            }}
          >
            {piece.collection || "Delara Art Gallery"}
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              color: palette.bone,
              margin: "0 0 10px",
            }}
          >
            {piece.title}
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "rgba(232,227,216,0.75)",
              margin: 0,
            }}
          >
            {piece.medium}
            {piece.dims ? ` · ${piece.dims}` : ""}
          </p>
        </div>
      </div>

      {textChunks.map((chunk, i) => (
        <div key={i}>
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "72px 28px", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "1.35rem",
                lineHeight: 1.55,
                color: palette.bone,
                margin: 0,
              }}
            >
              {chunk}
            </p>
          </div>

          {i < breakPhotos.length && breakPhotos[i] && (
            <div style={{ width: "100%" }}>
              {breakPhotos[i].zoom ? (
                <div style={{ width: "100%", height: "62vh", minHeight: 340, overflow: "hidden" }}>
                  <img
                    src={breakPhotos[i].src}
                    alt={`${piece.title} detail`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: ZOOM_POSITIONS[i % ZOOM_POSITIONS.length],
                      transform: "scale(1.4)",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <img
                  src={breakPhotos[i].src}
                  alt={`${piece.title} detail`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </div>
          )}
        </div>
      ))}

      {trailingPhotos.map((photo, i) => (
        <img
          key={i}
          src={photo.src}
          alt={`${piece.title} view ${i + 1}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ))}

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 28px 20px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: palette.smoke,
            letterSpacing: "0.02em",
            marginBottom: 28,
          }}
        >
          <span style={{ color: palette.bone }}>{piece.artist}</span>, {piece.year} · Original, one of one
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            borderTop: `1px solid rgba(184,141,87,0.18)`,
            paddingTop: 24,
          }}
        >
          <PieceQRCode piece={piece} size={64} />
          <a
            href={`/piece/${piece.id}/certificate`}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: palette.brass,
              textDecoration: "none",
            }}
          >
            View certificate
          </a>
        </div>
      </div>

      <div style={{ height: 90 }} />

      <Footer />

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(14,13,12,0.96)",
          borderTop: `1px solid rgba(184,141,87,0.25)`,
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: palette.bone }}>
          <span
            style={{
              display: "block",
              fontSize: 9.5,
              color: palette.smoke,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 2,
            }}
          >
            Price
          </span>
          {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
        </div>
        <BuyButton piece={piece} />
      </div>
    </div>
  );
}
