import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const MAX_BYTES = 20 * 1024 * 1024;

// "My Photo (1).JPG" -> "my-photo-1.jpg"
function safeName(name) {
  const cleaned = String(name || "photo")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
  return cleaned || "photo";
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only photo files (JPEG, PNG, WebP, GIF, HEIC) can be uploaded." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "That photo is too large (20 MB max)." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = `images/${Date.now()}-${safeName(file.name)}`;

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
