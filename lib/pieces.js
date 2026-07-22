// Every piece for sale lives here. Each one is one-of-a-kind, so `sold`
// should flip to true the moment it's purchased (see the note in
// app/api/webhook/route.js about wiring this to a real database).
//
// priceCents: the amount Stripe will charge, in cents. Set to null while a
// piece is "inquire only" — the detail page will show a contact button
// instead of a buy button until you add a price.
//
// certificateId: shown on the printable Certificate of Authenticity and
// encoded in the QR code. Keep these unique — "ADG-0001" style is just a
// suggestion, use whatever numbering system you like.

export const pieces = [
  {
    id: "rueda-de-la-vida",
    title: "Rueda de la Vida",
    artist: "Delara Ahmadi Darani",
    year: "2026",
    medium: "Acrylic and modelling paste on canvas",
    dims: "48 × 48 in",
    priceCents: null, // e.g. 420000 for $4,200.00
    images: ["/images/IMG_6720.jpeg"], //rueda-de-la-vida.jpg
    story:
      "An abstract exploration of the many layers of life, where every color, texture, and carefully crafted detail represents a moment, an emotion, or a memory. Through a rich interplay of movement and form, the composition reflects the constant balance between chaos and harmony, fragility and resilience, stillness and transformation.\n\nEach layer invites the viewer to look beyond the surface, revealing new relationships and hidden narratives with every glance. The imperfections are embraced rather than concealed, becoming essential elements that speak to growth, renewal, and the authenticity of the human experience. Light and color weave together to evoke hope, curiosity, and the quiet beauty found in change.",
    sold: false,
    isHero: true,
    certificateId: "ADG-0001",
  },
  {
    id: "evocacion-venecia",
    title: "Evocación de Venecia — Santa María della Salute",
    artist: "Delara Ahmadi Darani",
    year: "2026",
    medium: "Acrylic and modelling paste on canvas",
    dims: "Dimensions on request",
    priceCents: null,
    images: ["/images/evocacion-venecia.jpg"],
    story:
      "Part of the Evocaciones series. Add the story behind this piece here — inspiration, process, what the title means to you.",
    sold: false,
    isHero: false,
    certificateId: "ADG-0002",
  },
  {
    id: "vessel-no-7",
    title: "Vessel No. 7",
    artist: "Delara Ahmadi Darani",
    year: "2024",
    medium: "Bronze",
    dims: "34 cm h.",
    priceCents: 640000,
    images: [],
    story:
      "Add the story behind this piece here — inspiration, process, what the title means to you.",
    sold: false,
    isHero: false,
    certificateId: "ADG-0003",
  },
  {
    id: "nocturne-third-version",
    title: "Nocturne, Third Version",
    artist: "Delara Ahmadi Darani",
    year: "2021",
    medium: "Oil on canvas",
    dims: "130 × 97 cm",
    priceCents: 790000,
    images: [],
    story:
      "Add the story behind this piece here — inspiration, process, what the title means to you.",
    sold: false,
    isHero: false,
    certificateId: "ADG-0004",
  },
  {
    id: "untitled-fragment",
    title: "Untitled (Fragment)",
    artist: "Delara Ahmadi Darani",
    year: "2024",
    medium: "Mixed media on board",
    dims: "45 × 60 cm",
    priceCents: 230000,
    images: [],
    story:
      "Add the story behind this piece here — inspiration, process, what the title means to you.",
    sold: false,
    isHero: false,
    certificateId: "ADG-0005",
  },
  {
    id: "the-long-room",
    title: "The Long Room",
    artist: "Delara Ahmadi Darani",
    year: "2023",
    medium: "Oil on linen",
    dims: "101 × 76 cm",
    priceCents: 510000,
    images: [],
    story:
      "Add the story behind this piece here — inspiration, process, what the title means to you.",
    sold: false,
    isHero: false,
    certificateId: "ADG-0006",
  },
];

export function getPiece(id) {
  return pieces.find((p) => p.id === id) || null;
}

export function formatPrice(cents) {
  if (cents == null) return "Inquire for price";
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
}
