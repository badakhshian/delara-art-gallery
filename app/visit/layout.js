import { pageMetadata } from "@/lib/seo";

// The visit page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Visit the Studio — Delara Art Gallery",
  description:
    "Request a private viewing of Delara Ahmadi Darani's original artworks. Viewings by appointment.",
  path: "/visit",
});

export default function VisitLayout({ children }) {
  return children;
}
