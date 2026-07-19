import "./globals.css";

export const metadata = {
  title: "Delara Art Gallery",
  description:
    "Original mixed-media works by Delara Ahmadi Darani — acrylic and modelling paste built up into raised, textured surfaces. One piece at a time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
