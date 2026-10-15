import { adminPalette } from "@/lib/palette";
import EmailBackupButton from "@/components/admin/EmailBackupButton";
import LogoutButton from "@/components/admin/LogoutButton";

// Right side of every admin tab's header: backups and Log out.
export default function AdminHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="/api/admin/backup"
        className="text-xs uppercase px-4 py-2"
        title="Download a copy of all pieces, collections, orders and artist text"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: adminPalette.text,
          border: `1px solid ${adminPalette.border}`,
          letterSpacing: "0.1em",
          textDecoration: "none",
        }}
      >
        Download backup
      </a>
      <EmailBackupButton />
      <LogoutButton />
    </div>
  );
}
