import { NextResponse } from "next/server";
import { createOrder, ORDER_STATUSES } from "@/lib/ordersStore";
import { getPiece, updatePiece } from "@/lib/piecesStore";
import { sendOrderUpdateEmail } from "@/lib/orderNotify";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adds an order by hand (a sale made in person, by e-transfer, etc.).
export async function POST(request) {
  try {
    const body = await request.json();
    const piece = body.pieceId ? await getPiece(clip(body.pieceId, 200)) : null;
    const pieceTitle = piece?.title || clip(body.pieceTitle, 200);
    if (!pieceTitle) return NextResponse.json({ error: "Choose a piece or type a title." }, { status: 400 });

    const buyerName = clip(body.buyerName, 200);
    const buyerEmail = clip(body.buyerEmail, 200);
    if (!buyerName) return NextResponse.json({ error: "Enter the buyer's name." }, { status: 400 });
    if (buyerEmail && !EMAIL_RE.test(buyerEmail)) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }

    const dollars = parseFloat(String(body.amount ?? "").replace(/[^0-9.]/g, ""));
    const amountCents = Number.isFinite(dollars) ? Math.round(dollars * 100) : null;

    const s = body.shipping || {};
    const shipping = clip(s.line1, 200) || clip(s.city, 100)
      ? {
          name: buyerName,
          line1: clip(s.line1, 200),
          line2: clip(s.line2, 200),
          city: clip(s.city, 100),
          state: clip(s.state, 100),
          postal_code: clip(s.postal_code, 20),
          country: clip(s.country, 60),
        }
      : null;

    const order = await createOrder({
      source: "manual",
      pieceId: piece?.id || "",
      pieceTitle,
      pieceImage: piece?.images?.[0] || "",
      amountCents,
      lang: body.lang === "fr" ? "fr" : "en",
      buyer: { name: buyerName, email: buyerEmail, phone: clip(body.buyerPhone, 40) },
      shipping,
      status: ORDER_STATUSES.includes(body.status) ? body.status : "paid",
    });

    // The order is already saved; a failure here is reported, not fatal.
    let soldError = null;
    if (piece && body.markSold) {
      try {
        await updatePiece(piece.id, { sold: true });
      } catch (err) {
        console.error("Manual order: could not mark the piece sold:", err);
        soldError = "The order was saved, but the piece could not be marked as sold. Mark it sold from Manage pieces.";
      }
    }

    let emailed = null;
    if (body.notify && buyerEmail) emailed = await sendOrderUpdateEmail(order);

    return NextResponse.json({
      order,
      emailed: emailed?.ok || false,
      emailError: emailed && !emailed.ok ? emailed.error : null,
      soldError,
    });
  } catch (err) {
    console.error("Manual order error:", err);
    return NextResponse.json({ error: "Could not save the order." }, { status: 500 });
  }
}
