import { getCollections } from "@/lib/collectionsStore";
import { getPieces } from "@/lib/piecesStore";
import { adminPalette } from "@/lib/palette";
import AdminTabs from "@/components/admin/AdminTabs";
import EditCollectionsForm from "@/components/admin/EditCollectionsForm";
import AddCollectionForm from "@/components/admin/AddCollectionForm";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const [collections, pieces] = await Promise.all([getCollections(), getPieces()]);
  const pieceCounts = {};
  for (const p of pieces) if (p.collection) pieceCounts[p.collection] = (pieceCounts[p.collection] || 0) + 1;

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
          <AdminTabs active="collections" />
        </div>
        <LogoutButton />
      </div>

      <AddCollectionForm />
      {/* Re-mounts when a collection is added or deleted, so the list matches. */}
      <EditCollectionsForm
        key={collections.map((c) => c.slug).join("|")}
        collections={collections}
        pieceCounts={pieceCounts}
      />
    </div>
  );
}
