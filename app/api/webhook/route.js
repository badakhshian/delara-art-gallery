import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// IMPORTANT — read before going live:
// `lib/pieces.js` is a static file, so this route can't actually persist a
// "sold" change while the app is deployed (editing a file on a running
// server doesn't stick, and multiple visitors won't see the same state).
//
// Before launch, move `pieces` into a real database — Supabase's free tier
// is a good fit — and replace the TODO below with a query that sets
// sold = true for the piece in `metadata.pieceId`. That's what makes it safe
// to sell one-of-a-kind pieces without double-selling one.
//
// To wire this up in Stripe: Dashboard → Developers → Webhooks → Add
// endpoint → https://artedelara.com/api/webhook, listening for
// checkout.session.completed. Copy the signing secret into
// STRIPE_WEBHOOK_SECRET in your environment.

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const pieceId = session.metadata?.pieceId;

    // TODO: replace with a real database update, e.g.:
    // await supabase.from("pieces").update({ sold: true }).eq("id", pieceId);
    console.log(`Piece sold (mark this in your database): ${pieceId}`);
  }

  return NextResponse.json({ received: true });
}
