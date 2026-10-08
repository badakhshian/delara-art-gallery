import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/serverLang";
import { privacyContent } from "@/lib/privacyContent";

export function generateMetadata() {
  const { lang, t } = getI18n();
  return pageMetadata({
    title: t.meta.privacyTitle,
    description: t.meta.privacyDescription,
    path: "/privacy",
    lang,
  });
}

export default function PrivacyPage() {
  const { lang } = getI18n();
  const c = privacyContent[lang] || privacyContent.en;

  const textStyle = { fontFamily: "'Inter', sans-serif", color: palette.smoke };

  return (
    <div style={{ background: palette.void, minHeight: "100vh" }}>
      <Header />

      <div className="relative px-8 pt-40 pb-20">
        <BackButton to="/" />

        <div className="max-w-2xl">
          <h1
            style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 300 }}
            className="text-3xl sm:text-4xl mb-3"
          >
            {c.title}
          </h1>
          <div
            className="text-xs uppercase mb-10"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: palette.brass, letterSpacing: "0.1em" }}
          >
            {c.updated}
          </div>

          <p className="text-sm sm:text-base leading-relaxed mb-10" style={textStyle}>
            {c.intro}
          </p>

          {c.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2
                style={{ fontFamily: "'Fraunces', serif", color: palette.bone, fontWeight: 500 }}
                className="text-lg sm:text-xl mb-3"
              >
                {section.heading}
              </h2>
              {section.body.map((part, i) =>
                Array.isArray(part) ? (
                  <ul key={i} className="list-disc pl-5 mb-3 space-y-2 text-sm sm:text-base leading-relaxed" style={textStyle}>
                    {part.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="mb-3 text-sm sm:text-base leading-relaxed" style={textStyle}>
                    {part}
                  </p>
                )
              )}
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
