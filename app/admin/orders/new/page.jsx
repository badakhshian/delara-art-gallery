import Link from "next/link";
import { getPieces } from "@/lib/piecesStore";
import { adminPalette } from "@/lib/palette";
import NewOrderForm from "@/components/admin/NewOrderForm";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const pieces = await getPieces();
  // Unsold pieces first; each with what the form needs.
  const options = [...pieces]
    .sort((a, b) => Number(!!a.sold) - Number(!!b.sold) || String(a.title).localeCompare(String(b.title)))
    .map((p) => ({ id: p.id, title: p.title, sold: !!p.sold, priceCents: p.priceCents ?? null }));

  return (
    <div style={{ background: adminPalette.bg, minHeight: "100vh", color: adminPalette.text }} className="px-4 sm:px-10 py-8 sm:py-10">
      <Link
        href="/admin/orders"
        className="inline-block py-2 text-[11px] uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A6A35", letterSpacing: "0.12em", textDecoration: "none" }}
      >
        ← All orders
      </Link>
      <h1 className="mt-3 text-[28px] sm:text-[34px]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
        Add an order
      </h1>
      <p className="mt-1.5 text-sm max-w-xl" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.muted }}>
        For a sale made outside the website — in person, by e-transfer, at a show. Website sales are added automatically.
      </p>
      <NewOrderForm pieces={options} />
    </div>
  );
}
