import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { list, put } from "@vercel/blob";

// Orders (buyer names, emails, addresses) are kept in one file on Vercel
// Blob. The Blob store is public, so the file is encrypted with AES-256-GCM
// using ORDERS_KEY (a long random secret set in Vercel's environment
// variables — never change it, or saved orders can no longer be read).
//
// For local development only, ORDERS_LOCAL_FILE=<path> keeps orders in a
// plain local file instead of Blob.

const ORDERS_BLOB_PATH = "data/orders.enc.json";

export const ORDER_STATUSES = [
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "pickup",
  "hand_delivered",
  "cancelled",
];

export const CARRIERS = {
  canada_post: {
    name: "Canada Post",
    url: (n, lang) =>
      `https://www.canadapost-postescanada.ca/track-reperage/${lang === "fr" ? "fr" : "en"}#/search?searchFor=${encodeURIComponent(n)}`,
  },
  purolator: {
    name: "Purolator",
    url: (n) => `https://www.purolator.com/en/shipping/tracker?pin=${encodeURIComponent(n)}`,
  },
  ups: { name: "UPS", url: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}` },
  fedex: { name: "FedEx", url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}` },
  other: { name: "Other", url: () => null },
};

// Link to the carrier's tracking page, or the link typed in the admin for "Other".
export function trackingUrl(order) {
  if (!order?.trackingNumber && !order?.trackingLink) return null;
  if (order.carrier === "other" || !CARRIERS[order.carrier]) return order.trackingLink || null;
  return CARRIERS[order.carrier].url(order.trackingNumber, order.lang);
}

function encryptionKey() {
  const secret = process.env.ORDERS_KEY;
  if (!secret) throw new Error("ORDERS_KEY is not set.");
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(orders) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(orders), "utf8"), cipher.final()]);
  return JSON.stringify({
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  });
}

function decrypt(text) {
  const box = JSON.parse(text);
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(box.iv, "base64"));
  decipher.setAuthTag(Buffer.from(box.tag, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(box.data, "base64")), decipher.final()]);
  return JSON.parse(plain.toString("utf8"));
}

// Unlike the other stores this never falls back to an empty list on a read
// error: saving after a failed read would wipe every order.
export async function getOrders() {
  const localFile = process.env.ORDERS_LOCAL_FILE;
  if (localFile) {
    try {
      return JSON.parse(await fs.readFile(localFile, "utf8"));
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  const { blobs } = await list({ prefix: ORDERS_BLOB_PATH });
  const match = blobs.find((b) => b.pathname === ORDERS_BLOB_PATH);
  if (!match) return [];
  // The upload time in the URL makes each saved version its own CDN entry,
  // so a read right after a save never gets the previous version.
  const version = new Date(match.uploadedAt).getTime();
  const res = await fetch(`${match.url}?v=${version}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch orders blob: ${res.status}`);
  return decrypt(await res.text());
}

async function saveOrders(orders) {
  const localFile = process.env.ORDERS_LOCAL_FILE;
  if (localFile) {
    await fs.writeFile(localFile, JSON.stringify(orders, null, 2));
    return;
  }
  await put(ORDERS_BLOB_PATH, encrypt(orders), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export async function getOrder(id) {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export async function getOrderByToken(token) {
  if (typeof token !== "string" || token.length < 20) return null;
  const orders = await getOrders();
  return orders.find((o) => safeEqual(o.token, token)) || null;
}

// For the "Track an order" form: order number + the buyer's email.
export async function findOrderForLookup(orderNumber, email) {
  // Accepts "AD-0014", "ad 14", "#14", "14"…
  const digits = String(orderNumber || "").trim().toUpperCase().match(/^#?(?:AD)?[\s-]*(\d{1,6})$/);
  const normalizedId = digits ? `AD-${digits[1].padStart(4, "0")}` : "";
  const mail = String(email || "").trim().toLowerCase();
  if (!normalizedId || !mail) return null;
  const orders = await getOrders();
  return (
    orders.find(
      (o) => o.id === normalizedId && o.buyer?.email && safeEqual(o.buyer.email.toLowerCase(), mail)
    ) || null
  );
}

function nextOrderId(orders) {
  const max = orders.reduce((m, o) => Math.max(m, parseInt(String(o.id).replace(/\D/g, ""), 10) || 0), 0);
  return `AD-${String(max + 1).padStart(4, "0")}`;
}

// Creates an order and returns it. `fields` holds everything except id,
// token, createdAt and history. When `fields.stripeSessionId` matches an
// existing order (a Stripe retry), that order is returned unchanged.
export async function createOrder(fields) {
  const orders = await getOrders();
  if (fields.stripeSessionId) {
    const existing = orders.find((o) => o.stripeSessionId === fields.stripeSessionId);
    if (existing) return existing;
  }
  const now = new Date().toISOString();
  const status = ORDER_STATUSES.includes(fields.status) ? fields.status : "paid";
  const order = {
    carrier: "",
    trackingNumber: "",
    trackingLink: "",
    noteToBuyer: "",
    privateNote: "",
    ...fields,
    id: nextOrderId(orders),
    token: crypto.randomBytes(24).toString("base64url"),
    createdAt: now,
    status,
    history: [{ at: now, status, note: fields.source === "manual" ? "Added manually" : "Paid via Stripe" }],
  };
  orders.push(order);
  await saveOrders(orders);
  return order;
}

// Applies `changes` to an order. A status change is added to its history
// (with `historyNote`). Returns the updated order, or null if not found.
export async function updateOrder(id, changes, historyNote = "") {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const before = orders[index];
  const after = { ...before, ...changes, id: before.id, token: before.token, createdAt: before.createdAt };
  if (changes.status && changes.status !== before.status) {
    after.history = [...(before.history || []), { at: new Date().toISOString(), status: changes.status, note: historyNote }];
  } else if (historyNote) {
    after.history = [...(before.history || []), { at: new Date().toISOString(), status: after.status, note: historyNote }];
  }
  orders[index] = after;
  await saveOrders(orders);
  return after;
}

export function orderUrl(order, siteUrl, lang = order?.lang) {
  return `${siteUrl}${lang === "fr" ? "/fr" : ""}/order/${order.token}`;
}
