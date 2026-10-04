import Link from "next/link";
import Image from "next/image";
import { palette } from "@/lib/palette";
import { groupPiecesByYear, yearAnchor } from "@/lib/timeline";

// How many thumbnails each year shows before collapsing into "+N more".
const THUMBS_PER_YEAR = 3;

// Homepage preview of /timeline: a horizontal gold line with one stop per
// year (oldest first), each showing a few of that year's pieces. Scrolls
// natively left/right when the years don't fit.
export default function TimelinePanel({ pieces }) {
  const { years, byYear } = groupPiecesByYear(pieces);
  if (years.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
      <div className="flex w-max">
        {years.map((year, i) => {
          const yearPieces = byYear[year];
          const shown = yearPieces.slice(0, THUMBS_PER_YEAR);
          const extra = yearPieces.length - shown.length;
          const isLast = i === years.length - 1;

          return (
            <div key={year} className="flex-shrink-0" style={{ paddingRight: isLast ? 0 : 48 }}>
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
                  {String(yearPieces.length).padStart(2, "0")}{" "}
                  {yearPieces.length === 1 ? "piece" : "pieces"}
                </div>
              </Link>

              {/* The line runs through the full column width (including the
                  gap to the next year) so it reads as one continuous track. */}
              <div className="relative my-5" style={{ height: 9, marginRight: isLast ? 0 : -48 }}>
                <div
                  className="absolute left-0 right-0"
                  style={{ top: 4, height: 1, background: "rgba(184,141,87,0.35)" }}
                />
                <div
                  className="absolute left-0 rounded-full"
                  style={{ top: 0, width: 9, height: 9, background: palette.brass }}
                />
              </div>

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
                      style={{ width: 120, height: 150, background: palette.wall }}
                    >
                      {piece.images?.[0] && (
                        <Image
                          src={piece.images[0]}
                          alt={piece.title}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div
                      className="truncate mt-2"
                      style={{
                        width: 120,
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
                      height: 150,
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
