import Link from "next/link";
import { getPieces } from "@/lib/piecesStore";
import { sortedCollections } from "@/lib/collections";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionBanner from "@/components/CollectionBanner";

export const metadata = {
  title: "Collections — Delara Art Gallery",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const orderedCollections = sortedCollections();
  const pieces = await getPieces();

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-8 pt-14 pb-4">
        <div
          className="text-xs uppercase mb-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          Collections
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-3xl"
        >
          Every body of work, one at a time
        </h1>
      </div>

      {orderedCollections.map((collection) => {
        const collectionPieces = pieces.filter((p) => p.collection === collection.slug);
        if (collectionPieces.length === 0) return null;

        return (
          <section key={collection.slug} className="pt-10">
            <div className="px-8 flex items-baseline justify-between mb-4">
              <h2
                style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }}
                className="text-xl"
              >
                {collection.name}
              </h2>
              <Link
                href={`/collections/${collection.slug}`}
                className="text-xs uppercase"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: palette.brass,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                View full collection →
              </Link>
            </div>

            <CollectionBanner pieces={collectionPieces} intervalSeconds={5} />
          </section>
        );
      })}

      <div className="h-16" />

      <Footer />
    </div>
  );
}
