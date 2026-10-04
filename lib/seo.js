import { SITE_URL } from "@/lib/site";
import { formatPrice } from "@/lib/pieces";

export const SITE_NAME = "Delara Art Gallery";
export const ARTIST_NAME = "Delara Ahmadi Darani";

// Turns a site-relative path ("/images/x.jpg") into a full URL; leaves
// already-absolute URLs (Vercel Blob uploads) alone.
export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  return new URL(pathOrUrl, SITE_URL).toString();
}

// Short search/share snippet, e.g.
// "Acrylic and modelling paste on canvas, 48 × 48 in — $11,200. An abstract
// exploration of the many layers of life…"
export function pieceDescription(piece) {
  const facts = [piece.medium, piece.dims].filter(Boolean).join(", ");
  const price = piece.sold ? "Sold" : formatPrice(piece.priceCents);
  const lead = [facts, price].filter(Boolean).join(" — ");
  const story = (piece.story || "").replace(/\s+/g, " ").trim();
  const text = story ? `${lead}. ${story}` : lead;
  return text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, "") + "…" : text;
}

// Open Graph / Twitter image entries for a piece's photos (first one first).
export function pieceImages(piece) {
  return (piece.images || []).slice(0, 4).map((src) => ({
    url: absoluteUrl(src),
    alt: `${piece.title} by ${ARTIST_NAME}`,
  }));
}

// schema.org data so search engines understand a piece as an original
// artwork that is for sale (or sold).
export function pieceJsonLd(piece) {
  const url = absoluteUrl(`/piece/${piece.id}`);
  const data = {
    "@context": "https://schema.org",
    "@type": ["VisualArtwork", "Product"],
    name: piece.title,
    url,
    image: (piece.images || []).map(absoluteUrl),
    description: piece.story || undefined,
    artMedium: piece.medium || undefined,
    artEdition: 1,
    dateCreated: piece.year || undefined,
    creator: { "@type": "Person", name: ARTIST_NAME, url: absoluteUrl("/artist") },
    brand: { "@type": "Brand", name: SITE_NAME },
    sku: piece.certificateId || piece.id,
  };
  if (piece.priceCents != null) {
    data.offers = {
      "@type": "Offer",
      url,
      price: (piece.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: piece.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }
  return data;
}

export function artistJsonLd(artist) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist?.name || ARTIST_NAME,
    url: absoluteUrl("/artist"),
    image: absoluteUrl(artist?.photo),
    jobTitle: "Artist",
    description: artist?.bio?.[0] || undefined,
  };
}

// Renders a JSON-LD <script>. `<` is escaped so text from the admin can't
// close the script tag early.
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const DEFAULT_IMAGE = { url: "/images/RuedaDeLaVida1.JPG", alt: "wheel of Soaring by Delara Ahmadi Darani" };

// Full metadata for one page. Next replaces (doesn't merge) a parent's
// openGraph/twitter objects, so each page gets a complete set here.
export function pageMetadata({ title, description, path, images, type = "website" }) {
  const imgs = images?.length ? images : [DEFAULT_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { siteName: SITE_NAME, locale: "en_CA", type, title, description, url: path, images: imgs },
    twitter: { card: "summary_large_image", title, description, images: imgs.map((i) => i.url) },
  };
}
