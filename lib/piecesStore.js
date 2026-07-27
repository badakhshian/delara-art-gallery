import { list, put } from "@vercel/blob";
import { pieces as seedPieces } from "./pieces";

const PIECES_BLOB_PATH = "data/pieces.json";

export async function getPieces() {
  try {
    const { blobs } = await list({ prefix: PIECES_BLOB_PATH });
    const match = blobs.find((b) => b.pathname === PIECES_BLOB_PATH);

    if (!match) {
      await savePieces(seedPieces);
      return seedPieces;
    }

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch pieces blob: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getPieces error, falling back to seed data:", err);
    return seedPieces;
  }
}

export async function savePieces(pieces) {
  await put(PIECES_BLOB_PATH, JSON.stringify(pieces, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getPiece(id) {
  const pieces = await getPieces();
  return pieces.find((p) => p.id === id) || null;
}

export async function addPiece(piece) {
  const pieces = await getPieces();
  pieces.push(piece);
  await savePieces(pieces);
  return piece;
}

export async function deletePiece(id) {
  const pieces = await getPieces();
  const filtered = pieces.filter((p) => p.id !== id);
  await savePieces(filtered);
  return filtered;
}
