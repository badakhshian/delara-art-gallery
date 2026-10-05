// The "From" for all site emails. RESEND_FROM_ADDRESS is usually a bare
// address (visit@artedelara.com), which mail apps show as just "visit", so
// a display name is added: "Delara Art Gallery <visit@artedelara.com>".
// If the variable already includes a name ("Name <address>"), it's used as is.
export const SENDER_NAME = "Delara Art Gallery";

export function senderAddress() {
  const raw = (process.env.RESEND_FROM_ADDRESS || "onboarding@resend.dev").trim();
  return raw.includes("<") ? raw : `${SENDER_NAME} <${raw}>`;
}
