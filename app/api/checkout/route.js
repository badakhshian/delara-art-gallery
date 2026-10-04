import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPiece } from "@/lib/piecesStore";
import { localizePiece } from "@/lib/localize";
import { localizePath, normalizeLang } from "@/lib/i18n";

// STRIPE_SECRET_KEY must be set in your environment (see .env.example).
// Never expose this key on the client — this file only runs on the server.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  try {
    const body = await request.json();
    const lang = normalizeLang(body.lang);
    const fr = lang === "fr";
    const piece = localizePiece(await getPiece(body.pieceId), lang);

    if (!piece) {
      return NextResponse.json({ error: fr ? "Œuvre introuvable." : "Piece not found." }, { status: 404 });
    }
    if (piece.sold) {
      return NextResponse.json(
        { error: fr ? "Cette œuvre a déjà été vendue." : "This piece has already sold." },
        { status: 409 }
      );
    }
    if (piece.priceCents == null) {
      return NextResponse.json(
        { error: fr ? "Le prix de cette œuvre n’est pas encore fixé." : "This piece doesn't have a price set yet." },
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

    const piecePath = localizePath(lang, `/piece/${piece.id}`);

    // Stripe writes its invoice, receipt and their emails in the Customer's
    // preferred language; without a Customer it uses the Dashboard default
    // (English). So French buyers get a Customer marked fr-CA up front —
    // Checkout fills in their email and name on it. English checkouts stay
    // as before (no Customer).
    const customer = fr
      ? await stripe.customers.create({
          preferred_locales: ["fr-CA", "fr"],
          metadata: { source: "artedelara.com checkout", pieceId: piece.id },
        })
      : null;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(customer ? { customer: customer.id } : {}),
      // Stripe's own checkout page in the buyer's language.
      locale: fr ? "fr-CA" : "en",
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
      metadata: { pieceId: piece.id, lang },
      success_url: `${origin}${piecePath}?purchase=success`,
      cancel_url: `${origin}${piecePath}?purchase=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
