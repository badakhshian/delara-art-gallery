import { STATUS_LABELS, STATUS_PILL } from "@/lib/orderAdmin";

export default function OrderStatusPill({ status, isNew = false }) {
  const c = STATUS_PILL[status] || STATUS_PILL.paid;
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full uppercase text-[9px] sm:text-[10px] px-2.5 py-1"
      style={{ background: c.bg, color: c.color, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}
    >
      {isNew ? "● " : ""}
      {STATUS_LABELS[status] || status}
      {isNew ? " — new" : ""}
    </span>
  );
}
