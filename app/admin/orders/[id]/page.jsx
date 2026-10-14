import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrder, orderUrl } from "@/lib/ordersStore";
import { formatPrice } from "@/lib/pieces";
import { adminPalette } from "@/lib/palette";
import { SITE_URL } from "@/lib/site";
import { STATUS_LABELS, formatAdminDate } from "@/lib/orderAdmin";
import OrderStatusPill from "@/components/admin/OrderStatusPill";
import OrderUpdateForm from "@/components/admin/OrderUpdateForm";
import OrderPrivateNote from "@/components/admin/OrderPrivateNote";
import CopyLinkButton from "@/components/admin/CopyLinkButton";

export const dynamic = "force-dynamic";

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sans = { fontFamily: "'Inter', sans-serif" };
const card = { background: adminPalette.surface, border: `1px solid ${adminPalette.border}` };

function Label({ children, className = "" }) {
  return (
    <div className={`text-[10px] uppercase mb-2.5 ${className}`} style={{ ...mono, color: adminPalette.muted, letterSpacing: "0.14em" }}>
      {children}
    </div>
  );
}

export default async function AdminOrderPage({ params }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const link = orderUrl(order, SITE_URL);
  const ship = order.shipping;
  const stripeUrl = order.stripePaymentIntent ? `https://dashboard.stripe.com/payments/${order.stripePaymentIntent}` : null;
  const history = [...(order.history || [])].reverse();

  return (
    <div style={{ background: adminPalette.bg, minHeight: "100vh", color: adminPalette.text }} className="px-4 sm:px-10 py-8 sm:py-10">
      <Link href="/admin/orders" className="inline-block py-2 text-[11px] uppercase" style={{ ...mono, color: "#8A6A35", letterSpacing: "0.12em", textDecoration: "none" }}>
        ← All orders
      </Link>

      <div className="mt-3 flex items-center gap-4 sm:gap-5">
        <div className="relative shrink-0 overflow-hidden w-16 h-[78px] sm:w-[72px] sm:h-[88px]" style={{ borderRadius: "100px 100px 0 0", background: adminPalette.surface }}>
          {order.pieceImage && <Image src={order.pieceImage} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] sm:text-[11px] uppercase" style={{ ...mono, color: adminPalette.muted, letterSpacing: "0.12em" }}>
            Order {order.id} · {formatAdminDate(order.createdAt)}
            {order.source === "manual" ? " · added manually" : ""}
          </div>
          <h1 className="mt-1 text-2xl sm:text-[34px] leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
            {order.pieceTitle || "—"}
          </h1>
          <div className="mt-1.5 sm:hidden">
            <OrderStatusPill status={order.status} />
          </div>
        </div>
        <div className="hidden sm:block">
          <OrderStatusPill status={order.status} />
        </div>
      </div>

      <div className="mt-6 sm:mt-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-4 lg:gap-6 items-start">
        <div className="flex flex-col gap-4">
          <section className="p-[18px] sm:p-7" style={card}>
            <h2 className="text-xl sm:text-[22px] mb-4 sm:mb-5" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              Update status
            </h2>
            <OrderUpdateForm order={order} />
          </section>

          <section className="p-[18px] sm:p-7 order-last lg:order-none" style={card}>
            <Label>History</Label>
            <ol className="flex flex-col gap-3 text-[13px]" style={sans}>
              {history.map((h, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="sm:w-32 shrink-0 text-[10px] sm:text-[11px] uppercase" style={{ ...mono, color: adminPalette.muted }}>
                    {formatAdminDate(h.at, true)}
                  </span>
                  <span>
                    {STATUS_LABELS[h.status] || h.status}
                    {h.note ? ` — ${h.note}` : ""}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="p-[18px] sm:p-6" style={card}>
            <Label>Buyer</Label>
            <div className="text-sm leading-[1.7]" style={sans}>
              {order.buyer?.name || "—"}
              {order.buyer?.email && (
                <>
                  <br />
                  <a href={`mailto:${order.buyer.email}`} style={{ color: "#8A6A35" }} className="break-all">
                    {order.buyer.email}
                  </a>
                </>
              )}
              {order.buyer?.phone && (
                <>
                  <br />
                  <a href={`tel:${order.buyer.phone}`} style={{ color: adminPalette.text }}>{order.buyer.phone}</a>
                </>
              )}
            </div>
            {ship && (ship.line1 || ship.city) && (
              <>
                <Label className="mt-4">Ship to</Label>
                <div className="text-sm leading-[1.7]" style={sans}>
                  {ship.name && <>{ship.name}<br /></>}
                  {ship.line1}
                  {ship.line2 ? `, ${ship.line2}` : ""}
                  <br />
                  {[ship.city, ship.state, ship.postal_code].filter(Boolean).join(", ")}
                  {ship.country && <><br />{ship.country}</>}
                </div>
              </>
            )}
            <div className="mt-3 text-[11px]" style={{ ...mono, color: adminPalette.muted }}>
              Emails to the buyer are in {order.lang === "fr" ? "French" : "English"}.
            </div>
          </section>

          <section className="p-[18px] sm:p-6" style={card}>
            <Label>Payment</Label>
            <div className="flex justify-between gap-3 text-sm" style={mono}>
              <span>{order.amountCents != null ? `${formatPrice(order.amountCents)} USD` : "—"}</span>
              <span style={{ color: "#2F5A2A" }}>{order.source === "stripe" ? "Paid via Stripe" : "Recorded manually"}</span>
            </div>
            {stripeUrl && (
              <a
                href={stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 py-2 text-[11px] uppercase"
                style={{ ...mono, color: "#8A6A35", letterSpacing: "0.1em", textDecoration: "none" }}
              >
                View in Stripe ↗
              </a>
            )}
          </section>

          <section className="p-[18px] sm:p-6" style={card}>
            <Label>Buyer&apos;s private tracking link</Label>
            <CopyLinkButton url={link} />
            <p className="mt-2.5 text-xs leading-normal" style={{ ...sans, color: adminPalette.muted }}>
              {order.source === "stripe"
                ? "Already sent to the buyer and to you in the order emails. Anyone with this link can see the order, so only share it with the buyer."
                : "Sent to the buyer whenever you email them an update. Anyone with this link can see the order, so only share it with the buyer."}
            </p>
          </section>

          <section className="p-[18px] sm:p-6" style={card}>
            <Label>Private note (only admin sees this)</Label>
            <OrderPrivateNote orderId={order.id} initialNote={order.privateNote || ""} />
          </section>
        </div>
      </div>
    </div>
  );
}
