import { ScrollTrigger, gsap } from '@/lib/gsap'

type Subscriber = (velocity: number) => void

/**
 * Kecepatan gulir sesaat, dinormalkan ke rentang −1..1.
 *
 * Satu sumber untuk seluruh situs. Kalau tiap lapisan mengukur sendiri,
 * masing-masing memanggil `getVelocity()` pada frame yang berbeda dan
 * hasilnya sedikit berbeda pula — lapisan yang seharusnya bergerak
 * bersama jadi tidak sinkron.
 *
 * Nilainya dibagikan apa adanya, tanpa disimpan ke properti CSS di
 * `documentElement`. Mengubah variabel CSS di akar menandai seluruh
 * pohon untuk dihitung ulang gayanya setiap frame; menyerahkan angkanya
 * ke pelanggan membuat ongkosnya hanya sebesar jumlah lapisan yang
 * benar-benar memakainya.
 */

/** Kecepatan (px/detik) yang dianggap sebagai gulir paling cepat. */
const MAX_VELOCITY = 2600

/** Selang diam sebelum nilainya dikembalikan ke nol. */
const SETTLE_DELAY = 0.12

const subscribers = new Set<Subscriber>()

let trigger: ScrollTrigger | null = null

/*
 * Satu hitung mundur yang dipakai ulang, bukan satu per frame.
 *
 * `gsap.delayedCall()` membuat objek tween baru setiap kali dipanggil.
 * Dipanggil dari `onUpdate` artinya satu objek baru setiap frame gulir —
 * sampah yang harus dikumpulkan ulang terus-menerus tanpa alasan.
 * `restart()` memakai objek yang sama.
 */
let settle: gsap.core.Tween | null = null

function broadcast(velocity: number): void {
  for (const subscriber of subscribers) subscriber(velocity)
}

function handleUpdate(self: ScrollTrigger): void {
  broadcast(gsap.utils.clamp(-1, 1, self.getVelocity() / MAX_VELOCITY))

  /*
   * `onUpdate` hanya berjalan selama posisi gulir berubah. Saat gulir
   * berhenti, panggilan terakhir membawa kecepatan penuh dan tidak akan
   * pernah disusul panggilan berikutnya — lapisannya akan membeku dalam
   * keadaan tergeser. Hitung mundur inilah yang mengembalikannya.
   */
  settle?.restart(true)
}

/** Mulai mengukur. Aman dipanggil berkali-kali. */
export function startScrollVelocity(): void {
  if (trigger) return

  settle = gsap.delayedCall(SETTLE_DELAY, () => broadcast(0)).pause()

  trigger = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'max',
    onUpdate: handleUpdate,
  })
}

export function stopScrollVelocity(): void {
  settle?.kill()
  settle = null
  trigger?.kill()
  trigger = null
  broadcast(0)
}

export function subscribeScrollVelocity(subscriber: Subscriber): () => void {
  subscribers.add(subscriber)
  return () => {
    subscribers.delete(subscriber)
  }
}
