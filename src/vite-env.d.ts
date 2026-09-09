/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Basis URL layanan penghitung. Default-nya Abacus
   * (https://abacus.jasoncameron.dev) — layanan penghitung publik yang
   * tidak memerlukan kunci API sama sekali.
   */
  readonly VISITOR_COUNTER_URL?: string;
  /** Ruang nama penghitung. Ganti untuk memulai hitungan dari nol. */
  readonly VISITOR_COUNTER_NAMESPACE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
