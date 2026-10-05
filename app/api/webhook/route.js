import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { list, put } from "@vercel/blob";
import { updatePiece, getPiece } from "@/lib/piecesStore";
import { localizePiece } from "@/lib/localize";
import { buildBuyerEmail } from "@/lib/purchaseEmail";
import { senderAddress } from "@/lib/emailSender";

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

// IMPORTANT — to wire this up in Stripe: Dashboard -> Developers ->
// Webhooks -> Add endpoint -> https://www.artedelara.com/api/webhook
// (use the exact domain your site actually serves from — a mismatch here
// silently drops every event), listening for checkout.session.completed.
// Copy the signing secret into STRIPE_WEBHOOK_SECRET.

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

    // "fr" when the buyer checked out from the French site (set by
    // /api/checkout); older sessions fall back to Stripe's checkout locale.
    const lang =
      session.metadata?.lang === "fr" || String(session.locale || "").startsWith("fr") ? "fr" : "en";

    const buyerEmail = session.customer_details?.email;
    const buyerName = session.customer_details?.name || "";
    const shipping = session.collected_information?.shipping_details;
    const amount = formatDollars(session.amount_total);
    const pieceTitle = piece?.title || pieceId || "your piece";

    let invoicePdfUrl = null;
    let invoiceHostedUrl = null;
    if (session.invoice) {
      try {
        const invoice = await stripe.invoices.retrieve(session.invoice);
        invoicePdfUrl = invoice.invoice_pdf;
        invoiceHostedUrl = invoice.hosted_invoice_url;
      } catch (err) {
        console.error("Could not retrieve invoice:", err);
      }
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = senderAddress();

      if (buyerEmail) {
        try {
          const email = buildBuyerEmail({
            lang,
            buyerName,
            piece: localizePiece(piece, lang),
            pieceId,
            amountCents: session.amount_total,
            invoiceHostedUrl,
            invoicePdfUrl,
          });
          await resend.emails.send({
            from: fromAddress,
            to: buyerEmail,
            replyTo: "Ahmadi.delara@gmail.com",
            subject: email.subject,
            html: email.html,
            text: email.text,
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
            `Buyer: ${buyerName || "(no name given)"}`,
            `Buyer's language: ${lang === "fr" ? "French — they bought from the French site" : "English"}`,
            buyerEmail ? `Email: ${buyerEmail}` : null,
            shipping
              ? `Shipping: ${shipping.address?.line1 || ""} ${shipping.address?.line2 || ""}, ${shipping.address?.city || ""}, ${shipping.address?.state || ""} ${shipping.address?.postal_code || ""}, ${shipping.address?.country || ""}`
              : null,
            invoiceHostedUrl ? `Invoice: ${invoiceHostedUrl}` : null,
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
