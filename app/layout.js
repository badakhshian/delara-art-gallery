import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import { SITE_URL } from "@/lib/site";
import { SITE_NAME } from "@/lib/seo";
import { getLang } from "@/lib/serverLang";
import { LangProvider } from "@/components/LangProvider";

const DESCRIPTION =
  "Original mixed-media works by Delara Ahmadi Darani — acrylic and modelling paste built up into raised, textured surfaces. One piece at a time.";

// Site-wide defaults; pages override title, description and images. The
// share image here is only a fallback for pages without their own.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_CA",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [{ url: "/images/RuedaDeLaVida1.JPG", alt: "wheel of Soaring by Delara Ahmadi Darani" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/images/RuedaDeLaVida1.JPG"],
  },
};

export default function RootLayout({ children }) {
  const lang = getLang();
  return (
    <html lang={lang}>
      <body>
        <CustomCursor />
        <LangProvider lang={lang}>
          <PageTransition>{children}</PageTransition>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
