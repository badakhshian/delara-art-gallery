import { Resend } from "resend";
import { senderAddress } from "@/lib/emailSender";
import { buildOrderUpdateEmail } from "@/lib/orderEmail";
import { getPiece } from "@/lib/piecesStore";
import { localizePiece } from "@/lib/localize";
import { CONTACT_EMAIL } from "@/lib/site";

// Emails the buyer the order's current status. Returns { ok, error? }.
export async function sendOrderUpdateEmail(order) {
  if (!order.buyer?.email) return { ok: false, error: "This order has no buyer email." };
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY is not set." };

  const piece = order.pieceId ? localizePiece(await getPiece(order.pieceId), order.lang) : null;
  const email = buildOrderUpdateEmail({
    order,
    title: piece?.title || order.pieceTitle || order.id,
    image: piece?.images?.[0] || order.pieceImage || null,
  });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: senderAddress(),
      to: order.buyer.email,
      replyTo: CONTACT_EMAIL,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (error) throw new Error(error.message || "Resend error");
    return { ok: true };
  } catch (err) {
    console.error("Order update email failed:", err);
    return { ok: false, error: "The email could not be sent." };
  }
}
