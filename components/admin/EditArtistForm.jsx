"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminPalette } from "@/lib/palette";
import { resizeImageFile } from "@/lib/imageResize";

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  background: adminPalette.surface,
  color: adminPalette.text,
  border: `1px solid ${adminPalette.border}`,
  padding: "10px 12px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  color: adminPalette.muted,
  letterSpacing: "0.08em",
};

export default function EditArtistForm({ artist }) {
  const router = useRouter();
  const [name, setName] = useState(artist.name || "");
  const [bioText, setBioText] = useState((artist.bio || []).join("\n\n"));
  const [photo, setPhoto] = useState(artist.photo || "");
  const [newFile, setNewFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSaved(false);

    try {
      let photoUrl = photo;

      if (newFile) {
        const resized = await resizeImageFile(newFile);
        const formData = new FormData();
        formData.append("file", resized);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Photo upload failed.");
        photoUrl = data.url;
      }

      const bio = bioText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/artist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, photo: photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save changes.");

      setPhoto(photoUrl);
      setNewFile(null);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
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
          Bio (separate paragraphs with a blank line)
        </label>
        <textarea
          rows={12}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {photo && (
        <div>
          <label className="text-xs uppercase block mb-2" style={labelStyle}>
            Current photo
          </label>
          <div style={{ position: "relative", width: 140, height: 176 }}>
            <Image src={photo} alt={name} fill sizes="140px" style={{ objectFit: "cover" }} />
          </div>
        </div>
      )}

      <div>
        <label className="text-xs uppercase block mb-2" style={labelStyle}>
          Replace photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewFile(e.target.files?.[0] || null)}
          style={{ ...inputStyle, padding: "8px" }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="text-xs uppercase px-5 py-3 self-start"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: adminPalette.text,
          background: adminPalette.brass,
          letterSpacing: "0.1em",
          border: "none",
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Saving…" : "Save changes"}
      </button>

      {saved && (
        <p className="text-xs" style={{ color: adminPalette.brass, fontFamily: "'Inter', sans-serif" }}>
          Saved.
        </p>
      )}
      {error && (
        <p className="text-xs" style={{ color: adminPalette.oxblood, fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </form>
  );
}
