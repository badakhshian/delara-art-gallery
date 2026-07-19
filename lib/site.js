// Used to build absolute links (QR codes need a full URL, not a relative one).
// Set NEXT_PUBLIC_SITE_URL in your environment once the domain is connected —
// see .env.example. Falls back to artedelara.com so it still works if you
// forget to set it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://artedelara.com";
