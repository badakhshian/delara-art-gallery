import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { list, put } from "@vercel/blob";
import { updatePiece, getPiece } from "@/lib/piecesStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const maxDuration = 30;

const PROCESSED_EVENTS_PATH = "data/processed-webhook-events.json";

async function isEventProcessed(eventId) {
  try {
    const { blobs } = await list({ prefix: PROCESSED_EVENTS_PATH });
    const match = blobs.find((b) => b.pathname === PROCESSED_EVENTS_PATH);
    if (!match) return false;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return false;
    const ids = await res.json();
    return Array.isArray(ids) && ids.includes(eventId);
  } catch (err) {
    console.error("isEventProcessed error:", err);
    return false;
  }
}

async function markEventProcessed(eventId) {
  try {
    const { blobs } = await list({ prefix: PROCESSED_EVENTS_PATH });
    const match = blobs.find((b) => b.pathname === PROCESSED_EVENTS_PATH);
    let ids = [];
    if (match) {
      const res = await fetch(match.url, { cache: "no-store" });
      if (res.ok) ids = await res.json();
    }
    ids.push(eventId);
    const trimmed = ids.slice(-300);
    await put(PROCESSED_EVENTS_PATH, JSON.stringify(trimmed), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } catch (err) {
    console.error("markEventProcessed error:", err);
  }
}

function formatDollars(cents) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
}

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
    const alreadyProcessed = await isEventProcessed(event.id);

    if (alreadyProcessed) {
      console.log(`Event ${event.id} already processed — skipping (this was a Stripe retry).`);
      return NextResponse.json({ received: true, skipped: true });
    }

    await markEventProcessed(event.id);

    const session = event.data.object;
    const pieceId = session.metadata?.pieceId;

    const piece = pieceId ? await getPiece(pieceId) : null;

    if (pieceId) {
      await updatePiece(pieceId, { sold: true });
    }

    const buyerEmail = session.customer_details?.email;
    const buyerName = session.customer_details?.name || "there";
    const shipping = session.collected_information?.shipping_details;
    const amount = formatDollars(session.amount_total);
    const pieceTitle = piece?.title || pieceId || "your piece";

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev";

      if (buyerEmail) {
        try {
          await resend.emails.send({
            from: fromAddress,
            to: buyerEmail,
            replyTo: "Ahmadi.delara@gmail.com",
            subject: `Your purchase — ${pieceTitle}`,
            text: [
              `Hi ${buyerName},`,
              "",
              `Thank you for your purchase of "${pieceTitle}" (${amount}) from Delara Art Gallery.`,
              "",
              "Delara will be in touch shortly to arrange delivery.",
              "",
              "— Delara Art Gallery",
            ].join("\n"),
          });
        } catch (err) {
          console.error("Buyer confirmation email failed:", err);
        }
      }

      try {
        await resend.emails.send({
          from: fromAddress,
          to: "Ahmadi.delara@gmail.com",
          replyTo: buyerEmail || undefined,
          subject: `New sale: ${pieceTitle} (${amount})`,
          text: [
            `"${pieceTitle}" just sold for ${amount}.`,
            "",
            `Buyer: ${buyerName}`,
            buyerEmail ? `Email: ${buyerEmail}` : null,
            shipping
              ? `Shipping: ${shipping.address?.line1 || ""} ${shipping.address?.line2 || ""}, ${shipping.address?.city || ""}, ${shipping.address?.state || ""} ${shipping.address?.postal_code || ""}, ${shipping.address?.country || ""}`
              : null,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (err) {
        console.error("Seller notification email failed:", err);
      }
    } else {
      console.log(`Piece sold: ${pieceId} — RESEND_API_KEY not set, no emails sent.`);
    }
  }

  return NextResponse.json({ received: true });
}
