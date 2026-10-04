import Image from "next/image";
import Link from "next/link";
import { getArtist } from "@/lib/artistStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, artistJsonLd, pageMetadata, truncate } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";
import { localizeArtist } from "@/lib/localize";

export async function generateMetadata() {
  const { lang, t } = getI18n();
  const artist = localizeArtist(await getArtist(), lang);
  return pageMetadata({
    title: t.meta.artistTitle,
    description: truncate(artist?.bio?.[0]) || t.meta.artistFallback,
    path: "/artist",
    lang,
    images: artist?.photo ? [{ url: artist.photo, alt: artist.name || "Delara Ahmadi Darani" }] : undefined,
  });
}

export const dynamic = "force-dynamic";

export default async function ArtistPage() {
  const { lang, t, href } = getI18n();
  const artist = localizeArtist(await getArtist(), lang);

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />
      <JsonLd data={artistJsonLd(artist, lang)} />

      <div className="px-6 sm:px-14 pt-32 pb-14 max-w-4xl mx-auto">

        <div
          className="text-xs uppercase mb-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          {t.artist.eyebrow}
        </div>

        <div className="grid sm:grid-cols-[280px_1fr] gap-10 items-start">
          <div
            className="w-full overflow-hidden relative"
            style={{ aspectRatio: "3 / 4", background: palette.wall }}
          >
            {artist.photo && (
              <Image
                src={artist.photo}
                alt={artist.name}
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
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
              {artist.name}
            </h1>

            <div className="mt-6 flex flex-col gap-4">
              {(artist.bio || []).map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <Link
              href={href("/collections")}
              className="inline-block mt-8 text-xs uppercase px-5 py-3"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: palette.void,
                background: palette.brass,
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
            >
              {t.artist.viewCollection}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
