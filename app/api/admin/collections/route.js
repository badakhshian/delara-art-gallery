import { NextResponse } from "next/server";
import { addCollection, getCollections, saveCollections } from "@/lib/collectionsStore";

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
      nameFr: (body.nameFr || "").trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    const saved = await addCollection(collection);
    return NextResponse.json({ ok: true, collection: saved });
  } catch (err) {
    console.error("Add collection error:", err);
    return NextResponse.json({ error: "Could not add the collection." }, { status: 500 });
  }
}

// Saves edited English/French names and descriptions for existing collections (matched by
// slug). Slugs, dates and any collection not in the request stay as they are.
export async function PUT(request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.collections)) {
      return NextResponse.json({ error: "Missing collections." }, { status: 400 });
    }
    const edits = Object.fromEntries(body.collections.map((c) => [c.slug, c]));
    const current = await getCollections();
    const updated = current.map((c) => {
      const e = edits[c.slug];
      if (!e) return c;
      return {
        ...c,
        name: (e.name || "").trim() || c.name,
        nameFr: (e.nameFr || "").trim(),
        description: (e.description || "").trim(),
        descriptionFr: (e.descriptionFr || "").trim(),
      };
    });
    await saveCollections(updated);
    return NextResponse.json({ ok: true, collections: updated });
  } catch (err) {
    console.error("Update collections error:", err);
    return NextResponse.json({ error: "Could not save collections." }, { status: 500 });
  }
}
