import { NextResponse } from "next/server";
import { getCollections, saveCollections } from "@/lib/collectionsStore";
import { getPieces, savePieces } from "@/lib/piecesStore";

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

    const name = body.name.trim().slice(0, 120);
    const collections = await getCollections();
    // Names in other scripts (e.g. only accents or Persian) can slugify to
    // nothing; fall back to a dated slug.
    const slug = slugify(name) || `collection-${Date.now()}`;
    const existing = collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (existing) {
      // The piece forms reuse an existing collection with the same name; the
      // Collections tab (unique: true) reports it instead.
      if (!body.unique) return NextResponse.json({ ok: true, collection: existing });
      return NextResponse.json({ error: `A collection called "${existing.name}" already exists.` }, { status: 409 });
    }

    const collection = {
      slug,
      name,
      nameFr: (body.nameFr || "").trim().slice(0, 120),
      description: (body.description || "").trim().slice(0, 2000),
      descriptionFr: (body.descriptionFr || "").trim().slice(0, 2000),
      date: new Date().toISOString().slice(0, 10),
    };
    collections.push(collection);
    await saveCollections(collections);
    return NextResponse.json({ ok: true, collection });
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

// Deletes a collection (?slug=…). Its pieces are kept and simply no longer
// belong to a collection (they still show on the timeline and their own pages).
export async function DELETE(request) {
  try {
    const slug = new URL(request.url).searchParams.get("slug");
    const collections = await getCollections();
    if (!slug || !collections.some((c) => c.slug === slug)) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    const pieces = await getPieces();
    const affected = pieces.filter((p) => p.collection === slug).length;
    if (affected > 0) {
      await savePieces(pieces.map((p) => (p.collection === slug ? { ...p, collection: "" } : p)));
    }
    await saveCollections(collections.filter((c) => c.slug !== slug));
    return NextResponse.json({ ok: true, piecesUnassigned: affected });
  } catch (err) {
    console.error("Delete collection error:", err);
    return NextResponse.json({ error: "Could not delete the collection." }, { status: 500 });
  }
}
