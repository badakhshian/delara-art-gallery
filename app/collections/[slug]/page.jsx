import { notFound } from "next/navigation";
import { getPieces } from "@/lib/piecesStore";
import { getCollection } from "@/lib/collectionsStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import { pageMetadata, pieceImages } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";
import { localizeCollection, localizePieces } from "@/lib/localize";

export async function generateMetadata({ params }) {
  const { lang, t } = getI18n();
  const collection = localizeCollection(await getCollection(params.slug), lang);
  if (!collection) return {};
  const pieces = localizePieces(await getPieces(), lang).filter((p) => p.collection === collection.slug);
  return pageMetadata({
    title: `${collection.name} — Delara Art Gallery`,
    description: t.meta.collectionDescription(collection.name, pieces.length),
    path: `/collections/${collection.slug}`,
    lang,
    images: pieces[0] ? pieceImages(pieces[0], lang).slice(0, 1) : undefined,
  });
}

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }) {
  const { lang, t } = getI18n();
  const collection = localizeCollection(await getCollection(params.slug), lang);
  if (!collection) notFound();

  const pieces = localizePieces(await getPieces(), lang);
  const collectionPieces = pieces.filter((p) => p.collection === collection.slug);

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
          {t.collections.collection}
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-3xl mb-10"
        >
          {collection.name}
        </h1>

        {collectionPieces.length === 0 ? (
          <p
            className="text-sm"
            style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
          >
            {t.collections.empty}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {collectionPieces.map((p, i) => (
              <div key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
                <ArtworkCard piece={p} tall={i === 0} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
