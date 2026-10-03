import Link from "next/link";
import Image from "next/image";
import { getPieces } from "@/lib/piecesStore";
import { formatPrice } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Timeline — Delara Art Gallery",
};

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const pieces = await getPieces();

  const byYear = {};
  for (const p of pieces) {
    const year = p.year || "Undated";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  }

  // Oldest to newest — "Undated" pieces (no year set) go last.
  const years = Object.keys(byYear).sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return parseInt(a, 10) - parseInt(b, 10);
  });

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
          className="text-3xl mb-14"
        >
          Every piece, year by year
        </h1>

        {years.map((year) => (
          <section key={year} className="mb-16">
            <div
              className="flex items-baseline gap-4 mb-6"
              style={{ borderBottom: `1px solid rgba(184,141,87,0.2)`, paddingBottom: 12 }}
            >
              <h2
                style={{ fontFamily: "'Fraunces', serif", color: palette.brass, fontWeight: 300 }}
                className="text-4xl"
              >
                {year}
              </h2>
              <span
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
                className="text-xs uppercase"
              >
                {String(byYear[year].length).padStart(2, "0")}{" "}
                {byYear[year].length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {byYear[year].map((piece) => (
                <Link key={piece.id} href={`/piece/${piece.id}`} className="block">
                  <div
                    style={{ position: "relative", aspectRatio: "1 / 1", background: palette.wall }}
                    className="mb-2 overflow-hidden"
                  >
                    {piece.images?.[0] && (
                      <Image
                        src={piece.images[0]}
                        alt={piece.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
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
                    style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontSize: "0.95rem" }}
                    className="truncate"
                  >
                    {piece.title}
                  </div>
                  <div
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
                    className="text-xs mt-0.5"
                  >
                    {piece.sold ? "Sold" : formatPrice(piece.priceCents)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

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
