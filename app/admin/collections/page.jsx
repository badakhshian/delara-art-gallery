import { getCollections } from "@/lib/collectionsStore";
import { adminPalette } from "@/lib/palette";
import AdminTabs from "@/components/admin/AdminTabs";
import EditCollectionsForm from "@/components/admin/EditCollectionsForm";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

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

      <EditCollectionsForm collections={collections} />
    </div>
  );
}
