"use client";

import { adminPalette } from "@/lib/palette";

// One admin field in English and French side by side (stacked on phones).
// The French box shows what the French site displays — saved French or the
// built-in translation — and can always be edited; left empty, the French
// site shows the English.
export default function BilingualField({
  label,
  en,
  fr,
  onEn,
  onFr,
  rows = 0,
  required = false,
  inputStyle,
  labelStyle,
}) {
  const captionStyle = {
    fontFamily: "'IBM Plex Mono', monospace",
    color: adminPalette.muted,
    fontSize: 10,
    letterSpacing: "0.08em",
  };

  const box = (lang, value, onChange) => {
    const common = {
      lang,
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      required: lang === "en" && required,
      // An empty French box shows the English greyed out: that's what the
      // French site displays until a French version is typed in.
      placeholder: lang === "fr" ? en || "" : undefined,
    };
    return rows ? (
      <textarea rows={rows} {...common} style={{ ...inputStyle, resize: "vertical" }} />
    ) : (
      <input type="text" {...common} style={inputStyle} />
    );
  };

  return (
    <div>
      <label className="text-xs uppercase block mb-2" style={labelStyle}>
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="uppercase mb-1" style={captionStyle}>English</div>
          {box("en", en, onEn)}
        </div>
        <div>
          <div className="uppercase mb-1" style={captionStyle}>Français</div>
          {box("fr", fr, onFr)}
        </div>
      </div>
    </div>
  );
}
