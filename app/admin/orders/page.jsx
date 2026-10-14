import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/lib/ordersStore";
import { formatPrice } from "@/lib/pieces";
import { adminPalette } from "@/lib/palette";
import { ORDER_FILTERS, formatAdminDate } from "@/lib/orderAdmin";
import AdminTabs from "@/components/admin/AdminTabs";
import LogoutButton from "@/components/admin/LogoutButton";
import OrderStatusPill from "@/components/admin/OrderStatusPill";

export const dynamic = "force-dynamic";

const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export default async function AdminOrdersPage({ searchParams }) {
  let orders = [];
  let loadError = null;
  try {
    orders = await getOrders();
  } catch (err) {
    console.error("Admin orders load error:", err);
    loadError = "Orders could not be loaded. Check that ORDERS_KEY is set in Vercel, then reload.";
  }
  orders = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const filter = ORDER_FILTERS.find((f) => f.key === searchParams?.filter) || ORDER_FILTERS[0];
  const countFor = (f) => (f.statuses ? orders.filter((o) => f.statuses.includes(o.status)).length : orders.length);
  const shown = filter.statuses ? orders.filter((o) => filter.statuses.includes(o.status)) : orders;

  return (
    <div style={{ background: adminPalette.bg, minHeight: "100vh" }} className="px-4 sm:px-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase mb-1" style={{ ...mono, color: adminPalette.brass, letterSpacing: "0.12em" }}>
            Admin
          </div>
          <AdminTabs active="orders" />
        </div>
        <LogoutButton />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.muted }}>
          Every sold piece. Website sales appear here automatically.
        </p>
        <Link
          href="/admin/orders/new"
          className="text-xs uppercase px-4 py-3 text-center"
          style={{ ...mono, color: adminPalette.surface, background: adminPalette.text, letterSpacing: "0.1em", textDecoration: "none" }}
        >
          + Add order manually
        </Link>
      </div>

      <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 text-[10px] sm:text-[11px] uppercase" style={{ ...mono, letterSpacing: "0.08em" }}>
        {ORDER_FILTERS.map((f) => {
          const active = f.key === filter.key;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/orders" : `/admin/orders?filter=${f.key}`}
              className="shrink-0 whitespace-nowrap rounded-full px-4 flex items-center"
              style={{
                height: 36,
                border: `1px solid ${active ? adminPalette.text : adminPalette.border}`,
                background: active ? adminPalette.text : adminPalette.surface,
                color: active ? "#FFFFFF" : adminPalette.text,
                textDecoration: "none",
              }}
            >
              {f.label} · {countFor(f)}
            </Link>
          );
        })}
      </div>

      {loadError && (
        <p className="mt-6 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.oxblood }}>
          {loadError}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5 lg:gap-0 lg:border" style={{ borderColor: adminPalette.border }}>
        <div
          className="hidden lg:grid px-6 py-3 text-[10px] uppercase"
          style={{
            ...mono,
            color: adminPalette.muted,
            letterSpacing: "0.12em",
            background: adminPalette.surface,
            gridTemplateColumns: "64px 110px minmax(0,1.5fr) minmax(0,1.4fr) 120px 110px 170px 16px",
            columnGap: 20,
          }}
        >
          <span />
          <span>Order</span>
          <span>Artwork</span>
          <span>Buyer</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span />
        </div>

        {shown.map((o) => {
          const isNew = o.status === "paid";
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="order-row flex lg:grid items-center gap-3.5 lg:gap-x-5 p-3.5 lg:px-6 border lg:border-0 lg:border-t"
              style={{
                background: isNew ? "#F8EEDB" : adminPalette.surface,
                borderColor: isNew ? "#E2CB9C" : adminPalette.border,
                color: adminPalette.text,
                textDecoration: "none",
              }}
            >
              <div className="relative shrink-0 w-16 h-[76px] lg:h-16" style={{ background: adminPalette.bg }}>
                {o.pieceImage && <Image src={o.pieceImage} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />}
              </div>
              <span className="hidden lg:block text-[13px]" style={mono}>{o.id}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-[17px]" style={{ fontFamily: "'Fraunces', serif" }}>
                  {o.pieceTitle || "—"}
                </div>
                <div className="lg:hidden mt-1 text-[10px] sm:text-[11px]" style={{ ...mono, color: adminPalette.muted }}>
                  {o.id} · {formatAdminDate(o.createdAt)} · {o.amountCents != null ? formatPrice(o.amountCents) : "—"}
                  <span className="hidden sm:inline"> · {o.buyer?.name || "—"}</span>
                </div>
                <div className="lg:hidden mt-2">
                  <OrderStatusPill status={o.status} isNew={isNew} />
                </div>
              </div>
              <div className="hidden lg:block min-w-0 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="truncate">{o.buyer?.name || "—"}</div>
                <div className="truncate text-xs" style={{ color: adminPalette.muted }}>
                  {o.source === "manual" && !o.buyer?.email ? "Manual" : o.buyer?.email}
                </div>
              </div>
              <span className="hidden lg:block text-xs" style={mono}>{formatAdminDate(o.createdAt)}</span>
              <span className="hidden lg:block text-[13px]" style={mono}>
                {o.amountCents != null ? formatPrice(o.amountCents) : "—"}
              </span>
              <span className="hidden lg:block">
                <OrderStatusPill status={o.status} isNew={isNew} />
              </span>
              <span className="text-lg" style={{ color: adminPalette.muted }} aria-hidden="true">›</span>
            </Link>
          );
        })}

        {!loadError && shown.length === 0 && (
          <p className="p-6 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: adminPalette.muted, background: adminPalette.surface }}>
            {orders.length === 0
              ? "No orders yet. When a piece sells on the website, its order appears here."
              : "No orders in this group."}
          </p>
        )}
      </div>
      <style>{`@media (min-width: 1024px) { .order-row { grid-template-columns: 64px 110px minmax(0,1.5fr) minmax(0,1.4fr) 120px 110px 170px 16px; } }`}</style>
    </div>
  );
}
