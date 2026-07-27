"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

export default function EditPieceForm({ piece }) {
  const router = useRouter();
  const [title, setTitle] = useState(piece.title || "");
  const [year, setYear] = useState(piece.year || "");
  const [medium, setMedium] = useState(piece.medium || "");
  const [dims, setDims] = useState(piece.dims || "");
  const [price, setPrice] = useState(
    piece.priceCents != null ? (piece.priceCents / 100).toString() : ""
  );
  const [collection, setCollection] = useState(piece.collection || collections[0]?.slug || "");
  const [certificateId, setCertificateId] = useState(piece.certificateId || "");
  const [story, setStory] = useState(piece.story || "");
  const [sold, setSold] = useState(!!piece.sold);
  const [existingImages, setExistingImages] = useState(piece.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function removeExistingImage(url) {
    setExistingImages((imgs) => imgs.filter((i) => i !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const uploadedUrls = [];
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Photo upload failed.");
        uploadedUrls.push(data.url);
      }

      const priceCents = price ? Math.round(parseFloat(price) * 100) : null;

      const res = await fetch("/api/admin/pieces", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: piece.id,
          title,
          year,
          medium,
          dims,
          priceCents,
          images: [...existingImages, ...uploadedUrls],
          collection,
          certificateId,
          story,
          sold,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save changes.");

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
          Edit piece
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

          <label className="flex items-center gap-2 text-xs uppercase" style={labelStyle}>
            <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} />
            Mark as sold
          </label>

          {existingImages.length > 0 && (
            <div>
              <label className="text-xs uppercase block mb-2" style={labelStyle}>
                Current photos
              </label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((url) => (
                  <div key={url} style={{ position: "relative", width: 88, height: 88 }}>
                    <Image
                      src={url}
                      alt="Piece photo"
                      fill
                      sizes="88px"
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: palette.oxblood,
                        color: palette.bone,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        lineHeight: "22px",
                      }}
                      aria-label="Remove this photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs uppercase block mb-2" style={labelStyle}>
              Add more photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewFiles(Array.from(e.target.files))}
              style={{ ...inputStyle, padding: "8px" }}
            />
          </div>

          <div className="flex items-center gap-4">
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
              {submitting ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="text-xs uppercase px-5 py-3"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: palette.smoke,
                background: "none",
                border: `1px solid rgba(184,141,87,0.3)`,
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

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
