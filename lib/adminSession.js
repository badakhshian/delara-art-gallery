// The admin login cookie holds a token derived from ADMIN_PASSWORD (an
// HMAC), never the password itself. Changing the password invalidates every
// existing login. Uses Web Crypto so it runs in both middleware and routes.

const MESSAGE = "delara-art-gallery admin session v1";

export async function adminSessionToken(password = process.env.ADMIN_PASSWORD) {
  if (!password) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(MESSAGE));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time string comparison.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidAdminSession(cookieValue) {
  const expected = await adminSessionToken();
  return !!expected && safeEqual(cookieValue, expected);
}
