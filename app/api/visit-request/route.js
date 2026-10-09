import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPiece } from "@/lib/piecesStore";
import { senderAddress } from "@/lib/emailSender";


const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const LIMITS = { name: 120, email: 200, phone: 40, pieceId: 120, preferredTime: 200, message: 4000 };

// Trims each field and rejects anything too long, so the form can't be used
// to send huge or malformed emails.
function clean(body) {
  const out = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    if (value.length > max) return null;
    out[key] = value;
  }
  return out;
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Spam bots fill the hidden "website" field; pretend it worked and
    // send nothing.
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const fields = clean(body);
    if (!fields) {
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
    }
    const { name, email, phone, pieceId, preferredTime, message } = fields;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email sending isn't configured yet. Add RESEND_API_KEY to your environment." },
        { status: 500 }
      );
    }
    const piece = pieceId ? await getPiece(pieceId) : null;

    const pieceLine = piece ? piece.title : "No specific piece — general visit";

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: senderAddress(),
      to: "Ahmadi.delara@gmail.com",
      replyTo: email,
      subject: `Viewing request${piece ? `: ${piece.title}` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Piece: ${pieceLine}`,
        preferredTime ? `Preferred time: ${preferredTime}` : null,
        "",
        message || "",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Could not send the request." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Visit request error:", err);
    return NextResponse.json({ error: "Could not send the request." }, { status: 500 });
  }
}
