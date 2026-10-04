// Short, stable fingerprint of a text, ignoring spacing and line breaks.
// Lets a built-in translation recognise whether the English it was made
// from has since been edited (see lib/frenchContent.js).
export function fingerprint(text) {
  const s = (text || "").replace(/\s+/g, " ").trim();
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return `${s.length.toString(36)}-${h.toString(36)}`;
}
