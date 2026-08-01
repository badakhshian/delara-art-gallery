import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPiece } from "@/lib/piecesStore";

// STRIPE_SECRET_KEY must be set in your environment (see .env.example).
// Never expose this key on the client — this file only runs on the server.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  try {
    const { pieceId } = await request.json();
    const piece = await getPiece(pieceId);

    if (!piece) {
      return NextResponse.json({ error: "Piece not found." }, { status: 404 });
    }
    if (piece.sold) {
      return NextResponse.json({ error: "This piece has already sold." }, { status: 409 });
    }
    if (piece.priceCents == null) {
      return NextResponse.json(
        { error: "This piece doesn't have a price set yet." },
        { status: 400 }
      );
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe isn't configured yet. Add STRIPE_SECRET_KEY to your environment." },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || "https://artedelara.com";
    const image = piece.images?.[0];
    const absoluteImage = image
      ? image.startsWith("http")
        ? image
        : `${origin}${image}`
      : null;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: piece.priceCents,
            product_data: {
              name: piece.title,
              description: `${piece.medium} · ${piece.dims}`,
              images: absoluteImage ? [absoluteImage] : [],
              metadata: { pieceId: piece.id },
            },
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      // Generates a real Stripe Invoice (with a PDF + hosted page) tied to
      // this purchase, instead of just our own plain confirmation email.
      invoice_creation: {
        enabled: true,
      },
      metadata: { pieceId: piece.id },
      success_url: `${origin}/piece/${piece.id}?purchase=success`,
      cancel_url: `${origin}/piece/${piece.id}?purchase=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
