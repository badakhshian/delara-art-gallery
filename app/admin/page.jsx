import Link from "next/link";
import Image from "next/image";
import { getPieces } from "@/lib/piecesStore";
import { formatPrice } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import DeletePieceButton from "@/components/admin/DeletePieceButton";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const pieces = await getPieces();

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }} className="px-6 sm:px-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <div
            className="text-xs uppercase mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.brass,
              letterSpacing: "0.12em",
            }}
          >
            Admin
          </div>
          <h1
            style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
            className="text-2xl"
          >
            Manage pieces
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="text-xs uppercase px-4 py-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
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
            style={{ background: palette.wall, border: `1px solid rgba(184,141,87,0.15)` }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                position: "relative",
                background: palette.void,
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
                style={{ fontFamily: "'Fraunces', serif", color: palette.bone }}
                className="truncate"
              >
                {p.title}
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
              >
                {p.collection || "no collection"} · {formatPrice(p.priceCents)}
                {p.sold ? " · sold" : ""}
              </div>
            </div>
            <DeletePieceButton pieceId={p.id} pieceTitle={p.title} />
          </div>
        ))}
        {pieces.length === 0 && (
          <p
            style={{ color: palette.smoke, fontFamily: "'Inter', sans-serif" }}
            className="text-sm"
          >
            No pieces yet.
          </p>
        )}
      </div>
    </div>
  );
}
