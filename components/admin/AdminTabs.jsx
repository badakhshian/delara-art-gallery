import Link from "next/link";
import { adminPalette } from "@/lib/palette";
import { getOrders } from "@/lib/ordersStore";

// Number of orders paid but not yet being prepared — shown on the Orders tab.
async function newOrdersCount() {
  try {
    const orders = await getOrders();
    return orders.filter((o) => o.status === "paid").length;
  } catch {
    return 0;
  }
}

export default async function AdminTabs({ active }) {
  const newOrders = await newOrdersCount();
  const tabStyle = (isActive) => ({
    fontFamily: "'Fraunces', serif",
    fontWeight: isActive ? 400 : 300,
    fontSize: "1.75rem",
    color: isActive ? adminPalette.text : adminPalette.muted,
    textDecoration: "none",
  });

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <Link href="/admin" style={tabStyle(active === "pieces")}>
        Manage pieces
      </Link>
      <Link href="/admin/artist" style={tabStyle(active === "artist")}>
        Artist
      </Link>
      <Link href="/admin/collections" style={tabStyle(active === "collections")}>
        Collections
      </Link>
      <Link href="/admin/orders" style={tabStyle(active === "orders")}>
        Orders
        {newOrders > 0 && (
          <span
            className="ml-2 align-middle inline-block rounded-full text-[11px] px-2 py-0.5"
            style={{
              background: adminPalette.brass,
              color: "#FFFFFF",
              fontFamily: "'IBM Plex Mono', monospace",
              verticalAlign: "4px",
            }}
            aria-label={`${newOrders} new`}
          >
            {newOrders}
          </span>
        )}
      </Link>
    </div>
  );
}
