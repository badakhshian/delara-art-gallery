import { notFound } from "next/navigation";
import Image from "next/image";
import { getPiece } from "@/lib/piecesStore";
import { palette } from "@/lib/palette";
import PieceQRCode from "@/components/PieceQRCode";
import PrintButton from "@/components/PrintButton";

export async function generateMetadata({ params }) {
  const piece = await getPiece(params.id);
  if (!piece) return {};
  return { title: `Certificate of Authenticity — ${piece.title}` };
}

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }) {
  const piece = await getPiece(params.id);
  if (!piece) notFound();

  const issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-6"
      style={{ background: palette.void }}
    >
      <style>{`
        @media print {
          @page { margin: 0.6in; }
          body { background: #fff !important; }
          .certificate-card {
            background: #fff !important;
            color: #111 !important;
            border-color: #ccc !important;
            box-shadow: none !important;
          }
          .certificate-card * {
            color: #111 !important;
          }
          .certificate-card .accent {
            color: #5C1A1A !important;
          }
        }
      `}</style>

      <div className="mb-6 print:hidden">
        <PrintButton />
      </div>

      <div
        className="certificate-card w-full max-w-2xl p-10 sm:p-14"
        style={{
          background: palette.wall,
          border: `1px solid rgba(184,141,87,0.25)`,
        }}
      >
        <div className="text-center mb-10">
          <div
            className="accent text-xs uppercase mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: palette.brass,
              letterSpacing: "0.2em",
            }}
          >
            Delara Art Gallery
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              color: palette.bone,
              fontWeight: 300,
              fontSize: "1.75rem",
            }}
          >
            Certificate of Authenticity
          </h1>
        </div>

        <div
          className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10 pb-10"
          style={{ borderBottom: `1px solid rgba(184,141,87,0.25)` }}
        >
          <Field label="Title" value={piece.title} bone />
          <Field label="Artist" value={piece.artist} />
          <Field label="Year" value={piece.year} />
          <Field label="Medium" value={piece.medium} />
          <Field label="Dimensions" value={piece.dims} />
          <Field label="Edition" value="Original, one of one" />
          <Field label="Certificate ID" value={piece.certificateId} />
          <Field label="Date issued" value={issueDate} />
        </div>

        <p
          className="text-sm leading-relaxed mb-10"
          style={{ fontFamily: "'Inter', sans-serif", color: palette.bone }}
        >
          This certifies that the work described above is an original,
          one-of-a-kind piece created by Delara Ahmadi Darani. No editions,
          reproductions, or prints of this piece have been authorized by the
          artist. This certificate should remain with the artwork as part of
          its provenance.
        </p>

        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div
              className="text-2xl mb-1"
              style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: palette.bone }}
            >
              Delara Ahmadi Darani
            </div>
            <div
              className="text-xs uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: palette.smoke,
                letterSpacing: "0.1em",
                borderTop: `1px solid rgba(184,141,87,0.4)`,
                paddingTop: 4,
              }}
            >
              Artist signature
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
