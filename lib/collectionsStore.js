import { list, put } from "@vercel/blob";
import { collections as seedCollections } from "./collections";

const COLLECTIONS_BLOB_PATH = "data/collections.json";

export async function getCollections() {
  try {
    const { blobs } = await list({ prefix: COLLECTIONS_BLOB_PATH });
    const match = blobs.find((b) => b.pathname === COLLECTIONS_BLOB_PATH);

    if (!match) {
      await saveCollections(seedCollections);
      return seedCollections;
    }

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch collections blob: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getCollections error, falling back to seed data:", err);
    return seedCollections;
  }
}

export async function saveCollections(collections) {
  await put(COLLECTIONS_BLOB_PATH, JSON.stringify(collections, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getCollection(slug) {
  const collections = await getCollections();
  return collections.find((c) => c.slug === slug) || null;
}

export async function addCollection(collection) {
  const collections = await getCollections();
  const existing = collections.find((c) => c.slug === collection.slug);
  if (existing) return existing;
  collections.push(collection);
  await saveCollections(collections);
  return collection;
}
