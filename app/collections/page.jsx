import { getPieces } from "@/lib/piecesStore";
import { getCollections } from "@/lib/collectionsStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionPoster from "@/components/CollectionPoster";
import { pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";
import { localizeCollections, localizePieces } from "@/lib/localize";

export function generateMetadata() {
  const { lang, t } = getI18n();
  return pageMetadata({
    title: t.meta.collectionsTitle,
    description: t.meta.collectionsDescription,
    path: "/collections",
    lang,
  });
}

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const { lang, t } = getI18n();
  const collectionsList = localizeCollections(await getCollections(), lang);
  const orderedCollections = [...collectionsList].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const pieces = localizePieces(await getPieces(), lang);

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-8 pt-32 pb-4">
        <div
          className="text-xs uppercase mb-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          {t.collections.eyebrow}
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-3xl"
        >
          {t.collections.title}
        </h1>
      </div>

      {orderedCollections.map((collection) => {
        const collectionPieces = pieces.filter((p) => p.collection === collection.slug);
        if (collectionPieces.length === 0) return null;

        return (
          <section key={collection.slug} className="px-4 sm:px-8 pt-10">
            <CollectionPoster collection={collection} pieces={collectionPieces} />
          </section>
        );
      })}

      <div className="h-16" />

      <Footer />
    </div>
  );
}
