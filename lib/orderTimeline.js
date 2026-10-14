// The steps shown on the buyer's order page, worked out from the order's
// status and history. Safe to import anywhere (no server-only code).

// Shipped orders: paid → preparing → shipped → delivered.
// Picked up at the studio: paid → preparing → ready for pickup → hand-delivered.
// Delivered in person: paid → preparing → hand-delivered.
export function orderSteps(order) {
  const history = order.history || [];
  const seen = new Set(history.map((h) => h.status));
  const status = order.status;

  let path;
  if (status === "pickup" || (seen.has("pickup") && status === "hand_delivered")) {
    path = ["paid", "preparing", "pickup", "hand_delivered"];
  } else if (status === "hand_delivered") {
    path = ["paid", "preparing", "hand_delivered"];
  } else {
    path = ["paid", "preparing", "shipped", "delivered"];
  }

  const currentIndex = path.indexOf(status);
  // When the order last moved into `step` (later "details updated" entries
  // with the same status don't change the date).
  const lastDate = (step) => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].status === step && (i === 0 || history[i - 1].status !== step)) return history[i].at;
    }
    return null;
  };
  const finalStep = path[path.length - 1];

  return path.map((step, i) => ({
    step,
    date: i <= currentIndex ? lastDate(step) : null,
    // The last step, once reached, counts as done rather than "current".
    state: i < currentIndex || (i === currentIndex && step === finalStep) ? "done" : i === currentIndex ? "current" : "upcoming",
  }));
}

export function formatOrderDate(iso, lang, withYear = true) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-US", {
    month: "long",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "America/Toronto",
  });
}
