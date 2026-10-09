import { NextResponse } from "next/server";
import { sendBackupEmail } from "@/lib/backup";

// Weekly backup email, run by Vercel Cron (see vercel.json: Mondays 13:00
// UTC, 9 am in Montréal in summer). Vercel calls it with
// "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const result = await sendBackupEmail();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
