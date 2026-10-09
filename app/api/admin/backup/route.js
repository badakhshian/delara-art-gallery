import { buildBackup } from "@/lib/backup";

// Admin-only (see middleware): downloads the backup file.
export const dynamic = "force-dynamic";

export async function GET() {
  const { json, filename } = await buildBackup();
  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
