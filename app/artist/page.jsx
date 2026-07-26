import Image from "next/image";
import Link from "next/link";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The Artist — Delara Art Gallery",
};

export default function ArtistPage() {
  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-6 sm:px-14 py-14 max-w-4xl mx-auto">
        <div
          className="text-xs uppercase mb-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          The Artist
        </div>

        <div className="grid sm:grid-cols-[280px_1fr] gap-10 items-start">
          <div
            className="w-full overflow-hidden relative"
            style={{ aspectRatio: "3 / 4", background: palette.wall }}
          >
            <Image
              src="/images/delara-portrait.jpeg"
              alt="Delara Ahmadi Darani"
              fill
              sizes="(max-width: 640px) 100vw, 280px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                color: palette.bone,
                fontWeight: 300,
                fontSize: "2rem",
                lineHeight: 1.15,
              }}
            >
              Delara Ahmadi Darani
            </h1>

            <div className="mt-6 flex flex-col gap-4">
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
              >
                Delara Ahmadi Darani is a mixed-media artist who builds acrylic
                and modelling paste into raised, textured surfaces — giving her
                paintings a sculptural, tactile quality rather than a flat
                finish. She works one piece at a time under her studio, Delara
                Art Gallery, treating each canvas as a unique original rather
                than part of a series — no editions, no prints.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
              >
                Her pieces explore movement and elemental themes, seen in
                works like Wheel of Soaring and Fragments of Silence, and each
                sells directly from the studio with full provenance and a
                certificate of authenticity.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
              >
                Alongside her art practice, she works professionally as a
                building and architecture technician in Montreal, with several
                years of experience in technical drafting and project
                coordination, and is certified in Revit BIM.
              </p>
            </div>

            <Link
              href="/#collection"
              className="inline-block mt-8 text-xs uppercase px-5 py-3"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: palette.void,
                background: palette.brass,
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
            >
              View the collection
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
