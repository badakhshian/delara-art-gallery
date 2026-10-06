import { getPieces } from "@/lib/piecesStore";
import { getCollections } from "@/lib/collectionsStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionShowcase from "@/components/CollectionShowcase";
import BackButton from "@/components/BackButton";
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

const VARIANTS = ["arch", "curve", "circle"];

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

      <div className="relative px-8 pt-40 pb-4">
        <BackButton to="/" />
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

      {/* Collections that have pieces, rotating Arch, Curve and Circle styles. */}
      {orderedCollections
        .map((collection) => ({
          collection,
          pieces: pieces.filter((p) => p.collection === collection.slug),
        }))
        .filter((c) => c.pieces.length > 0)
        .map(({ collection, pieces: collectionPieces }, i) => (
          <CollectionShowcase
            key={collection.slug}
            collection={collection}
            pieces={collectionPieces}
            number={i + 1}
            variant={VARIANTS[i % VARIANTS.length]}
          />
        ))}

      <div className="h-16" />

      <Footer />
    </div>
  );
}
