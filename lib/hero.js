// Slides for the homepage hero slideshow: every photo ticked "Hero" in the
// admin (piece.heroImages), in piece order. If nothing is ticked anywhere,
// falls back to each piece's first photo, as before.
export function heroSlides(pieces) {
  const ticked = pieces.flatMap((piece) =>
    (piece.heroImages || [])
      .filter((image) => (piece.images || []).includes(image))
      .map((image) => ({ piece, image }))
  );
  if (ticked.length > 0) return ticked;
  return pieces.map((piece) => ({ piece, image: piece.images?.[0] || null }));
}

// The photo that represents a piece on the homepage ("Currently on the
// wall"): its first photo ticked "Hero" in the admin, else its first photo.
export function featuredImage(piece) {
  const images = piece.images || [];
  return (piece.heroImages || []).find((img) => images.includes(img)) || images[0] || null;
}
