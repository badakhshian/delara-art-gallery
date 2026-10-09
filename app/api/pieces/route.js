import { NextResponse } from "next/server";
import { getPieces } from "@/lib/piecesStore";
import { localizePieces } from "@/lib/localize";
import { normalizeLang } from "@/lib/i18n";

// Public, read-only list of pieces (used by the Visit page's piece picker).
// ?lang=fr returns French titles and texts. Adding, editing and deleting
// pieces happens only through the password-protected /api/admin/pieces route.
export const dynamic = "force-dynamic";

// Only what the public site shows; internal fields such as certificate
// numbers stay private.
function publicPiece(p) {
  return {
    id: p.id,
    title: p.title,
    year: p.year,
    medium: p.medium,
    dims: p.dims,
    sold: !!p.sold,
    collection: p.collection,
  };
}

export async function GET(request) {
  const lang = normalizeLang(new URL(request.url).searchParams.get("lang"));
  const pieces = localizePieces(await getPieces(), lang).map(publicPiece);
  return NextResponse.json({ pieces });
}
