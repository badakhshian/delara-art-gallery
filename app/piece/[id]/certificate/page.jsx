import { notFound } from "next/navigation";
import Image from "next/image";
import { getPiece } from "@/lib/piecesStore";
import { getI18n } from "@/lib/serverLang";
import { localizePiece } from "@/lib/localize";
import { palette } from "@/lib/palette";
import PieceQRCode from "@/components/PieceQRCode";
import PrintButton from "@/components/PrintButton";
import CertificateBackButton from "@/components/CertificateBackButton";


export async function generateMetadata({ params }) {
  const { lang, t } = getI18n();
  const piece = localizePiece(await getPiece(params.id), lang);
  if (!piece) return {};
  // Kept out of search results — the piece page is the one that should rank.
  return { title: t.meta.certificateTitle(piece.title), robots: { index: false } };
}

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }) {
  const { lang, t } = getI18n();
  const piece = localizePiece(await getPiece(params.id), lang);
  if (!piece) notFound();
  const f = t.certificate.fields;

  const issueDate = new Date().toLocaleDateString(lang === "fr" ? "fr-CA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="cert-page-wrapper min-h-screen flex flex-col items-center py-12 px-6"
      style={{ background: palette.void }}
    >
      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { background: #fff !important; }
          .cert-page-wrapper {
            min-height: auto !important;
            height: auto !important;
            display: block !important;
            padding: 0 !important;
          }
          .certificate-card {
            background: #fff !important;
            color: #111 !important;
            max-width: 100% !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .certificate-card * {
            color: #111 !important;
          }
          .certificate-card .signature-line {
            border-bottom-color: #111 !important;
          }
          .signature-row {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

           <div className="mb-6 print:hidden w-full max-w-2xl flex items-center justify-between">
        <CertificateBackButton pieceId={piece.id} />
        <PrintButton />
      </div>


      <div
        className="certificate-card w-full max-w-2xl p-10 sm:p-14"
        style={{ background: palette.wall }}
      >
        <div className="text-center mb-10">
          <Image
            src="/images/logo-gold.png"
            alt="Delara Ahmadi Darani"
            width={270}
            height={152}
            style={{ height: 88, width: "auto", margin: "0 auto 22px" }}
          />
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              color: palette.bone,
              fontWeight: 300,
              fontSize: "1.75rem",
            }}
          >
            {t.certificate.title}
          </h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10 pb-2">
          <Field label={f.title} value={piece.title} bone />
          <Field label={f.artist} value={piece.artist} />
          <Field label={f.year} value={piece.year} />
          <Field label={f.medium} value={piece.medium} />
          <Field label={f.dims} value={piece.dims} />
          <Field label={f.edition} value={t.piece.originalOneOfOne} />
          <Field label={f.id} value={piece.certificateId} />
          <Field label={f.issued} value={issueDate} />
        </div>

        <p
          className="text-sm leading-relaxed mb-12"
          style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
        >
          {t.certificate.statement}
        </p>

        <div className="signature-row flex items-end justify-between gap-6 flex-wrap">
          <div style={{ minWidth: 220 }}>
            <div
              className="signature-line"
              style={{
                height: 48,
                borderBottom: `1px solid rgba(232,227,216,0.4)`,
              }}
            />
            <div
              className="text-xs uppercase mt-2"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: palette.smoke,
                letterSpacing: "0.1em",
              }}
            >
              {t.certificate.signature}
            </div>
          </div>

          <PieceQRCode piece={piece} size={84} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, bone }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: palette.smoke,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
      <div
        className="text-sm mt-0.5"
        style={{
          fontFamily: bone ? "'Fraunces', serif" : "'Inter', sans-serif",
          color: palette.bone,
        }}
      >
        {value}
      </div>
    </div>
  );
}
