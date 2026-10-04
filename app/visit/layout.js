import { pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";

// The visit page is a client component, so its metadata lives here.
export function generateMetadata() {
  const { lang, t } = getI18n();
  return pageMetadata({
    title: t.meta.visitTitle,
    description: t.meta.visitDescription,
    path: "/visit",
    lang,
  });
}

export default function VisitLayout({ children }) {
  return children;
}
