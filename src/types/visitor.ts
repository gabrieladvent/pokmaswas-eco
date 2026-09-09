export interface VisitorStats {
  readonly total: number
  /** Kunjungan pada 7 hari terakhir (rolling), bukan minggu kalender. */
  readonly weekly: number
  readonly updatedAt: string
}

export interface VisitorVisit {
  readonly visitorNumber: number
  /** Pengenal anonim, dibuat acak. Tidak terkait identitas apa pun. */
  readonly sessionId: string
  /** `true` bila perangkat ini pernah berkunjung sebelumnya. */
  readonly returning: boolean
}

/**
 * `unavailable` berarti layanan penghitung tidak dapat dihubungi.
 * Website tetap berjalan penuh; hanya angkanya yang tidak ditampilkan.
 */
export type VisitorStatus = 'idle' | 'loading' | 'ready' | 'unavailable'
