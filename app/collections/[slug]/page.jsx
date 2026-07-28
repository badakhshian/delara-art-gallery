import { notFound } from "next/navigation";
import { getPieces } from "@/lib/piecesStore";
import { getCollection } from "@/lib/collectionsStore";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";

export async function generateMetadata({ params }) {
  const collection = await getCollection(params.slug);
  if (!collection) return {};
  return { title: `${collection.name} — Delara Art Gallery` };
}

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.slug);
  if (!collection) notFound();

  const pieces = await getPieces();
  const collectionPieces = pieces.filter((p) => p.collection === collection.slug);

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-8 py-16">
        <div
          className="text-xs uppercase mb-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: palette.brass,
            letterSpacing: "0.12em",
          }}
        >
          Collection
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
            No pieces in this collection yet.
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
