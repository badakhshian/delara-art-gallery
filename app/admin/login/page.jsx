"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPalette } from "@/lib/palette";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect password.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: adminPalette.bg }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div
          className="text-xs uppercase mb-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: adminPalette.brass,
            letterSpacing: "0.12em",
          }}
        >
          Admin
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: adminPalette.text, fontWeight: 300 }}
          className="text-2xl mb-6"
        >
          Sign in
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoFocus
          style={{
            fontFamily: "'Inter', sans-serif",
            background: adminPalette.surface,
            color: adminPalette.text,
            border: `1px solid ${adminPalette.border}`,
            padding: "10px 12px",
            width: "100%",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 text-xs uppercase px-5 py-3 w-full"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: adminPalette.surface,
            background: adminPalette.brass,
            letterSpacing: "0.1em",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p
            className="mt-3 text-xs"
            style={{ color: adminPalette.oxblood, fontFamily: "'Inter', sans-serif" }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
