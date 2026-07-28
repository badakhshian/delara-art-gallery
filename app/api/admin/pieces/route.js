import { NextResponse } from "next/server";
import { addPiece, deletePiece, updatePiece } from "@/lib/piecesStore";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.id || !body.title) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const piece = {
      id: body.id,
      title: body.title,
      artist: body.artist || "Delara Ahmadi Darani",
      year: body.year || "",
      medium: body.medium || "",
      dims: body.dims || "",
      priceCents: body.priceCents ?? null,
      images: body.images || [],
      story: body.story || "",
      sold: false,
      isHero: false,
      certificateId: body.certificateId || "",
      collection: body.collection || "",
    };

    await addPiece(piece);
    return NextResponse.json({ ok: true, piece });
  } catch (err) {
    console.error("Add piece error:", err);
    return NextResponse.json({ error: "Could not add the piece." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing piece id." }, { status: 400 });
    }
    await deletePiece(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete piece error:", err);
    return NextResponse.json({ error: "Could not delete the piece." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing piece id." }, { status: 400 });
    }

    const { id, ...updates } = body;
    const updated = await updatePiece(id, updates);

    if (!updated) {
      return NextResponse.json({ error: "Piece not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, piece: updated });
  } catch (err) {
    console.error("Update piece error:", err);
    return NextResponse.json({ error: "Could not update the piece." }, { status: 500 });
  }
}
