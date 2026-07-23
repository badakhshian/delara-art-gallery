export const collections = [
  {
    slug: "evocaciones",
    name: "Evocaciones",
    date: "2026-01-01",
  },
  {
    slug: "studio-collection",
    name: "Studio Collection",
    date: "2020-01-01",
  },
   {
    slug: "ElementsinMotion",
    name: "Elements in Motion Collection",
    date: "2020-01-01",
  },
];

export function getCollection(slug) {
  return collections.find((c) => c.slug === slug) || null;
}

export function sortedCollections() {
  return [...collections].sort((a, b) => new Date(b.date) - new Date(a.date));
}
