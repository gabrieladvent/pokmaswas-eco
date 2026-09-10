import type { CollaborationPartner } from '@/types/collaboration'

/**
 * Bagian kolaborasi.
 *
 * Dua catatan yang menentukan bentuk bagian ini:
 *
 * 1. **Kedua mitra setara.** Nama, ukuran, warna, dan perlakuan visualnya
 *    sengaja identik — urutannya di larik ini tidak menyiratkan hierarki
 *    apa pun. Bagian ini pernyataan kerja sama, bukan penempatan sponsor.
 * 2. **Belum ada logo resmi di proyek.** Selama `logo` kosong, namanya
 *    dirender sebagai tipografi. Jangan membuat logo tiruan; cukup
 *    letakkan berkas aslinya di `src/assets/images/` lalu isi kolom itu.
 */
export const collaborationPartners: readonly CollaborationPartner[] = [
  { id: 'racatech', name: 'Racatech', role: 'Technology' },
  { id: 'pokmaswas', name: 'Pokmaswas', role: 'Community' },
]

export const collaborationCopy = {
  statement: 'Teknologi bertemu dengan kekuatan masyarakat.',
  description:
    'Bersama membangun ruang digital untuk memperkenalkan, mendokumentasikan, dan mendukung semangat masyarakat dalam menjaga sumber daya kelautan dan perikanan.',
  /** Kalimat penutup, dipecah per baris agar tiap baris bisa naik sendiri. */
  closingLines: ['Bersama', 'untuk laut.'],
} as const
