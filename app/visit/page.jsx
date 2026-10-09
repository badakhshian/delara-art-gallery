"use client";

import { useState, useEffect } from "react";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import { useI18n } from "@/components/LangProvider";
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
  const { lang, t } = useI18n();
  const v = t.visit;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pieceId, setPieceId] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  // Hidden "website" field: people never see or fill it, spam bots do.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    fetch(`/api/pieces?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => setPieces(data.pieces || []))
      .catch(() => setPieces([]));
  }, [lang]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/visit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, pieceId, preferredTime, message, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || v.error);
        return;
      }

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(v.error);
    }
  }

  if (status === "sent") {
    return (
      <div style={{ background: palette.void, minHeight: "100vh" }}>
        <Header />
        <div className="px-6 sm:px-14 pt-32 pb-14 max-w-2xl mx-auto">
          <div
            className="text-xs uppercase mb-3"
            style={{ ...labelStyle, color: palette.brass }}
          >
            {v.eyebrow}
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              color: palette.bone,
              fontWeight: 300,
              fontSize: "2rem",
            }}
          >
            {v.sentTitle}
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
          >
            {v.sentText}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="px-6 sm:px-14 pt-32 pb-14 max-w-2xl mx-auto">
        <div
          className="text-xs uppercase mb-3"
          style={{ ...labelStyle, color: palette.brass }}
        >
          {v.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            color: palette.bone,
            fontWeight: 300,
            fontSize: "2rem",
          }}
        >
          {v.title}
        </h1>
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}
        >
          {v.intro}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              {v.name}
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
              {v.email}
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
              {v.phone}
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
              {v.whichPiece}
            </label>
            <select
              value={pieceId}
              onChange={(e) => setPieceId(e.target.value)}
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="">{v.noPiece}</option>
              {pieces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              {v.preferredTime}
            </label>
            <input
              type="text"
              placeholder={v.preferredPlaceholder}
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              {v.message}
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
            {status === "sending" ? v.sending : v.send}
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
