"use client";

import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs uppercase px-4 py-2"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: palette.smoke,
        background: "none",
        border: `1px solid rgba(184,141,87,0.3)`,
        letterSpacing: "0.1em",
        cursor: "pointer",
      }}
    >
      Log out
    </button>
  );
}
