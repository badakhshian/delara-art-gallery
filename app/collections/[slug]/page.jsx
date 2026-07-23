import { notFound } from "next/navigation";
import { pieces } from "@/lib/pieces";
import { collections, getCollection } from "@/lib/collections";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const collection = getCollection(params.slug);
  if (!collection) return {};
  return { title: `${collection.name} — Delara Art Gallery` };
}

export default function CollectionPage({ params }) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();

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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
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
