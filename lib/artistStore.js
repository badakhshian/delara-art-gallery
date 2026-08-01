import { list, put } from "@vercel/blob";

const ARTIST_BLOB_PATH = "data/artist.json";

const SEED_ARTIST = {
  name: "Delara Ahmadi Darani",
  photo: "/images/delara-portrait.jpg",
  bio: [
    "Delara Ahmadi Darani is a mixed-media artist who builds acrylic and modelling paste into raised, textured surfaces — giving her paintings a sculptural, tactile quality rather than a flat finish. She works one piece at a time under her studio, Delara Art Gallery, treating each canvas as a unique original rather than part of a series — no editions, no prints.",
    "Her pieces explore movement and elemental themes, seen in works like Wheel of Soaring and Fragments of Silence, and each sells directly from the studio with full provenance and a certificate of authenticity.",
    "Alongside her art practice, she works professionally as a building and architecture technician in Montreal, with several years of experience in technical drafting and project coordination, and is certified in Revit BIM.",
  ],
};

export async function getArtist() {
  try {
    const { blobs } = await list({ prefix: ARTIST_BLOB_PATH });
    const match = blobs.find((b) => b.pathname === ARTIST_BLOB_PATH);

    if (!match) {
      await saveArtist(SEED_ARTIST);
      return SEED_ARTIST;
    }

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch artist blob: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getArtist error, falling back to seed data:", err);
    return SEED_ARTIST;
  }
}

export async function saveArtist(artist) {
  await put(ARTIST_BLOB_PATH, JSON.stringify(artist, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
