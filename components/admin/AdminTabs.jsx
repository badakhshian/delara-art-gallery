import Link from "next/link";
import { adminPalette } from "@/lib/palette";

export default function AdminTabs({ active }) {
  const tabStyle = (isActive) => ({
    fontFamily: "'Fraunces', serif",
    fontWeight: isActive ? 400 : 300,
    fontSize: "1.75rem",
    color: isActive ? adminPalette.text : adminPalette.muted,
    textDecoration: "none",
  });

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <Link href="/admin" style={tabStyle(active === "pieces")}>
        Manage pieces
      </Link>
      <Link href="/admin/artist" style={tabStyle(active === "artist")}>
        Artist
      </Link>
      <Link href="/admin/collections" style={tabStyle(active === "collections")}>
        Collections
      </Link>
    </div>
  );
}
