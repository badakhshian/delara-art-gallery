import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { palette } from "@/lib/palette";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getI18n } from "@/lib/serverLang";
import { getOrderByToken, trackingUrl, CARRIERS } from "@/lib/ordersStore";
import { getPiece } from "@/lib/piecesStore";
import { localizePiece } from "@/lib/localize";
import { formatPrice } from "@/lib/pieces";
import { orderSteps, formatOrderDate } from "@/lib/orderTimeline";
import { CONTACT_EMAIL } from "@/lib/site";

export const dynamic = "force-dynamic";

// The buyer's private order page. The link (with its long random token) is
// sent to the buyer and to Delara; it is never listed or indexed.
export function generateMetadata() {
  const { t } = getI18n();
  return { title: t.meta.orderTitle, robots: { index: false, follow: false } };
}

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const label = { ...mono, color: palette.brass, letterSpacing: "0.14em" };

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2.5 6.2 5 8.5l4.5-5" />
    </svg>
  );
}

function Dot({ state }) {
  if (state === "done") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 22, height: 22, background: palette.brass, color: palette.void }}
      >
        <Check />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 22, height: 22, border: `2px solid ${palette.brass}` }}
      >
        <div className="rounded-full" style={{ width: 8, height: 8, background: palette.brass }} />
      </div>
    );
  }
  return <div className="rounded-full shrink-0" style={{ width: 22, height: 22, border: "2px solid rgba(232,227,216,0.3)" }} />;
}

export default async function OrderPage({ params }) {
  const { lang, t, href } = getI18n();
  const order = await getOrderByToken(params.token);
  if (!order) notFound();

  const o = t.order;
  const piece = order.pieceId ? localizePiece(await getPiece(order.pieceId), lang) : null;
  const title = piece?.title || order.pieceTitle;
  const image = piece?.images?.[0] || order.pieceImage || null;
  const details = [piece?.year, piece?.medium?.trim()].filter(Boolean).join(" · ");
  const amount = order.amountCents != null ? `${formatPrice(order.amountCents, lang)}${lang === "fr" ? "" : " USD"}` : null;
  const cancelled = order.status === "cancelled";
  const steps = cancelled ? [] : orderSteps(order);
  const track = trackingUrl(order);
  const carrierName = order.carrier ? CARRIERS[order.carrier]?.name || order.carrier : "";
  const ship = order.shipping;
  const firstName = (order.buyer?.name || "").split(" ")[0];

  return (
    <div style={{ background: palette.void, minHeight: "100vh", color: palette.bone }}>
      <Header />

      <main className="px-6 sm:px-12 lg:px-24 pt-32 sm:pt-36 pb-20">
        <div className="text-[10px] sm:text-[11px] uppercase leading-relaxed" style={label}>
          {o.eyebrow(order.id, formatOrderDate(order.createdAt, lang))}
        </div>
        <h1
          className="mt-3 text-[32px] sm:text-[40px] lg:text-[52px] leading-[1.08]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
        >
          {o.headline[order.status] || o.headline.paid}
        </h1>
        <p
          className="mt-3 text-[15px] lg:text-base leading-relaxed max-w-[60ch]"
          style={{ fontFamily: "'Inter', sans-serif", color: "#BDB6A8" }}
        >
          {cancelled ? o.cancelledText : o.intro(firstName)}
        </p>

        <div className="mt-9 lg:mt-12 flex flex-col lg:flex-row gap-10 lg:gap-20 items-stretch lg:items-start">
          {/* Artwork + details */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-5 md:gap-8 lg:gap-6 md:items-end lg:items-stretch lg:w-[440px] shrink-0">
            {image && (
              <div
                className="relative w-full md:w-[300px] lg:w-full shrink-0 overflow-hidden"
                style={{ aspectRatio: "440 / 540", borderRadius: "1000px 1000px 0 0", background: palette.wall }}
              >
                <Image src={image} alt={title} fill sizes="(min-width: 1024px) 440px, (min-width: 768px) 300px, 100vw" style={{ objectFit: "cover" }} />
              </div>
            )}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div>
                <div className="text-[22px] sm:text-[24px] lg:text-[26px]" style={{ fontFamily: "'Fraunces', serif" }}>
                  {title}
                </div>
                <div className="mt-1.5 text-[10px] sm:text-[11px] uppercase leading-[1.8]" style={{ ...mono, color: palette.smoke, letterSpacing: "0.08em" }}>
                  {details && <>{details}<br /></>}
                  {o.oneOfOne}
                </div>
              </div>
              {amount && (
                <div
                  className="flex justify-between py-3 text-xs"
                  style={{ ...mono, borderTop: "1px solid rgba(232,227,216,0.15)", borderBottom: "1px solid rgba(232,227,216,0.15)" }}
                >
                  <span className="uppercase" style={{ color: palette.smoke }}>{o.amountPaid}</span>
                  <span>{amount}</span>
                </div>
              )}
              {order.pieceId && piece && (
                <Link
                  href={href(`/piece/${order.pieceId}/certificate`)}
                  className="hidden md:inline-block py-1.5 text-[10px] lg:text-[11px] uppercase"
                  style={{ ...mono, color: palette.brass, letterSpacing: "0.12em", textDecoration: "none" }}
                >
                  {o.certificate}
                </Link>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 min-w-0">
            {!cancelled && (
              <>
                <div className="text-[10px] lg:text-[11px] uppercase mb-5 lg:mb-6" style={label}>{o.status}</div>
                <ol className="flex flex-col">
                  {steps.map((s, i) => {
                    const last = i === steps.length - 1;
                    const note = s.state === "current" ? null : o.stepNotes[s.step];
                    return (
                      <li key={s.step} className={`flex gap-4 sm:gap-5 lg:gap-[22px] ${last ? "" : "pb-6 lg:pb-[30px]"}`}>
                        <div className="flex flex-col items-center">
                          <Dot state={s.state} />
                          {!last && (
                            <div
                              className="grow mt-1.5"
                              style={{ width: 2, background: s.state === "done" ? palette.brass : "rgba(232,227,216,0.15)" }}
                            />
                          )}
                        </div>
                        <div className="grow min-w-0">
                          <div
                            className="text-[18px] sm:text-[19px] lg:text-[20px]"
                            style={{
                              fontFamily: "'Fraunces', serif",
                              color: s.state === "current" ? palette.brass : s.state === "upcoming" ? palette.smoke : palette.bone,
                            }}
                          >
                            {o.steps[s.step]}
                          </div>
                          <div className="mt-1 text-[10px] lg:text-[11px] uppercase" style={{ ...mono, color: s.state === "upcoming" ? "#6E695F" : palette.smoke, letterSpacing: "0.06em" }}>
                            {s.state === "upcoming"
                              ? o.upcoming
                              : [formatOrderDate(s.date, lang), s.state === "current" ? o.current : null].filter(Boolean).join(" · ")}
                          </div>
                          {s.state === "done" && note && s.step !== "paid" && (
                            <div className="mt-1.5 text-sm leading-normal" style={{ fontFamily: "'Inter', sans-serif", color: "#BDB6A8" }}>
                              {note}
                            </div>
                          )}
                          {s.state === "current" && s.step === "pickup" && (
                            <div className="mt-1.5 text-sm leading-normal" style={{ fontFamily: "'Inter', sans-serif", color: "#BDB6A8" }}>
                              {o.stepNotes.pickup}
                            </div>
                          )}
                          {s.step === "shipped" && s.state !== "upcoming" && (carrierName || order.trackingNumber) && (
                            <div
                              className="mt-3 lg:mt-3.5 p-4 sm:px-[18px] lg:px-5 lg:py-[18px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5"
                              style={{ background: palette.wall }}
                            >
                              <div className="text-[11px] lg:text-xs leading-[1.9]" style={mono}>
                                {carrierName && (
                                  <>
                                    <div className="uppercase" style={{ color: palette.smoke }}>{o.carrier}</div>
                                    <div>{carrierName}</div>
                                  </>
                                )}
                                {order.trackingNumber && (
                                  <>
                                    <div className="uppercase mt-1" style={{ color: palette.smoke }}>{o.trackingNumber}</div>
                                    <div className="break-all">{order.trackingNumber}</div>
                                  </>
                                )}
                              </div>
                              {track && (
                                <a
                                  href={track}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-center whitespace-nowrap text-[10px] lg:text-[11px] uppercase px-4 py-[15px] sm:py-3.5 lg:px-5"
                                  style={{ ...mono, background: palette.brass, color: palette.void, letterSpacing: "0.12em", textDecoration: "none" }}
                                >
                                  {o.trackPackage}
                                </a>
                              )}
                            </div>
                          )}
                          {s.state === "current" || (last && s.state === "done") ? (
                            order.noteToBuyer ? (
                              <blockquote
                                className="mt-3 px-4 py-3 text-sm leading-relaxed"
                                style={{ fontFamily: "'Inter', sans-serif", color: "#BDB6A8", background: palette.wall, borderLeft: `2px solid ${palette.brass}` }}
                              >
                                “{order.noteToBuyer}”
                                <div className="mt-1 text-[10px] uppercase" style={{ ...mono, color: palette.smoke, letterSpacing: "0.1em" }}>
                                  {o.fromDelara}
                                </div>
                              </blockquote>
                            ) : null
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}

            <div
              className={`${cancelled ? "" : "mt-9 lg:mt-11"} pt-6 lg:pt-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8`}
              style={{ borderTop: "1px solid rgba(232,227,216,0.15)" }}
            >
              {ship && (ship.line1 || ship.city) && (
                <div className="text-[11px] lg:text-xs leading-[1.9]" style={mono}>
                  <div className="text-[10px] lg:text-[11px] uppercase mb-1.5" style={label}>{o.shippingTo}</div>
                  {ship.name || order.buyer?.name}
                  <br />
                  {ship.line1}
                  {ship.line2 ? <>, {ship.line2}</> : null}
                  <br />
                  {[ship.city, ship.state, ship.postal_code].filter(Boolean).join(", ")}
                  {ship.country ? <><br />{ship.country}</> : null}
                </div>
              )}
              <div className="text-[11px] lg:text-xs leading-[1.9]" style={mono}>
                <div className="text-[10px] lg:text-[11px] uppercase mb-1.5" style={label}>{o.questions}</div>
                <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(order.id)}`} style={{ color: palette.bone, textDecoration: "none" }}>
                  {CONTACT_EMAIL}
                </a>
                <br />
                <a href="tel:+16478739585" style={{ color: palette.bone, textDecoration: "none" }}>
                  +1 647 873 9585
                </a>
              </div>
            </div>
            {order.pieceId && piece && (
              <Link
                href={href(`/piece/${order.pieceId}/certificate`)}
                className="md:hidden inline-block mt-6 py-3 text-[10px] uppercase"
                style={{ ...mono, color: palette.brass, letterSpacing: "0.12em", textDecoration: "none" }}
              >
                {o.certificate}
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
