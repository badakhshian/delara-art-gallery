import Link from "next/link";
import Image from "next/image";
import { getPieces } from "@/lib/piecesStore";
import { formatPrice } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import { groupPiecesByYear, yearAnchor } from "@/lib/timeline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Timeline — Delara Art Gallery",
};

export const dynamic = "force-dynamic";

const EXCERPT_MAX = 140;

// First sentence of the story, trimmed to EXCERPT_MAX characters.
function storyExcerpt(story) {
  if (!story) return "";
  const first = story.split(/(?<=[.!?])\s+/)[0].trim();
  if (first.length <= EXCERPT_MAX) return first;
  return first.slice(0, EXCERPT_MAX).replace(/\s+\S*$/, "") + "…";
}

// Distinct media used in a year, in the order they first appear.
function yearMedia(pieces) {
  return [...new Set(pieces.map((p) => p.medium).filter(Boolean))];
}

// Same layout family as the homepage timeline panel on mobile: a vertical
// gold line down the centre, years alternating sides — even years have the
// year on the left and pieces on the right, odd years the reverse. Every
// piece is listed with its medium, size, a story excerpt and price.
// Pieces per row within each half: 1 on mobile and tablet, 2 on desktop.
export default async function TimelinePage() {
  const pieces = await getPieces();
  const { years, byYear } = groupPiecesByYear(pieces);
  const datedYears = years.filter((y) => y !== "Undated");

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-8 pt-32 pb-16">
        <div
          className="text-xs uppercase mb-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          Timeline
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-3xl mb-4"
        >
          Every piece, year by year
        </h1>
        {pieces.length > 0 && (
          <p
            className="text-sm max-w-xl mb-14 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
          >
            {pieces.length} {pieces.length === 1 ? "work" : "works"}
            {datedYears.length > 1 &&
              ` across ${datedYears.length} years, from ${datedYears[0]} to ${datedYears[datedYears.length - 1]}`}
            . Follow the line to see how the work has moved through materials and ideas — select
            any piece for its full story.
          </p>
        )}

        {years.length > 0 && (
          <div className="relative">
            <div
              className="absolute top-0 bottom-0"
              style={{ left: "50%", width: 1, background: "rgba(184,141,87,0.35)" }}
            />

            {years.map((year, i) => {
              const yearPieces = byYear[year];
              const piecesLeft = i % 2 === 1;
              const label = (
                <YearLabel year={year} pieces={yearPieces} align={piecesLeft ? "left" : "right"} />
              );
              const cards = <PieceCards pieces={yearPieces} />;

              return (
                <section
                  key={year}
                  id={yearAnchor(year)}
                  className="relative grid grid-cols-2 pb-16 scroll-mt-32"
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      left: "50%",
                      top: 14,
                      width: 11,
                      height: 11,
                      transform: "translateX(-50%)",
                      background: palette.brass,
                    }}
                  />
                  <div className="pr-5 sm:pr-8 lg:pr-12">{piecesLeft ? cards : label}</div>
                  <div className="pl-5 sm:pl-8 lg:pl-12">{piecesLeft ? label : cards}</div>
                </section>
              );
            })}
          </div>
        )}

        {years.length === 0 && (
          <p
            style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
            className="text-sm"
          >
            No pieces yet.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

function YearLabel({ year, pieces, align }) {
  const media = yearMedia(pieces);
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <h2
        style={{ fontFamily: "'Fraunces', serif", color: palette.brass, fontWeight: 300 }}
        className="text-4xl sm:text-5xl leading-none"
      >
        {year}
      </h2>
      <div
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke, letterSpacing: "0.08em" }}
        className="text-xs uppercase mt-2"
      >
        {String(pieces.length).padStart(2, "0")} {pieces.length === 1 ? "piece" : "pieces"}
      </div>
      {media.length > 0 && (
        <p
          style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
          className="text-xs sm:text-sm mt-3 leading-relaxed"
        >
          {media.join(" · ")}
        </p>
      )}
    </div>
  );
}

function PieceCards({ pieces }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">
      {pieces.map((piece) => (
        <Link
          key={piece.id}
          href={`/piece/${piece.id}`}
          className="block min-w-0"
          style={{ textDecoration: "none" }}
        >
          <div
            className="relative overflow-hidden mb-3"
            style={{ aspectRatio: "4 / 5", background: palette.wall }}
          >
            {piece.images?.[0] && (
              <Image
                src={piece.images[0]}
                alt={piece.title}
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                style={{ objectFit: "cover" }}
              />
            )}
            {piece.sold && (
              <div
                className="absolute top-2 right-2 px-2 py-1 text-[9px] uppercase"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  background: "rgba(14,13,12,0.85)",
                  color: palette.bone,
                  letterSpacing: "0.1em",
                }}
              >
                Sold
              </div>
            )}
          </div>

          <div
            style={{ fontFamily: "'Fraunces', serif", color: palette.bone }}
            className="text-sm sm:text-base leading-snug"
          >
            {piece.title}
          </div>

          {(piece.medium || piece.dims) && (
            <div
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
              className="text-[10px] sm:text-[11px] mt-1 leading-relaxed"
            >
              {[piece.medium, piece.dims].filter(Boolean).join(" · ")}
            </div>
          )}

          {piece.story && (
            <p
              style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
              className="text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none"
            >
              {storyExcerpt(piece.story)}
            </p>
          )}

          <div
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass }}
            className="text-xs mt-2"
          >
            {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
          </div>
        </Link>
      ))}
    </div>
  );
}
