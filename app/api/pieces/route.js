import { NextResponse } from "next/server";
import { getPieces } from "@/lib/piecesStore";

// Public, read-only list of pieces (used by the Visit page's piece picker).
// Adding, editing and deleting pieces happens only through the
// password-protected /api/admin/pieces route.
export const dynamic = "force-dynamic";

export async function GET() {
  const pieces = await getPieces();
  return NextResponse.json({ pieces });
}
