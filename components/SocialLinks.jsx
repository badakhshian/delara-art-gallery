import { palette } from "@/lib/palette";

const INSTAGRAM_URL = "https://www.instagram.com/delara_art_gallery/";
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
