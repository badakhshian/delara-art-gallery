import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { CARRIERS, trackingUrl, orderUrl } from "@/lib/ordersStore";

// Email sent to the buyer when Delara updates an order's status (and when a
// manual order is added), in English or French.
const TEXT = {
  en: {
    subject: {
      paid: (id, title) => `Your order ${id} — ${title}`,
      preparing: (id, title) => `Your artwork is being prepared — ${title}`,
      shipped: (id, title) => `Your artwork has shipped — ${title}`,
      delivered: (id, title) => `Your artwork has arrived — ${title}`,
      pickup: (id, title) => `Your artwork is ready for pickup — ${title}`,
      hand_delivered: (id, title) => `Your artwork has been delivered — ${title}`,
      cancelled: (id) => `Your order ${id} has been cancelled`,
    },
    update: "Order update",
    hello: (name) => (name ? `Hello ${name},` : "Hello,"),
    body: {
      paid: (title) => `Thank you for your purchase of ${title}. You can follow your order at any time with the link below.`,
      preparing: (title) => `${title} is being carefully packed, with its signed certificate of authenticity.`,
      shipped: (title) => `${title} has left the studio and is on its way to you.`,
      delivered: (title) => `${title} has been delivered. We hope it brings you joy for many years.`,
      pickup: (title) => `${title} is ready for you at the studio. We'll be in touch to arrange a time — or simply reply to this email.`,
      hand_delivered: (title) => `${title} is now in your hands. Thank you, and enjoy it.`,
      cancelled: () => "Your order has been cancelled. If you have any questions, simply reply to this email.",
    },
    carrier: "Carrier",
    trackingNumber: "Tracking number",
    trackPackage: "Track package →",
    viewOrder: "View your order →",
    linkNote: "This private link always shows the latest status.",
    fromDelara: "— Delara",
    statusLabel: {
      paid: "Confirmed",
      preparing: "Preparing",
      shipped: "Shipped",
      delivered: "Delivered",
      pickup: "Ready for pickup",
      hand_delivered: "Hand-delivered",
      cancelled: "Cancelled",
    },
    orderLabel: "Order",
  },
  fr: {
    subject: {
      paid: (id, title) => `Votre commande ${id} — ${title}`,
      preparing: (id, title) => `Votre œuvre est en préparation — ${title}`,
      shipped: (id, title) => `Votre œuvre a été expédiée — ${title}`,
      delivered: (id, title) => `Votre œuvre est arrivée — ${title}`,
      pickup: (id, title) => `Votre œuvre est prête à être récupérée — ${title}`,
      hand_delivered: (id, title) => `Votre œuvre vous a été remise — ${title}`,
      cancelled: (id) => `Votre commande ${id} a été annulée`,
    },
    update: "Mise à jour de la commande",
    hello: (name) => (name ? `Bonjour ${name},` : "Bonjour,"),
    body: {
      paid: (title) => `Merci pour votre achat de ${title}. Vous pouvez suivre votre commande en tout temps avec le lien ci-dessous.`,
      preparing: (title) => `${title} est emballée avec soin, avec son certificat d’authenticité signé.`,
      shipped: (title) => `${title} a quitté l’atelier et est en route vers vous.`,
      delivered: (title) => `${title} vous a été livrée. Nous espérons qu’elle vous apportera de la joie pendant de nombreuses années.`,
      pickup: (title) => `${title} vous attend à l’atelier. Nous vous écrirons pour convenir d’un moment — ou répondez simplement à ce courriel.`,
      hand_delivered: (title) => `${title} est maintenant entre vos mains. Merci, et bonne contemplation.`,
      cancelled: () => "Votre commande a été annulée. Pour toute question, répondez simplement à ce courriel.",
    },
    carrier: "Transporteur",
    trackingNumber: "Numéro de suivi",
    trackPackage: "Suivre le colis →",
    viewOrder: "Voir votre commande →",
    linkNote: "Ce lien privé affiche toujours l’état le plus récent.",
    fromDelara: "— Delara",
    statusLabel: {
      paid: "Confirmée",
      preparing: "En préparation",
      shipped: "Expédiée",
      delivered: "Livrée",
      pickup: "Prête à récupérer",
      hand_delivered: "Remise en main propre",
      cancelled: "Annulée",
    },
    orderLabel: "Commande",
  },
};

function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// `title` and `image` are the piece's (already localized) title and first
// photo. Returns { subject, html, text }.
export function buildOrderUpdateEmail({ order, title, image }) {
  const lang = order.lang === "fr" ? "fr" : "en";
  const t = TEXT[lang];
  const status = t.subject[order.status] ? order.status : "paid";
  const firstName = (order.buyer?.name || "").split(" ")[0];
  const link = orderUrl(order, SITE_URL);
  const track = status === "shipped" ? trackingUrl(order) : null;
  const carrierName = order.carrier ? CARRIERS[order.carrier]?.name || order.carrier : "";
  const showShipping = status === "shipped" && (carrierName || order.trackingNumber);
  const imageUrl = image ? new URL(image, SITE_URL).toString() : null;
  const body = t.body[status](lang === "fr" ? `« ${title} »` : title);
  const logoUrl = `${SITE_URL}/images/logo-gold.png`;

  const mono = "font-family:'Courier New',Courier,monospace;";
  const serif = "font-family:Georgia,'Times New Roman',serif;";
  const sans = "font-family:Helvetica,Arial,sans-serif;";

  const html = `
  <div lang="${lang}" style="background:#0E0D0C;padding:32px 12px;">
    <div style="max-width:560px;margin:0 auto;background:#0E0D0C;color:#E8E3D8;padding:8px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><img src="${logoUrl}" alt="Delara Ahmadi Darani" width="96" style="height:auto;display:block;" /></td>
        <td align="right" style="${mono}font-size:11px;letter-spacing:2px;color:#8A857C;text-transform:uppercase;">${t.orderLabel} ${esc(order.id)}</td>
      </tr></table>

      <div style="margin-top:36px;${mono}font-size:11px;letter-spacing:2px;color:#B08D57;text-transform:uppercase;">${t.update} · ${t.statusLabel[status]}</div>
      <h1 style="margin:10px 0 0;${serif}font-weight:400;font-size:30px;line-height:1.15;color:#E8E3D8;">${esc(t.subject[status](order.id, title).split(" — ")[0])}</h1>
      <p style="margin:16px 0 0;${sans}font-size:15px;line-height:1.6;color:#BDB6A8;">${esc(t.hello(firstName))}<br />${esc(body)}</p>

      ${imageUrl ? `<img src="${esc(imageUrl)}" alt="${esc(title)}" width="240" style="display:block;margin-top:28px;width:240px;max-width:100%;height:auto;border-radius:240px 240px 0 0;" />` : ""}

      ${
        showShipping
          ? `<div style="margin-top:24px;padding:18px 20px;background:#1B1917;${mono}font-size:13px;line-height:1.8;color:#E8E3D8;">
              ${carrierName ? `<div style="color:#8A857C;font-size:11px;text-transform:uppercase;letter-spacing:1px;">${t.carrier}</div><div>${esc(carrierName)}</div>` : ""}
              ${order.trackingNumber ? `<div style="color:#8A857C;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:6px;">${t.trackingNumber}</div><div>${esc(order.trackingNumber)}</div>` : ""}
              ${track ? `<a href="${esc(track)}" style="display:inline-block;margin-top:14px;background:#B08D57;color:#0E0D0C;text-decoration:none;padding:12px 18px;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${t.trackPackage}</a>` : ""}
            </div>`
          : ""
      }

      ${
        order.noteToBuyer && status !== "cancelled"
          ? `<div style="margin-top:24px;padding:16px 20px;background:#1B1917;border-left:2px solid #B08D57;${sans}font-size:14px;line-height:1.6;color:#BDB6A8;">
              “${esc(order.noteToBuyer)}”<br /><span style="${mono}font-size:11px;letter-spacing:1px;color:#8A857C;">${t.fromDelara}</span>
            </div>`
          : ""
      }

      <a href="${esc(link)}" style="display:block;margin-top:28px;border:1px solid #B08D57;color:#B08D57;text-decoration:none;padding:16px;text-align:center;${mono}font-size:12px;letter-spacing:2px;text-transform:uppercase;">${t.viewOrder}</a>
      <p style="margin:12px 0 0;${sans}font-size:12px;color:#8A857C;text-align:center;">${t.linkNote}</p>

      <div style="margin-top:36px;padding-top:18px;border-top:1px solid #2E2B27;${mono}font-size:11px;line-height:1.9;color:#8A857C;">
        Delara Ahmadi Darani · Montréal<br />
        <a href="mailto:${CONTACT_EMAIL}" style="color:#B08D57;text-decoration:none;">${CONTACT_EMAIL}</a> · +1 647 873 9585
      </div>
    </div>
  </div>`;

  const text = [
    t.hello(firstName),
    "",
    body,
    "",
    showShipping && carrierName ? `${t.carrier}: ${carrierName}` : null,
    showShipping && order.trackingNumber ? `${t.trackingNumber}: ${order.trackingNumber}` : null,
    track ? `${t.trackPackage.replace(" →", "")}: ${track}` : null,
    showShipping ? "" : null,
    order.noteToBuyer && status !== "cancelled" ? `“${order.noteToBuyer}” ${t.fromDelara}` : null,
    order.noteToBuyer && status !== "cancelled" ? "" : null,
    `${t.viewOrder.replace(" →", "")}: ${link}`,
    "",
    "— Delara Art Gallery",
    CONTACT_EMAIL,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: t.subject[status](order.id, title), html, text };
}
