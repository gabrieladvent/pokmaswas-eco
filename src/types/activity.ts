/** Kategori yang juga dipakai sebagai filter di `ActivityFilter`. */
export type ActivityCategory =
  | 'Pengawasan'
  | 'Monitoring'
  | 'Edukasi'
  | 'Konservasi'
  | 'Masyarakat'

export interface ActivityPhoto {
  readonly src: string
  /** Wajib: setiap foto harus bisa dijelaskan tanpa melihatnya. */
  readonly alt: string
  readonly caption?: string
}

export interface ActivityChapter {
  readonly id: string
  readonly title: string
  /**
   * Satu entri per paragraf.
   *
   * Disimpan sebagai larik, bukan satu string panjang, karena reveal
   * berjalan per blok paragraf — memecah string dengan `\n\n` saat render
   * hanya memindahkan pekerjaan yang sama ke tempat yang lebih rapuh.
   */
  readonly content: readonly string[]
  readonly image?: string
  readonly imageAlt?: string
}

export interface Activity {
  readonly id: string
  /** Dipakai pada rute `/kegiatan/:slug`. */
  readonly slug: string
  /** ISO `YYYY-MM-DD`; diformat ke bahasa Indonesia oleh `formatActivityDate`. */
  readonly date: string
  readonly title: string
  readonly category: ActivityCategory
  readonly location?: string
  /** Ringkasan satu paragraf — dipakai di timeline dan kartu terkait. */
  readonly excerpt: string
  readonly coverImage: string
  readonly coverAlt: string
  /**
   * Kosong atau satu bab berarti kegiatan ini tidak punya cerita panjang;
   * komponennya menampilkan excerpt saja dan tidak menawarkan tautan
   * "Baca Cerita Lengkap". Bab tidak dipaksakan.
   */
  readonly chapters: readonly ActivityChapter[]
  readonly gallery?: readonly ActivityPhoto[]
  /** Satu kegiatan tampil sebagai cerita utama di beranda. */
  readonly featured?: boolean
}
