import { SITE_URL } from "@/lib/site";
import { formatPrice } from "@/lib/pieces";

// Wording of the buyer's purchase confirmation email, in English and French.
const TEXT = {
  en: {
    subject: (title) => `Your purchase — ${title}`,
    greetingName: "there",
    thanks: (name) => `Thank you, ${name}`,
    confirmed: "Your purchase is confirmed",
    piece: "Piece",
    amount: "Amount",
    viewInvoice: "View Invoice",
    downloadPdf: "Download PDF",
    delivery: "Delara will be in touch shortly to arrange delivery.",
    hi: (name) => `Hi ${name},`,
    plainThanks: (title, amount) =>
      `Thank you for your purchase of "${title}" (${amount}) from Delara Art Gallery.`,
    plainInvoice: (url) => `View your invoice: ${url}`,
    plainPdf: (url) => `Download PDF: ${url}`,
    fallbackTitle: "your piece",
  },
  fr: {
    subject: (title) => `Votre achat — ${title}`,
    greetingName: "",
    thanks: (name) => (name ? `Merci, ${name}` : "Merci"),
    confirmed: "Votre achat est confirmé",
    piece: "Œuvre",
    amount: "Montant",
    viewInvoice: "Voir la facture",
    downloadPdf: "Télécharger le PDF",
    delivery: "Delara communiquera avec vous sous peu pour organiser la livraison.",
    hi: (name) => (name ? `Bonjour ${name},` : "Bonjour,"),
    plainThanks: (title, amount) =>
      `Merci pour votre achat de « ${title} » (${amount}) auprès de Delara Art Gallery.`,
    plainInvoice: (url) => `Voir votre facture : ${url}`,
    plainPdf: (url) => `Télécharger le PDF : ${url}`,
    fallbackTitle: "votre œuvre",
  },
};

// Escapes text placed into the HTML email (buyer names come from Stripe
// checkout, so they're whatever the buyer typed).
function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Builds { subject, html, text } for the buyer's confirmation email in
// `lang` ("en" or "fr"). `piece` should already be localized.
export function buildBuyerEmail({ lang, buyerName, piece, pieceId, amountCents, invoiceHostedUrl, invoicePdfUrl }) {
  const t = TEXT[lang === "fr" ? "fr" : "en"];
  const name = buyerName || t.greetingName;
  const title = piece?.title?.trim() || pieceId || t.fallbackTitle;
  const amount = formatPrice(amountCents, lang);
  const image = piece?.images?.[0] ? new URL(piece.images[0], SITE_URL).toString() : null;
  const logoUrl = `${SITE_URL}/images/logo-gold.png`;

  const html = `
  <div lang="${lang === "fr" ? "fr" : "en"}" style="background:#F5F1E8;padding:40px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E5DDC8;">
      <div style="text-align:center;padding:36px 32px 0;">
        <img src="${logoUrl}" alt="Delara Ahmadi Darani" width="150" style="height:auto;display:inline-block;" />
      </div>
      <div style="padding:24px 32px 0;text-align:center;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:22px;color:#1B1917;margin:0 0 6px;">
          ${esc(t.thanks(name))}
        </h1>
        <p style="font-size:13px;color:#6E6656;margin:0 0 28px;">${t.confirmed}</p>
      </div>

      ${image ? `<img src="${esc(image)}" alt="${esc(title)}" style="width:100%;display:block;" />` : ""}

      <div style="padding:24px 32px;border-top:1px solid #E5DDC8;border-bottom:1px solid #E5DDC8;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#B08D57;margin-bottom:4px;">
          ${t.piece}
        </div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1B1917;margin-bottom:14px;">
          ${esc(title)}
        </div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#B08D57;margin-bottom:4px;">
          ${t.amount}
        </div>
        <div style="font-size:15px;color:#1B1917;">${esc(amount)}</div>
      </div>

      <div style="padding:28px 32px;text-align:center;">
        ${
          invoiceHostedUrl
            ? `<a href="${esc(invoiceHostedUrl)}" style="display:inline-block;background:#B08D57;color:#1B1917;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:4px;">${t.viewInvoice}</a>`
            : ""
        }
        ${
          invoicePdfUrl
            ? `<a href="${esc(invoicePdfUrl)}" style="display:inline-block;background:#ffffff;border:1px solid #B08D57;color:#1B1917;text-decoration:none;padding:11px 21px;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:4px;">${t.downloadPdf}</a>`
            : ""
        }
      </div>

      <p style="padding:0 32px;font-size:13px;color:#6E6656;text-align:center;line-height:1.6;">
        ${t.delivery}
      </p>

      <div style="text-align:center;margin-top:8px;padding:24px 32px 32px;border-top:1px solid #E5DDC8;font-size:11px;color:#8A857C;">
        — Delara Art Gallery<br />
        <a href="mailto:Ahmadi.delara@gmail.com" style="color:#8A857C;">Ahmadi.delara@gmail.com</a>
      </div>
    </div>
  </div>`;

  const text = [
    t.hi(name),
    "",
    t.plainThanks(title, amount),
    "",
    invoiceHostedUrl ? t.plainInvoice(invoiceHostedUrl) : null,
    invoicePdfUrl ? t.plainPdf(invoicePdfUrl) : null,
    invoiceHostedUrl || invoicePdfUrl ? "" : null,
    t.delivery,
    "",
    "— Delara Art Gallery",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: t.subject(title), html, text };
}
