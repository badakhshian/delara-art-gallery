import { notFound } from "next/navigation";
import { getPiece } from "@/lib/piecesStore";
import EditPieceForm from "@/components/admin/EditPieceForm";

export const dynamic = "force-dynamic";

export default async function EditPiecePage({ params }) {
  const piece = await getPiece(params.id);
  if (!piece) notFound();

  return <EditPieceForm piece={piece} />;
}
