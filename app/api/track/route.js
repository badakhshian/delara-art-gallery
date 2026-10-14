import { NextResponse } from "next/server";
import { findOrderForLookup, orderUrl } from "@/lib/ordersStore";
import { normalizeLang } from "@/lib/i18n";

// "Track an order": order number + email -> the private order page link.
// A wrong guess waits a second before answering, to slow down guessing.
export async function POST(request) {
  try {
    const body = await request.json();
    const orderNumber = String(body.orderNumber || "").slice(0, 20);
    const email = String(body.email || "").slice(0, 200);
    const order = await findOrderForLookup(orderNumber, email);
    if (!order) {
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ url: orderUrl(order, "", normalizeLang(body.lang)) });
  } catch (err) {
    console.error("Order lookup error:", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
