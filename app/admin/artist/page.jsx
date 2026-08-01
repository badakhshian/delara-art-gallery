import { getArtist } from "@/lib/artistStore";
import { adminPalette } from "@/lib/palette";
import AdminTabs from "@/components/admin/AdminTabs";
import EditArtistForm from "@/components/admin/EditArtistForm";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminArtistPage() {
  const artist = await getArtist();

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
          <AdminTabs active="artist" />
        </div>
        <LogoutButton />
      </div>

      <EditArtistForm artist={artist} />
    </div>
  );
}
