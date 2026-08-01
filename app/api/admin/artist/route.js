import { NextResponse } from "next/server";
import { saveArtist } from "@/lib/artistStore";

export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.bio || !Array.isArray(body.bio)) {
      return NextResponse.json({ error: "Missing bio." }, { status: 400 });
    }

    const artist = {
      name: body.name || "Delara Ahmadi Darani",
      photo: body.photo || "/images/delara-portrait.jpg",
      bio: body.bio,
    };

    await saveArtist(artist);
    return NextResponse.json({ ok: true, artist });
  } catch (err) {
    console.error("Update artist error:", err);
    return NextResponse.json({ error: "Could not save changes." }, { status: 500 });
  }
}
