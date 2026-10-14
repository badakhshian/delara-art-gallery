import { absoluteUrl } from "@/lib/seo";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/order/", "/fr/order/"] },
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/image-sitemap.xml")],
  };
}
