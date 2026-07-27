import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = `images/${Date.now()}-${file.name}`;

    const blob = await put(filename, Buffer.from(arrayBuffer), {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Could not upload the photo." }, { status: 500 });
  }
}
