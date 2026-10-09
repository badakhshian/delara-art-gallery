import { getPieces } from "@/lib/piecesStore";
import { getCollections } from "@/lib/collectionsStore";
import { getArtist } from "@/lib/artistStore";
import { Resend } from "resend";
import { senderAddress } from "@/lib/emailSender";
import { CONTACT_EMAIL } from "@/lib/site";

// Everything entered in the admin — pieces, collections and the artist page —
// as one JSON backup. Photos stay on Vercel Blob; the file lists their
// addresses.
export async function buildBackup() {
  const [pieces, collections, artist] = await Promise.all([getPieces(), getCollections(), getArtist()]);
  const exportedAt = new Date().toISOString();
  return {
    exportedAt,
    filename: `artedelara-backup-${exportedAt.slice(0, 10)}.json`,
    json: JSON.stringify({ exportedAt, pieces, collections, artist }, null, 2),
    counts: { pieces: pieces.length, collections: collections.length },
  };
}

// Emails the backup file to Delara (or BACKUP_EMAIL if set).
// Returns { ok: true, ... } or { ok: false, error }.
export async function sendBackupEmail() {
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY is not set." };

  const { json, filename, exportedAt, counts } = await buildBackup();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: senderAddress(),
    to: process.env.BACKUP_EMAIL || CONTACT_EMAIL,
    subject: `Website backup — ${exportedAt.slice(0, 10)}`,
    text: [
      "Hello Delara,",
      "",
      `Attached is a backup of artedelara.com (${counts.pieces} pieces, ${counts.collections} collections, and the artist page).`,
      "",
      "Keep this email: if anything is ever lost or changed by mistake, this file lets everything be restored.",
      "Photos are stored separately and are listed in the file by their addresses.",
      "",
      "— Delara Art Gallery website",
    ].join("\n"),
    attachments: [{ filename, content: Buffer.from(json) }],
  });

  if (error) {
    console.error("Backup email error:", error);
    return { ok: false, error: "Could not send the backup email." };
  }
  return { ok: true, sentAt: exportedAt, ...counts };
}
