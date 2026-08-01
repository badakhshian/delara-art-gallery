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
          }
          .certificate-card * {
            color: #111 !important;
          }
          .certificate-card .signature-line {
            border-bottom-color: #111 !important;
          }
        }
      `}
