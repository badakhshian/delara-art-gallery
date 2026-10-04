import { fingerprint } from "@/lib/textFingerprint";
import { frenchBio, frenchCollections, frenchPieces } from "@/lib/frenchContent";

// French for one field: what was entered in the admin (e.g. piece.storyFr)
// first, then the built-in translation if the English hasn't changed since
// it was made, else the English itself.
function pickFrench(english, adminFrench, builtIn) {
  if (adminFrench && adminFrench.trim()) return adminFrench;
  if (builtIn && english && fingerprint(english) === builtIn[0]) return builtIn[1];
  return english;
}

const PIECE_FIELDS = ["title", "medium", "dims", "story"];

// Returns the piece with its text fields in the requested language.
export function localizePiece(piece, lang) {
  if (!piece || lang !== "fr") return piece;
  const builtIn = frenchPieces[piece.id] || {};
  const out = { ...piece };
  for (const f of PIECE_FIELDS) out[f] = pickFrench(piece[f], piece[`${f}Fr`], builtIn[f]);
  return out;
}

export function localizePieces(pieces, lang) {
  return lang === "fr" ? pieces.map((p) => localizePiece(p, lang)) : pieces;
}

export function localizeCollection(collection, lang) {
  if (!collection || lang !== "fr") return collection;
  return {
    ...collection,
    name: pickFrench(collection.name, collection.nameFr, frenchCollections[collection.slug]),
  };
}

export function localizeCollections(collections, lang) {
  return lang === "fr" ? collections.map((c) => localizeCollection(c, lang)) : collections;
}

// Bio paragraphs are matched by content, so reordering or editing one
// paragraph only affects that paragraph.
export function localizeArtist(artist, lang) {
  if (!artist || lang !== "fr") return artist;
  if (Array.isArray(artist.bioFr) && artist.bioFr.some((p) => p && p.trim())) {
    return { ...artist, bio: artist.bioFr.filter((p) => p && p.trim()) };
  }
  const byPrint = Object.fromEntries(frenchBio);
  return { ...artist, bio: (artist.bio || []).map((p) => byPrint[fingerprint(p)] || p) };
}
