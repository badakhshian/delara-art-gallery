import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPiece } from "@/lib/piecesStore";


export async function POST(request) {
  try {
    const { name, email, phone, pieceId, preferredTime, message } =
      await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
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
      from: process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev",
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
