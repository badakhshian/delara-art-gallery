import { NextResponse } from "next/server";
import { getCollections } from "@/lib/collectionsStore";

export async function GET() {
  const collections = await getCollections();
  return NextResponse.json({ collections });
}
