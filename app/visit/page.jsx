"use client";

import { useState } from "react";
import { pieces } from "@/lib/pieces";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  background: palette.wall,
  color: palette.bone,
  border: `1px solid rgba(184,141,87,0.25)`,
  padding: "10px 12px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  color: palette.smoke,
  letterSpacing: "0.08em",
};

export default function VisitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pieceId, setPieceId] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const piece = pieces.find((p) => p.id === pieceId);
    const pieceLine = piece ? piece.title : "No specific piece — general visit";

    const subject = `Viewing request${piece ? `: ${piece.title}` : ""}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Piece: ${pieceLine}`,
      preferredTime ? `Preferred time: ${preferredTime}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:Ahmadi.delara@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-6 sm:px-14 py-14 max-w-2xl mx-auto">
        <div
          className="text-xs uppercase mb-3"
          style={{ ...labelStyle, color: palette.brass }}
        >
          Visit
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            color: palette.bone,
            fontWeight: 300,
            fontSize: "2rem",
          }}
        >
          Request a viewing
        </h1>
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
        >
          Viewings are by appointment. Fill in a few details below — this
          opens a pre-filled email you can send directly, no account needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Which piece would you like to see?
            </label>
            <select
              value={pieceId}
              onChange={(e) => setPieceId(e.target.value)}
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="">No specific piece — general visit</option>
              {pieces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Preferred date / time (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. weekday afternoons"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Message (optional)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            className="text-xs uppercase px-5 py-3 self-start mt-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send request
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
