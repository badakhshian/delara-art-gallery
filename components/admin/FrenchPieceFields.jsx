"use client";

import { adminPalette } from "@/lib/palette";

const FIELDS = [
  { key: "titleFr", label: "Titre (title)", rows: 0 },
  { key: "mediumFr", label: "Technique (medium)", rows: 0 },
  { key: "dimsFr", label: "Dimensions", rows: 0 },
  { key: "storyFr", label: "Histoire (story)", rows: 5 },
];

// French versions of a piece's texts, shown on the French site (/fr/...).
// Any field left empty falls back to the English.
export default function FrenchPieceFields({ values, onChange, inputStyle, labelStyle }) {
  return (
    <fieldset
      className="flex flex-col gap-4 p-4"
      style={{ border: `1px solid ${adminPalette.border}` }}
    >
      <legend className="text-xs uppercase px-2" style={{ ...labelStyle, color: adminPalette.brass }}>
        Français — French site
      </legend>
      <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.muted }}>
        Shown on the French version of the site. Leave a field empty to show the English
        there instead. If you change the English text above, update the French here too.
      </p>
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="text-xs uppercase block mb-2" style={labelStyle}>
            {f.label}
          </label>
          {f.rows ? (
            <textarea
              rows={f.rows}
              lang="fr"
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          ) : (
            <input
              type="text"
              lang="fr"
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
      ))}
    </fieldset>
  );
}
