import Image from "next/image";
import { palette } from "@/lib/palette";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer
      className="px-8 py-12 flex flex-col sm:flex-row justify-between gap-8"
      style={{ borderTop: `1px solid rgba(184,141,87,0.15)` }}
    >
      <div>
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-mono.png"
            alt="Delara Ahmadi Darani monogram"
            width={140}
            height={75}
            style={{ height: 32, width: "auto" }}
          />
          <span
            style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }}
          >
            Delara Art Gallery
          </span>
        </div>
        <div
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
          className="text-xs mt-2"
        >
          Viewings by appointment · Est. 2007
        </div>
      </div>

      <div
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.smoke }}
        className="text-xs uppercase tracking-wide"
      >
        <div className="mb-2" style={{ color: palette.brass, letterSpacing: "0.1em" }}>
          Contact
        </div>
        <div className="normal-case" style={{ color: palette.bone }}>
          Delara Ahmadi Darani
        </div>
        <div className="normal-case mt-1">
          <a href="tel:+15149520150" style={{ color: palette.smoke, textDecoration: "none" }}>
            +1 514 952 0150
          </a>
        </div>
        <div className="normal-case mt-1">
          <a
            href="mailto:Ahmadi.delara@gmail.com"
            style={{ color: palette.smoke, textDecoration: "none" }}
          >
            Ahmadi.delara@gmail.com
          </a>
        </div>
        <SocialLinks className="mt-3" />
      </div>
    </footer>
  );
}
