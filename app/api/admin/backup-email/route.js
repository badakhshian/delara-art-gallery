import { NextResponse } from "next/server";
import { sendBackupEmail } from "@/lib/backup";

// Admin-only (see middleware): "Email backup now" button.
export const dynamic = "force-dynamic";

export async function POST() {
  const result = await sendBackupEmail();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
