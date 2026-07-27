"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";
import { collections } from "@/lib/collections";

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

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPiecePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [medium, setMedium] = useState("Acrylic and modelling paste on canvas");
  const [dims, setDims] = useState("");
  const [price, setPrice] = useState("");
  const [collection, setCollection] = useState(collections[0]?.slug || "");
  const [certificateId, setCertificateId] = useState("");
  const [story, setStory] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Photo upload failed.");
        uploadedUrls.push(data.url);
      }

      const priceCents = price ? Math.round(parseFloat(price) * 100) : null;

      const res = await fetch("/api/admin/pieces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: slugify(title),
          title,
          year,
          medium,
          dims,
          priceCents,
          images: uploadedUrls,
          collection,
          certificateId,
          story,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add the piece.");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }} className="px-6 sm:px-14 py-14">
      <div className="max-w-2xl mx-auto">
        <div className="text-xs uppercase mb-3" style={{ ...labelStyle, color: palette.brass }}>
          Admin
        </div>
        <h1
          style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
          className="text-2xl mb-8"
        >
          Add a new piece
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Year
            </label>
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Medium
            </label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Dimensions
            </label>
            <input
              type="text"
              placeholder="e.g. 48 x 48 in"
              value={dims}
              onChange={(e) => setDims(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Price in USD (leave blank for "Inquire for price")
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 4200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Collection
            </label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              style={{ ...inputStyle, appearance: "auto" }}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Certificate ID
            </label>
            <input
              type="text"
              placeholder="e.g. ADG-0007"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Story
            </label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              style={{ ...inputStyle, padding: "8px" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="text-xs uppercase px-5 py-3 self-start"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.void,
              background: palette.brass,
              letterSpacing: "0.1em",
              border: "none",
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Adding…" : "Add piece"}
          </button>

          {error && (
            <p className="text-xs" style={{ color: palette.oxblood, fontFamily: "'Inter', sans-serif" }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
