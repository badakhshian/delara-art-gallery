import { palette } from "@/lib/palette";

import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/site";

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
    </div>
  );
}
