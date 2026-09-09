import {
  readVisitorSession,
  rememberVisit,
  shouldCountVisit,
} from "@/lib/visitorSession";
import type { VisitorStats, VisitorVisit } from "@/types/visitor";

/* ------------------------------------------------------------------ *
 * Lapisan penyimpanan
 * ------------------------------------------------------------------ */

/**
 * Kontrak minimum sebuah penghitung: menaikkan satu angka secara atomik,
 * dan membacanya tanpa menaikkan.
 *
 * Sengaja sesempit ini. Selama sebuah layanan bisa melakukan dua hal itu,
 * ia dapat menggantikan backend di bawah tanpa satu pun komponen React
 * ikut berubah — cukup tukar objek yang dikembalikan `createBackend()`.
 */
export interface CounterBackend {
  /** Menaikkan lalu mengembalikan nilai barunya. */
  hit(key: string): Promise<number>;
  /** Membaca tanpa menaikkan. Kunci yang belum ada bernilai 0. */
  read(key: string): Promise<number>;
}

export interface VisitorCounterService {
  incrementVisitor(): Promise<number>;
  getTotalVisitors(): Promise<number>;
  getWeeklyVisitors(): Promise<number>;
}

/** Batas tunggu tiap permintaan. Penghitung tidak pernah boleh menahan
 *  halaman lebih lama dari ini. */
const REQUEST_TIMEOUT_MS = 4000;

const DEFAULT_BASE_URL = "https://abacus.jasoncameron.dev";
const DEFAULT_NAMESPACE = "pokmaswas-san-dominggo";

async function fetchJson(url: string, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 404) return { value: 0 };
    if (!response.ok) throw new Error(`Counter responded ${response.status}`);
    return (await response.json()) as unknown;
  } finally {
    window.clearTimeout(timer);
  }
}

function readValue(payload: unknown): number {
  if (typeof payload === "object" && payload !== null && "value" in payload) {
    const value = (payload as { value: unknown }).value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  throw new Error("Counter returned an unexpected payload");
}

/**
 * Backend Abacus (https://abacus.jasoncameron.dev).
 *
 * Dipilih karena tiga hal yang persis dibutuhkan di sini: `/hit` menaikkan
 * secara atomik sehingga dua pengunjung tidak pernah mendapat nomor yang
 * sama, `/get` membaca tanpa menaikkan, dan layanannya sama sekali tidak
 * memerlukan kunci API — jadi tidak ada rahasia yang perlu diletakkan di
 * bundel frontend.
 */
export function createAbacusBackend(
  baseUrl: string,
  namespace: string,
): CounterBackend {
  const root = baseUrl.replace(/\/$/, "");
  const ns = encodeURIComponent(namespace);

  return {
    async hit(key) {
      return readValue(
        await fetchJson(
          `${root}/hit/${ns}/${encodeURIComponent(key)}`,
          REQUEST_TIMEOUT_MS,
        ),
      );
    },
    async read(key) {
      return readValue(
        await fetchJson(
          `${root}/get/${ns}/${encodeURIComponent(key)}`,
          REQUEST_TIMEOUT_MS,
        ),
      );
    },
  };
}

/* ------------------------------------------------------------------ *
 * Kunci
 * ------------------------------------------------------------------ */

const TOTAL_KEY = "total";

/** Ember harian, satu kunci per tanggal — dasar hitungan 7 hari terakhir. */
function dayKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `day-${year}-${month}-${day}`;
}

/** Tujuh tanggal terakhir termasuk hari ini, dalam UTC agar tidak
 *  bergantung pada zona waktu pengunjung. */
function lastSevenDayKeys(now = new Date()): readonly string[] {
  const keys: string[] = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - offset);
    keys.push(dayKey(date));
  }
  return keys;
}

/* ------------------------------------------------------------------ *
 * Service
 * ------------------------------------------------------------------ */

export function createVisitorCounterService(
  backend: CounterBackend,
): VisitorCounterService {
  return {
    async incrementVisitor() {
      /*
       * Total dan ember hari ini dinaikkan bersamaan. Nomor pengunjung
       * selalu diambil dari total — itulah satu-satunya deret yang harus
       * berurutan. Ember harian hanya bahan hitungan mingguan, jadi bila
       * yang satu itu gagal, kunjungannya tetap tercatat.
       */
      const [total] = await Promise.allSettled([
        backend.hit(TOTAL_KEY),
        // Bila ember harian gagal, statistik mingguan meleset satu —
        // nomor pengunjungnya tidak. Itu pertukaran yang benar.
        backend.hit(dayKey(new Date())),
      ]);

      if (total.status === "rejected") throw total.reason;
      return total.value;
    },

    async getTotalVisitors() {
      return backend.read(TOTAL_KEY);
    },

    async getWeeklyVisitors() {
      const results = await Promise.allSettled(
        lastSevenDayKeys().map((key) => backend.read(key)),
      );
      // Ember yang gagal dibaca dihitung nol, bukan membatalkan semuanya:
      // angka yang sedikit kurang lebih baik daripada tidak ada angka.
      return results.reduce(
        (sum, result) =>
          result.status === "fulfilled" ? sum + result.value : sum,
        0,
      );
    },
  };
}

function createBackend(): CounterBackend {
  const baseUrl = import.meta.env.VISITOR_COUNTER_URL ?? DEFAULT_BASE_URL;
  const namespace =
    import.meta.env.VISITOR_COUNTER_NAMESPACE ?? DEFAULT_NAMESPACE;
  return createAbacusBackend(baseUrl, namespace);
}

const service = createVisitorCounterService(createBackend());

/* ------------------------------------------------------------------ *
 * API yang dipakai aplikasi
 * ------------------------------------------------------------------ */

/*
 * Kedua permintaan di bawah dimemoisasi pada tingkat modul.
 *
 * Di sinilah jaminan "penghitung hanya naik sekali per pemuatan halaman"
 * benar-benar ditegakkan — bukan di komponen. Berapa pun bagian antarmuka
 * yang memintanya, dan sekalipun React StrictMode menjalankan efek dua kali
 * saat pengembangan, semuanya menunggu promise yang sama.
 */
let visitRequest: Promise<VisitorVisit | null> | null = null;
let statsRequest: Promise<VisitorStats | null> | null = null;

/**
 * Mencatat kunjungan bila memang kunjungan baru, lalu mengembalikan nomor
 * pengunjungnya.
 *
 * Memuat ulang halaman tidak menambah penghitung: nomor yang tersimpan dari
 * kunjungan sebelumnya dipakai kembali selama jendela kunjungan belum
 * habis. Lihat `VISIT_WINDOW_MS`.
 *
 * Mengembalikan `null` bila layanan tidak dapat dihubungi. Pemanggil
 * memperlakukannya sebagai "tanpa nomor", bukan sebagai kegagalan.
 */
export function registerVisit(): Promise<VisitorVisit | null> {
  visitRequest ??= performVisit();
  return visitRequest;
}

async function performVisit(): Promise<VisitorVisit | null> {
  const session = readVisitorSession();

  if (!shouldCountVisit(session)) {
    return session.visitorNumber === null
      ? null
      : {
          visitorNumber: session.visitorNumber,
          sessionId: session.sessionId,
          returning: true,
        };
  }

  try {
    const visitorNumber = await service.incrementVisitor();
    rememberVisit(visitorNumber);
    return {
      visitorNumber,
      sessionId: session.sessionId,
      returning: session.hasVisited,
    };
  } catch {
    // Sengaja diam. Penghitung yang sedang mati bukan alasan untuk
    // menampilkan galat teknis kepada pengunjung.
    return null;
  }
}

/** Mengembalikan `null` bila statistik tidak dapat diambil. */
export function getVisitorStats(): Promise<VisitorStats | null> {
  // Statistik menunggu pencatatan kunjungan lebih dulu, supaya totalnya
  // sudah termasuk pengunjung yang sedang membaca.
  statsRequest ??= registerVisit()
    .catch(() => null)
    .then(() => fetchStats());
  return statsRequest;
}

async function fetchStats(): Promise<VisitorStats | null> {
  try {
    const [total, weekly] = await Promise.all([
      service.getTotalVisitors(),
      service.getWeeklyVisitors(),
    ]);
    return { total, weekly, updatedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}
