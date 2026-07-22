//import Image from "next/image";
//import Link from "next/link";
import Link from "next/link";
import { pieces } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import WallLabel from "@/components/WallLabel";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function HomePage() {
  const hero = pieces.find((p) => p.isHero) || pieces[0];

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      {/* Hero — full-bleed spotlit piece, text overlaid */}
      <Link href={`/piece/${hero.id}`}>
        <section className="relative w-full cursor-pointer" style={{ height: "92vh", minHeight: 640 }}>
          <div className="absolute inset-0 overflow-hidden" style={{ background: palette.wall }}>
            /*{hero.images?.[0] && (
              <Image
                src={hero.images[0]}
                alt={`${hero.title} by ${hero.artist}`}
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            )}*/
              <HeroSlideshow
              images={hero.images}
              alt={`${hero.title} by ${hero.artist}`}
              intervalSeconds={5}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(14,13,12,0.05) 0%, rgba(14,13,12,0) 35%, rgba(14,13,12,0.15) 60%, rgba(14,13,12,0.9) 100%)",
              }}
            />
          </div>

          <div className="absolute left-0 right-0 bottom-0 px-8 sm:px-14 pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-xl">
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: palette.bone,
                  fontWeight: 300,
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  lineHeight: 1.05,
                }}
              >
                {hero.title}
              </h1>
              <p
                className="mt-4 text-sm max-w-md"
                style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
              >
                Original mixed-media works by Delara Ahmadi Darani — acrylic and
                modelling paste built up into raised, textured surfaces. Available
                directly from the studio, one piece at a time.
              </p>
            </div>
            <div
              className="px-5 py-4"
              style={{ background: "rgba(14,13,12,0.55)", backdropFilter: "blur(4px)" }}
            >
              <WallLabel piece={hero} dark />
            </div>
          </div>
        </section>
      </Link>

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
            delivery over $1,000
          </div>
          <div>
            <div style={{ color: palette.brass }} className="text-base normal-case font-normal mb-1">
              1 of 1
            </div>
            no editions, no prints
          </div>
        </div>
      </section>

      {/* Grid — asymmetric gallery wall */}
      <section className="px-8 py-16">
        <h2 style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }} className="text-xl mb-8">
          Full collection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
          {pieces.map((p, i) => (
            <div key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
              <ArtworkCard piece={p} tall={i === 0} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
