import { NextResponse } from "next/server";
import { getOrder, updateOrder, ORDER_STATUSES, CARRIERS } from "@/lib/ordersStore";
import { sendOrderUpdateEmail } from "@/lib/orderNotify";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

// Updates an order from the admin. { kind: "note", privateNote } saves the
// private note only; anything else is a status update, optionally emailed
// to the buyer (notify: true).
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const order = await getOrder(params.id);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (body.kind === "note") {
      const updated = await updateOrder(order.id, { privateNote: clip(body.privateNote, 4000) });
      return NextResponse.json({ order: updated });
    }

    if (!ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    const carrier = body.carrier && CARRIERS[body.carrier] ? body.carrier : "";
    const trackingLink = clip(body.trackingLink, 500);
    if (trackingLink && !/^https?:\/\//i.test(trackingLink)) {
      return NextResponse.json({ error: "The tracking link must start with https://" }, { status: 400 });
    }
    const changes = {
      status: body.status,
      carrier,
      trackingNumber: clip(body.trackingNumber, 80),
      trackingLink: carrier === "other" ? trackingLink : "",
      noteToBuyer: clip(body.noteToBuyer, 1000),
    };

    const merged = { ...order, ...changes };
    let emailed = null;
    if (body.notify) emailed = await sendOrderUpdateEmail(merged);

    const parts = [];
    if (changes.status === "shipped" && (carrier || changes.trackingNumber)) {
      parts.push([CARRIERS[carrier]?.name, changes.trackingNumber].filter(Boolean).join(" "));
    }
    if (emailed?.ok) parts.push("buyer emailed");
    // A status change always goes into the history; a save that only
    // changes details is recorded when the buyer was emailed about it.
    const statusChanged = changes.status !== order.status;
    const historyNote = statusChanged ? parts.join(" · ") : emailed?.ok ? ["Details updated", ...parts].join(" · ") : "";
    const updated = await updateOrder(order.id, changes, historyNote);

    return NextResponse.json({
      order: updated,
      emailed: emailed?.ok || false,
      emailError: emailed && !emailed.ok ? emailed.error : null,
    });
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Could not save the order." }, { status: 500 });
  }
}
