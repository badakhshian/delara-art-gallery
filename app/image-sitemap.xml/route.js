import { getPieces } from "@/lib/piecesStore";
import { absoluteUrl } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";

// Image sitemap for Google Images: every artwork page (English and French)
// with all of its photos. Listed in robots.txt next to /sitemap.xml.
export const dynamic = "force-dynamic";

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

export async function GET() {
  const pieces = await getPieces();
  const urls = pieces
    .filter((p) => (p.images || []).length > 0)
    .flatMap((p) =>
      ["en", "fr"].map((lang) => {
        const images = p.images
          .map((src) => `    <image:image><image:loc>${escapeXml(absoluteUrl(src))}</image:loc></image:image>`)
          .join("\n");
        return `  <url>\n    <loc>${escapeXml(absoluteUrl(localizePath(lang, `/piece/${p.id}`)))}</loc>\n${images}\n  </url>`;
      })
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
