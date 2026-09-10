export interface CollaborationPartner {
  readonly id: string
  /** Ditampilkan dalam huruf besar, dengan ukuran yang persis sama untuk
   *  setiap mitra. Lihat catatan di `data/collaboration.ts`. */
  readonly name: string
  /** Label pendek di bawah nama — apa yang dibawa mitra ini. */
  readonly role: string
  /**
   * Berkas logo resmi, bila sudah tersedia di `src/assets/images/`.
   * Selama kosong, namanya dirender sebagai tipografi. Tidak ada logo
   * tiruan yang dibuat-buat.
   */
  readonly logo?: string
}
