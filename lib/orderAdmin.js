// Labels and colours for orders in the admin. Safe for client components.

export const STATUS_LABELS = {
  paid: "Paid",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  pickup: "Ready for pickup",
  hand_delivered: "Hand-delivered",
  cancelled: "Cancelled / refunded",
};

export const STATUS_PILL = {
  paid: { bg: "#F3E3C3", color: "#7A5A1E" },
  preparing: { bg: "#EFE8F5", color: "#5B3B7A" },
  shipped: { bg: "#DCE7F2", color: "#24496E" },
  pickup: { bg: "#DCE7F2", color: "#24496E" },
  delivered: { bg: "#E1EEDF", color: "#2F5A2A" },
  hand_delivered: { bg: "#E1EEDF", color: "#2F5A2A" },
  cancelled: { bg: "#F2DEDA", color: "#8A2F22" },
};

// Filter chips on the Orders list.
export const ORDER_FILTERS = [
  { key: "all", label: "All", statuses: null },
  { key: "prepare", label: "To prepare", statuses: ["paid"] },
  { key: "ship", label: "To ship", statuses: ["preparing"] },
  { key: "shipped", label: "Shipped", statuses: ["shipped", "pickup"] },
  { key: "done", label: "Done", statuses: ["delivered", "hand_delivered", "cancelled"] },
];

export const CARRIER_OPTIONS = [
  { value: "canada_post", label: "Canada Post" },
  { value: "purolator", label: "Purolator" },
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "other", label: "Other" },
];

export function formatAdminDate(iso, withTime = false) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : { year: "numeric" }),
    timeZone: "America/Toronto",
  });
}
