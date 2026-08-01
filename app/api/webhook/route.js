import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { list, put } from "@vercel/blob";
import { updatePiece, getPiece } from "@/lib/piecesStore";
import { SITE_URL } from "@/lib/site";

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

// Branded HTML confirmation email — logo, piece details, styled buttons —
// instead of a plain-text message with raw pasted links.
function buildBuyerEmailHtml({ buyerName, pieceTitle, pieceImage, amount, invoiceHostedUrl, invoicePdfUrl }) {
  const logoUrl = `${SITE_URL}/images/logo-gold.png`;

  return `
  <div style="background:#F5F1E8;padding:40px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E5DDC8;">
      <div style="text-align:center;padding:36px 32px 0;">
        <img src="${logoUrl}" alt="Delara Ahmadi Darani" width="150" style="height:auto;display:inline-block;" />
      </div>
      <div style="padding:24px 32px 0;text-align:center;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:22px;color:#1B1917;margin:0 0 6px;">
          Thank you, ${buyerName}
        </h1>
        <p style="font-size:13px;color:#6E6656;margin:0 0 28px;">Your purchase is confirmed</p>
      </div>

      ${
        pieceImage
          ? `<img src="${pieceImage}" alt="${pieceTitle}" style="width:100%;display:block;" />`
          : ""
      }

      <div style="padding:24px 32px;border-top:1px solid #E5DDC8;border-bottom:1px solid #E5DDC8;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#B08D57;margin-bottom:4px;">
          Piece
        </div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1B1917;margin-bottom:14px;">
          ${pieceTitle}
        </div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#B08D57;margin-bottom:4px;">
          Amount
        </div>
        <div style="font-size:15px;color:#1B1917;">${amount}</div>
      </div>

      <div style="padding:28px 32px;text-align:center;">
        ${
          invoiceHostedUrl
            ? `<a href="${invoiceHostedUrl}" style="display:inline-block;background:#B08D57;color:#1B1917;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:4px;">View Invoice</a>`
            : ""
        }
        ${
          invoicePdfUrl
            ? `<a href="${invoicePdfUrl}" style="display:inline-block;background:#ffffff;border:1px solid #B08D57;color:#1B1917;text-decoration:none;padding:11px 21px;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:4px;">Download PDF</a>`
            : ""
        }
      </div>

      <p style="padding:0 32px;font-size:13px;color:#6E6656;text-align:center;line-height:1.6;">
        Delara will be in touch shortly to arrange delivery.
      </p>

      <div style="text-align:center;margin-top:8px;padding:24px 32px 32px;border-top:1px solid #E5DDC8;font-size:11px;color:#8A857C;">
        — Delara Art Gallery<br />
        <a href="mailto:Ahmadi.delara@gmail.com" style="color:#8A857C;">Ahmadi.delara@gmail.com</a>
      </div>
    </div>
  </div>`;
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

    const buyerEmail = session.customer_details?.email;
    const buyerName = session.customer_details?.name || "there";
    const shipping = session.collected_information?.shipping_details;
    const amount = formatDollars(session.amount_total);
    const pieceTitle = piece?.title || pieceId || "your piece";
    const pieceImage = piece?.images?.[0] || null;

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
      const fromAddress = process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev";

      if (buyerEmail) {
        try {
          await resend.emails.send({
            from: fromAddress,
            to: buyerEmail,
            replyTo: "Ahmadi.delara@gmail.com",
            subject: `Your purchase — ${pieceTitle}`,
            html: buildBuyerEmailHtml({
              buyerName,
              pieceTitle,
              pieceImage,
              amount,
              invoiceHostedUrl,
              invoicePdfUrl,
            }),
            text: [
              `Hi ${buyerName},`,
              "",
              `Thank you for your purchase of "${pieceTitle}" (${amount}) from Delara Art Gallery.`,
              "",
              invoiceHostedUrl ? `View your invoice: ${invoiceHostedUrl}` : null,
              invoicePdfUrl ? `Download PDF: ${invoicePdfUrl}` : null,
              invoiceHostedUrl || invoicePdfUrl ? "" : null,
              "Delara will be in touch shortly to arrange delivery.",
              "",
              "— Delara Art Gallery",
            ]
              .filter((line) => line !== null)
              .join("\n"),
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
