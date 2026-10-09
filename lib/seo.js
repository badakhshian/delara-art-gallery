import { SITE_URL, INSTAGRAM_URL, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import { formatPrice } from "@/lib/pieces";
import { getDictionary, localizePath } from "@/lib/i18n";
import { featuredImage } from "@/lib/hero";

export const SITE_NAME = "Delara Art Gallery";
export const ARTIST_NAME = "Delara Ahmadi Darani";

// Turns a site-relative path ("/images/x.jpg") into a full URL; leaves
// already-absolute URLs (Vercel Blob uploads) alone.
export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  return new URL(pathOrUrl, SITE_URL).toString();
}

// Trims text to `max` characters at a word boundary, adding "…".
export function truncate(text, max = 160) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 3).replace(/\s+\S*$/, "") + "…" : clean;
}

// Short search/share snippet, e.g.
// "Acrylic and modelling paste on canvas, 48 × 48 in — $11,200. An abstract
// exploration of the many layers of life…"
export function pieceDescription(piece, lang = "en") {
  const facts = [piece.medium, piece.dims].filter(Boolean).join(", ");
  const price = piece.sold ? getDictionary(lang).sold : formatPrice(piece.priceCents, lang);
  const lead = [facts, price].filter(Boolean).join(" — ");
  const story = (piece.story || "").replace(/\s+/g, " ").trim();
  return truncate(story ? `${lead}. ${story}` : lead);
}

// Open Graph / Twitter image entries for a piece's photos, its featured
// (Hero-ticked, else first) photo first so link previews show that one.
export function pieceImages(piece, lang = "en") {
  const featured = featuredImage(piece);
  const ordered = [featured, ...(piece.images || []).filter((src) => src !== featured)].filter(Boolean);
  return ordered.slice(0, 4).map((src) => ({
    url: absoluteUrl(src),
    alt: getDictionary(lang).meta.imageAlt(piece.title, piece.medium),
  }));
}

// schema.org data so search engines understand a piece as an original
// artwork that is for sale (or sold).
export function pieceJsonLd(piece, lang = "en") {
  const url = absoluteUrl(localizePath(lang, `/piece/${piece.id}`));
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
    inLanguage: lang,
    creator: { "@type": "Person", "@id": absoluteUrl("/#artist"), name: ARTIST_NAME, url: absoluteUrl(localizePath(lang, "/artist")) },
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

const MONTREAL = {
  "@type": "PostalAddress",
  addressLocality: "Montréal",
  addressRegion: "QC",
  addressCountry: "CA",
};

export function artistJsonLd(artist, lang = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#artist"),
    name: artist?.name || ARTIST_NAME,
    url: absoluteUrl(localizePath(lang, "/artist")),
    image: absoluteUrl(artist?.photo),
    jobTitle: lang === "fr" ? "Artiste peintre" : "Painter",
    description: artist?.bio?.[0] || undefined,
    address: MONTREAL,
    sameAs: [INSTAGRAM_URL],
    worksFor: { "@id": absoluteUrl("/#gallery") },
  };
}

// The studio as an art gallery in Montréal, plus the website itself.
// Shown on the homepage.
export function galleryJsonLd(lang = "en") {
  const t = getDictionary(lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "ArtGallery",
      "@id": absoluteUrl("/#gallery"),
      name: SITE_NAME,
      url: absoluteUrl(localizePath(lang, "/")),
      description: t.meta.homeDescription,
      image: absoluteUrl(DEFAULT_IMAGE.url),
      logo: absoluteUrl("/images/logo-gold.png"),
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      address: MONTREAL,
      areaServed: "Montréal",
      founder: { "@type": "Person", "@id": absoluteUrl("/#artist"), name: ARTIST_NAME },
      sameAs: [INSTAGRAM_URL],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      inLanguage: ["en", "fr"],
    },
  ];
}

// A collection page as a list of its artworks.
export function collectionJsonLd(collection, pieces, lang = "en") {
  const url = absoluteUrl(localizePath(lang, `/collections/${collection.slug}`));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    url,
    description: collection.description || getDictionary(lang).meta.collectionDescription(collection.name, pieces.length),
    inLanguage: lang,
    author: { "@type": "Person", "@id": absoluteUrl("/#artist"), name: ARTIST_NAME },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pieces.length,
      itemListElement: pieces.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(localizePath(lang, `/piece/${p.id}`)),
        name: p.title,
      })),
    },
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
// `path` is the English path; the French twin lives at /fr + path, and both
// are listed as alternates so search engines pair them up.
export function pageMetadata({ title, description, path, images, lang = "en", type = "website" }) {
  const imgs = images?.length ? images : [DEFAULT_IMAGE];
  const url = localizePath(lang, path);
  const t = getDictionary(lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: path, fr: localizePath("fr", path), "x-default": path },
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: t.ogLocale,
      alternateLocale: getDictionary(lang === "fr" ? "en" : "fr").ogLocale,
      type,
      title,
      description,
      url,
      images: imgs,
    },
    twitter: { card: "summary_large_image", title, description, images: imgs.map((i) => i.url) },
  };
}
