import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackOrderForm from "@/components/TrackOrderForm";
import { pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";
import { CONTACT_EMAIL } from "@/lib/site";

export function generateMetadata() {
  const { lang, t } = getI18n();
  return pageMetadata({ title: t.meta.trackTitle, description: t.meta.trackDescription, path: "/track", lang });
}

export default function TrackPage() {
  const { t } = getI18n();
  const o = t.order;

  return (
    <div style={{ background: palette.void, minHeight: "100vh", color: palette.bone }}>
      <Header />

      <main className="px-6 pt-36 sm:pt-44 pb-24">
        <div className="w-full max-w-[480px] mx-auto">
          <div
            className="text-[10px] sm:text-[11px] uppercase text-center"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.14em" }}
          >
            {o.lookupEyebrow}
          </div>
          <h1
            className="mt-3 text-center text-[36px] sm:text-[48px] leading-[1.05]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
          >
            {o.lookupTitle}
          </h1>
          <p className="mt-3.5 text-center text-[15px] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#BDB6A8" }}>
            {o.lookupIntro}
          </p>

          <TrackOrderForm />

          <p className="mt-5 text-center text-[13px] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: palette.smoke }}>
            {o.lookupHelp}
            <br />
            {o.needHelp}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: palette.brass, textDecoration: "none" }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
