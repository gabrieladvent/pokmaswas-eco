const SESSION_KEY = 'pokmaswas:visitorSessionId'
const LAST_VISIT_KEY = 'pokmaswas:lastVisit'
const HAS_VISITED_KEY = 'pokmaswas:hasVisited'

/**
 * Berapa lama satu kunjungan dianggap masih berlangsung.
 *
 * Selama jendela ini, memuat ulang halaman atau kembali lagi **tidak**
 * menambah penghitung. Dua belas jam kira-kira setara "hari yang sama",
 * sehingga seseorang yang membuka pagi lalu sore terhitung sekali.
 */
export const VISIT_WINDOW_MS = 12 * 60 * 60 * 1000

export interface VisitorSession {
  readonly sessionId: string
  readonly hasVisited: boolean
  /** Waktu kunjungan terakhir yang dihitung, dalam milidetik epoch. */
  readonly lastVisit: number | null
  readonly visitorNumber: number | null
}

/**
 * Seluruh akses `localStorage` dibungkus.
 *
 * Pada mode penyamaran atau ketika penyimpanan situs diblokir, mengaksesnya
 * dapat melempar galat — dan penghitung pengunjung tidak boleh menjadi
 * alasan sebuah halaman gagal tampil.
 */
function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* Tidak apa-apa: kunjungan tetap terhitung, hanya tidak diingat. */
  }
}

function createSessionId(): string {
  // Anonim sepenuhnya: angka acak, bukan sidik jari perangkat.
  const random = globalThis.crypto?.randomUUID?.()
  if (random) return random
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function readVisitorSession(): VisitorSession {
  const existing = readItem(SESSION_KEY)
  const sessionId = existing ?? createSessionId()
  if (!existing) writeItem(SESSION_KEY, sessionId)

  const rawLastVisit = readItem(LAST_VISIT_KEY)
  const parsed = rawLastVisit === null ? Number.NaN : Number.parseInt(rawLastVisit, 10)
  const rawNumber = readItem('pokmaswas:visitorNumber')
  const parsedNumber = rawNumber === null ? Number.NaN : Number.parseInt(rawNumber, 10)

  return {
    sessionId,
    hasVisited: readItem(HAS_VISITED_KEY) === 'true',
    lastVisit: Number.isFinite(parsed) ? parsed : null,
    visitorNumber: Number.isFinite(parsedNumber) ? parsedNumber : null,
  }
}

/** Kunjungan baru dihitung hanya bila jendela kunjungan sebelumnya habis. */
export function shouldCountVisit(session: VisitorSession, now = Date.now()): boolean {
  if (session.lastVisit === null) return true
  return now - session.lastVisit >= VISIT_WINDOW_MS
}

export function rememberVisit(visitorNumber: number, now = Date.now()): void {
  writeItem(LAST_VISIT_KEY, String(now))
  writeItem(HAS_VISITED_KEY, 'true')
  writeItem('pokmaswas:visitorNumber', String(visitorNumber))
}

const WELCOME_SHOWN_KEY = 'pokmaswas:welcomeShown'

/**
 * Layar sambutan tampil sekali per sesi tab, bukan setiap pemuatan.
 *
 * Memutar ulang urutan sepanjang beberapa detik setiap kali seseorang
 * menyegarkan halaman akan berubah dari berkesan menjadi menjengkelkan.
 * Menyegarkan halaman melewatinya; membuka tab baru atau kembali lain
 * waktu menampilkannya lagi.
 */
export function shouldShowWelcome(): boolean {
  try {
    return window.sessionStorage.getItem(WELCOME_SHOWN_KEY) !== 'true'
  } catch {
    return true
  }
}

export function markWelcomeShown(): void {
  try {
    window.sessionStorage.setItem(WELCOME_SHOWN_KEY, 'true')
  } catch {
    /* Tidak apa-apa: paling banyak sambutannya tampil sekali lagi. */
  }
}
