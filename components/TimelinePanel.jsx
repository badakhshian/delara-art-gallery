import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { groupPiecesByYear, yearAnchor } from "@/lib/timeline";
import HorizontalScroller from "@/components/HorizontalScroller";
import { getI18n } from "@/lib/serverLang";

// How many thumbnails each year shows before collapsing into "+N more".
const THUMBS_PER_YEAR = 3;
const THUMB_W = 120;
const THUMB_H = 150;
// Height of the zones above and below the line. Fixed (fits a thumbnail plus
// its title) so the line sits at the same height for every year.
const ZONE_H = 190;
const COLUMN_GAP = 48;

// Homepage preview of /timeline, one stop per year (oldest first), with years
// alternating sides of a gold line:
// - Desktop / tablet (sm+): horizontal line through the middle — even years
//   have the year above and pieces below, odd ones the reverse. Scrolls by
//   arrow buttons, mouse drag, trackpad or touch swipe.
// - Mobile (<sm): vertical line down the centre — even years have the year
//   on the left and pieces on the right, odd ones the reverse.
export default function TimelinePanel({ pieces }) {
  const { years, byYear } = groupPiecesByYear(pieces);
  if (years.length === 0) return null;

  return (
    <>
      <div className="hidden sm:block">
        <HorizontalTimeline years={years} byYear={byYear} />
      </div>
      <div className="sm:hidden">
        <VerticalTimeline years={years} byYear={byYear} />
      </div>
    </>
  );
}

function HorizontalTimeline({ years, byYear }) {
  return (
    <HorizontalScroller arrowTop={ZONE_H + 4}>
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
    </HorizontalScroller>
  );
}

function VerticalTimeline({ years, byYear }) {
  return (
    <div className="relative">
      <div
        className="absolute top-0 bottom-0"
        style={{ left: "50%", width: 1, background: "rgba(184,141,87,0.35)" }}
      />
      {years.map((year, i) => {
        const yearPieces = byYear[year];
        const piecesLeft = i % 2 === 1;
        const label = (
          <div className={piecesLeft ? "text-left" : "text-right"}>
            <YearLabel year={year} count={yearPieces.length} />
          </div>
        );
        const thumbs = <MobileThumbs year={year} pieces={yearPieces} towardLine={piecesLeft ? "right" : "left"} />;

        return (
          <div key={year} className="relative grid grid-cols-2 pb-10">
            <div
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: 12,
                width: 9,
                height: 9,
                transform: "translateX(-50%)",
                background: palette.brass,
              }}
            />
            <div style={{ paddingRight: 20 }}>{piecesLeft ? thumbs : label}</div>
            <div style={{ paddingLeft: 20 }}>{piecesLeft ? label : thumbs}</div>
          </div>
        );
      })}
    </div>
  );
}

function MobileThumbs({ year, pieces, towardLine }) {
  const { t, href } = getI18n();
  const shown = pieces.slice(0, THUMBS_PER_YEAR);
  const extra = pieces.length - shown.length;

  // On the left of the line, fill the grid right-to-left so the first piece
  // sits next to the line rather than at the screen edge.
  return (
    <div className="grid grid-cols-2 gap-2" dir={towardLine === "right" ? "rtl" : "ltr"}>
      {shown.map((piece) => (
        <Link
          key={piece.id}
          href={href(`/piece/${piece.id}`)}
          dir="ltr"
          className="block min-w-0"
          style={{ textDecoration: "none" }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            {piece.images?.[0] && (
              <Image src={piece.images[0]} alt={piece.title} fill sizes="25vw" className="soft-edges" style={{ objectFit: "cover" }} />
            )}
          </div>
          <div
            className="truncate mt-1"
            style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontSize: "0.7rem" }}
          >
            {piece.title}
          </div>
        </Link>
      ))}

      {extra > 0 && (
        <Link
          href={href(`/timeline#${yearAnchor(year)}`)}
          dir="ltr"
          className="flex items-center justify-center text-xs uppercase"
          style={{
            aspectRatio: "4 / 5",
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

function YearLabel({ year, count }) {
  const { t, href } = getI18n();
  return (
    <Link href={href(`/timeline#${yearAnchor(year)}`)} style={{ textDecoration: "none" }}>
      <div
        style={{ fontFamily: "'Fraunces', serif", color: palette.brass, fontWeight: 300 }}
        className="text-3xl"
      >
        {year === "Undated" ? t.timeline.undated : year}
      </div>
      <div
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
        className="text-xs uppercase mt-1"
      >
        {t.pieces(count)}
      </div>
    </Link>
  );
}

function YearThumbs({ year, pieces }) {
  const { t, href } = getI18n();
  const shown = pieces.slice(0, THUMBS_PER_YEAR);
  const extra = pieces.length - shown.length;

  return (
    <div className="flex gap-2">
      {shown.map((piece) => (
        <Link
          key={piece.id}
          href={href(`/piece/${piece.id}`)}
          className="block"
          title={piece.title}
          style={{ textDecoration: "none" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ width: THUMB_W, height: THUMB_H }}
          >
            {piece.images?.[0] && (
              <Image
                src={piece.images[0]}
                alt={piece.title}
                fill
                sizes={`${THUMB_W}px`}
                className="soft-edges"
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
          href={href(`/timeline#${yearAnchor(year)}`)}
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
