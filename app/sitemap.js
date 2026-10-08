import { getPieces } from "@/lib/piecesStore";
import { getCollections } from "@/lib/collectionsStore";
import { absoluteUrl } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";

// Generated on each request so new pieces and collections from the admin
// appear in /sitemap.xml straight away.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [pieces, collections] = await Promise.all([getPieces(), getCollections()]);

  const pages = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/collections", priority: 0.8, changeFrequency: "weekly" },
    { path: "/timeline", priority: 0.7, changeFrequency: "weekly" },
    { path: "/artist", priority: 0.7, changeFrequency: "monthly" },
    { path: "/visit", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ].map(({ path, ...rest }) => ({ url: absoluteUrl(path), ...rest }));

  const collectionPages = collections.map((c) => ({
    url: absoluteUrl(`/collections/${c.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const piecePages = pieces.map((p) => ({
    url: absoluteUrl(`/piece/${p.id}`),
    changeFrequency: "monthly",
    priority: p.sold ? 0.5 : 0.8,
  }));

  // Each page in English and French, each listing the other as its
  // language alternate.
  return [...pages, ...collectionPages, ...piecePages].flatMap((entry) => {
    const path = new URL(entry.url).pathname;
    const languages = {
      en: absoluteUrl(path),
      fr: absoluteUrl(localizePath("fr", path)),
    };
    return [
      { ...entry, alternates: { languages } },
      { ...entry, url: languages.fr, alternates: { languages } },
    ];
  });
}
