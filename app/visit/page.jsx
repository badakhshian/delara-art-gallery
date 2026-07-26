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
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/visit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, pieceId, preferredTime, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ background: palette.void, minHeight: "100vh" }}>
        <Header />
        <div className="px-6 sm:px-14 py-24 max-w-2xl mx-auto text-center">
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
            Request sent
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
          >
            Thank you — your viewing request has been sent. You'll hear back
            directly to confirm a time.
          </p>
        </div>
        <Footer />
      </div>
    );
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
          Viewings are by appointment. Fill in a few details below and the
          request is sent directly — no email app needed.
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
            disabled={status === "sending"}
            className="text-xs uppercase px-5 py-3 self-start mt-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
              letterSpacing: "0.1em",
              border: "none",
              cursor: status === "sending" ? "wait" : "pointer",
              opacity: status === "sending" ? 0.7 : 1,
            }}
          >
            {status === "sending" ? "Sending…" : "Send request"}
          </button>

          {status === "error" && (
            <p
              className="text-xs"
              style={{ color: palette.oxblood, fontFamily: "'Inter', sans-serif" }}
            >
              {errorMessage}
            </p>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
}
