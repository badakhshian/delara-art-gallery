import Link from "next/link";
import Image from "next/image";
import { getPieces } from "@/lib/piecesStore";
import { formatPrice } from "@/lib/pieces";
import { adminPalette } from "@/lib/palette";
import AdminTabs from "@/components/admin/AdminTabs";
import DeletePieceButton from "@/components/admin/DeletePieceButton";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const pieces = await getPieces();

  return (
    <div style={{ background: adminPalette.bg, minHeight: "100vh" }} className="px-6 sm:px-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <div
            className="text-xs uppercase mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: adminPalette.brass,
              letterSpacing: "0.12em",
            }}
          >
            Admin
          </div>
          <AdminTabs active="pieces" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="text-xs uppercase px-4 py-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: adminPalette.surface,
              background: adminPalette.brass,
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}
          >
            + Add piece
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {pieces.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 p-4"
            style={{ background: adminPalette.surface, border: `1px solid ${adminPalette.border}` }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                position: "relative",
                background: adminPalette.bg,
                flexShrink: 0,
              }}
            >
              {p.images?.[0] && (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                style={{ fontFamily: "'Fraunces', serif", color: adminPalette.text }}
                className="truncate"
              >
                {p.title}
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: adminPalette.muted }}
              >
                {p.collection || "no collection"} · {formatPrice(p.priceCents)}
                {p.sold ? " · sold" : ""}
              </div>
            </div>
            <Link
              href={`/admin/edit/${p.id}`}
              className="text-xs uppercase px-3 py-2"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: adminPalette.text,
                border: `1px solid ${adminPalette.border}`,
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
            >
              Edit
            </Link>
            <DeletePieceButton pieceId={p.id} pieceTitle={p.title} />
          </div>
        ))}
        {pieces.length === 0 && (
          <p
            style={{ color: adminPalette.muted, fontFamily: "'Inter', sans-serif" }}
            className="text-sm"
          >
            No pieces yet.
          </p>
        )}
      </div>
    </div>
  );
}
