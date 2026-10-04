import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { groupPiecesByYear, yearAnchor } from "@/lib/timeline";

// How many thumbnails each year shows before collapsing into "+N more".
const THUMBS_PER_YEAR = 3;
const THUMB_W = 120;
const THUMB_H = 150;
// Height of the zones above and below the line. Fixed (fits a thumbnail plus
// its title) so the line sits at the same height for every year.
const ZONE_H = 190;
const COLUMN_GAP = 48;

// Homepage preview of /timeline: a horizontal gold line through the middle
// with one stop per year (oldest first). Years alternate sides — even ones
// have the year above the line and pieces below, odd ones the reverse.
// Scrolls natively left/right when the years don't fit.
export default function TimelinePanel({ pieces }) {
  const { years, byYear } = groupPiecesByYear(pieces);
  if (years.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
      <div className="flex w-max">
        {years.map((year, i) => {
          const yearPieces = byYear[year];
          const isLast = i === years.length - 1;
          const piecesAbove = i % 2 === 1;

          const label = <YearLabel year={year} count={yearPieces.length} />;
          const thumbs = <YearThumbs year={year} pieces={yearPieces} />;

          return (
            <div
              key={year}
              className="flex-shrink-0 flex flex-col"
              style={{ paddingRight: isLast ? 0 : COLUMN_GAP }}
            >
              <div className="flex flex-col justify-end" style={{ height: ZONE_H, paddingBottom: 20 }}>
                {piecesAbove ? thumbs : label}
              </div>

              {/* The line runs through the full column width (including the
                  gap to the next year) so it reads as one continuous track. */}
              <div className="relative" style={{ height: 9, marginRight: isLast ? 0 : -COLUMN_GAP }}>
                <div
                  className="absolute left-0 right-0"
                  style={{ top: 4, height: 1, background: "rgba(184,141,87,0.35)" }}
                />
                <div
                  className="absolute left-0 rounded-full"
                  style={{ top: 0, width: 9, height: 9, background: palette.brass }}
                />
              </div>

              <div className="flex flex-col justify-start" style={{ height: ZONE_H, paddingTop: 20 }}>
                {piecesAbove ? label : thumbs}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearLabel({ year, count }) {
  return (
    <Link href={`/timeline#${yearAnchor(year)}`} style={{ textDecoration: "none" }}>
      <div
        style={{ fontFamily: "'Fraunces', serif", color: palette.brass, fontWeight: 300 }}
        className="text-3xl"
      >
        {year}
      </div>
      <div
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
        className="text-xs uppercase mt-1"
      >
        {String(count).padStart(2, "0")} {count === 1 ? "piece" : "pieces"}
      </div>
    </Link>
  );
}

function YearThumbs({ year, pieces }) {
  const shown = pieces.slice(0, THUMBS_PER_YEAR);
  const extra = pieces.length - shown.length;

  return (
    <div className="flex gap-2">
      {shown.map((piece) => (
        <Link
          key={piece.id}
          href={`/piece/${piece.id}`}
          className="block"
          title={piece.title}
          style={{ textDecoration: "none" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ width: THUMB_W, height: THUMB_H, background: palette.wall }}
          >
            {piece.images?.[0] && (
              <Image
                src={piece.images[0]}
                alt={piece.title}
                fill
                sizes={`${THUMB_W}px`}
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div
            className="truncate mt-2"
            style={{
              width: THUMB_W,
              fontFamily: "'Fraunces', serif",
              color: palette.bone,
              fontSize: "0.85rem",
            }}
          >
            {piece.title}
          </div>
        </Link>
      ))}

      {extra > 0 && (
        <Link
          href={`/timeline#${yearAnchor(year)}`}
          className="flex items-center justify-center text-xs uppercase"
          style={{
            width: 72,
            height: THUMB_H,
            border: "1px solid rgba(184,141,87,0.35)",
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          +{extra}
        </Link>
      )}
    </div>
  );
}
