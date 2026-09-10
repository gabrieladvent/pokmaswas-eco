import { collaborationCopy } from '@/data/collaboration'

/**
 * Penutup bagian kolaborasi: satu kalimat, lalu selesai.
 *
 * Sebelumnya di sini ada tiga pilar dan kartu keterangan kerja sama.
 * Keduanya dihapus karena hanya mengulang apa yang sudah dinyatakan
 * dengan jauh lebih kuat di atasnya — kedua nama dalam ukuran besar dan
 * pernyataannya. Mengulanginya dalam huruf kecil justru melemahkan
 * bagian ini, bukan menegaskannya.
 */
export function CollaborationCoda() {
  return (
    <div data-collab-closing className="mx-auto max-w-5xl px-6 text-center sm:px-8">
      <h2 className="text-display text-offwhite">
        {collaborationCopy.closingLines.map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <span data-collab-closing-line className="block">
              {line}
            </span>
          </span>
        ))}
      </h2>
    </div>
  )
}
