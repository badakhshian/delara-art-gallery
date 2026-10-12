import { palette } from "@/lib/palette";

import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/site";
const WHATSAPP_URL = "https://wa.me/15149520150";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.2 21.8v-7.3h2.4l.4-2.8h-2.8V9.9c0-.8.25-1.4 1.4-1.4H16V6c-.25 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8v2.8h2.4v7.3"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.86-1.27A9.5 9.5 0 1 0 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.3 8.6c.15-.6.7-1 1.3-1h.5c.3 0 .55.2.65.5l.6 1.6c.1.3 0 .6-.2.8l-.6.6c-.15.15-.2.4-.1.6.4.8 1.4 1.8 2.2 2.2.2.1.45.05.6-.1l.6-.6c.2-.2.5-.3.8-.2l1.6.6c.3.1.5.35.5.65v.5c0 .6-.4 1.15-1 1.3-1.6.4-4-.2-6-2.2s-2.6-4.4-2.2-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SocialLinks({ className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        style={{ color: palette.smoke }}
        className="hover:opacity-80"
      >
        <InstagramIcon />
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        style={{ color: palette.smoke }}
        className="hover:opacity-80"
      >
        <FacebookIcon />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{ color: palette.smoke }}
        className="hover:opacity-80"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
