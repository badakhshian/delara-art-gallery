import { NextResponse } from "next/server";
import { addCollection } from "@/lib/collectionsStore";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
    }

    const collection = {
      slug: slugify(body.name),
      name: body.name.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    const saved = await addCollection(collection);
    return NextResponse.json({ ok: true, collection: saved });
  } catch (err) {
    console.error("Add collection error:", err);
    return NextResponse.json({ error: "Could not add the collection." }, { status: 500 });
  }
}
