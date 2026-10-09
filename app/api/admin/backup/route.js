import { getPieces } from "@/lib/piecesStore";
import { getCollections } from "@/lib/collectionsStore";
import { getArtist } from "@/lib/artistStore";

// Admin-only (see middleware): downloads everything entered in the admin —
// pieces, collections and the artist page — as one JSON file. Photos stay
// on Vercel Blob; the file lists their addresses.
export const dynamic = "force-dynamic";

export async function GET() {
  const [pieces, collections, artist] = await Promise.all([getPieces(), getCollections(), getArtist()]);
  const exportedAt = new Date().toISOString();
  const body = JSON.stringify({ exportedAt, pieces, collections, artist }, null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="artedelara-backup-${exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
