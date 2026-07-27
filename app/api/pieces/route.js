import { NextResponse } from "next/server";
import { getPieces } from "@/lib/piecesStore";

export async function GET() {
  const pieces = await getPieces();
  const minimal = pieces.map((p) => ({ id: p.id, title: p.title }));
  return NextResponse.json({ pieces: minimal });
}
