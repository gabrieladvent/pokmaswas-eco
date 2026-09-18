import { ScrollTrigger } from '@/lib/gsap'
import { navigation } from '@/data/navigation'

/**
 * Bagian mana yang sedang dibaca — satu sumber untuk seluruh situs.
 *
 * Sebelumnya dua komponen mengamati hal yang sama sendiri-sendiri: bilah
 * navigasi membuat satu ScrollTrigger per bagian, dan penunjuk gulir di
 * tepi kanan membuat satu set lagi. Sepuluh pengamat untuk lima bagian,
 * semuanya dihitung ulang pada tiap `ScrollTrigger.refresh()` — dan
 * keduanya bisa berbeda pendapat sepersekian detik ketika batas bagian
 * melewati tengah layar.
 *
 * Satu set pengamat, banyak pembaca. Pengamatnya baru dibuat ketika ada
 * yang berlangganan dan dibongkar begitu pelanggan terakhir pergi, jadi
 * halaman yang tidak punya bagian ini tidak membayar apa pun.
 */

type Listener = (href: string) => void

let triggers: ScrollTrigger[] = []
let active = ''
const listeners = new Set<Listener>()

function publish(next: string): void {
  if (next === active) return
  active = next
  for (const listener of listeners) listener(active)
}

function teardown(): void {
  for (const trigger of triggers) trigger.kill()
  triggers = []
}

function build(): void {
  teardown()

  for (const item of navigation) {
    const target = document.querySelector(item.href)
    if (!target) continue

    triggers.push(
      ScrollTrigger.create({
        trigger: target,
        start: 'top center',
        end: 'bottom center',
        invalidateOnRefresh: true,
        onToggle: (self) => {
          if (self.isActive) publish(item.href)
        },
      }),
    )
  }
}

/**
 * Dibangun ulang setelah isi halaman berganti.
 *
 * Bagian yang diamati ikut berganti bersama rute, jadi pengamat lama
 * mengukur elemen yang sudah tidak ada. Penanda aktifnya dikosongkan lebih
 * dulu supaya tidak ada tautan yang tersorot selagi halaman baru belum
 * sempat diukur.
 */
export function refreshSectionSpy(): void {
  publish('')
  build()
}

export function getActiveSection(): string {
  return active
}

export function subscribeActiveSection(listener: Listener): () => void {
  listeners.add(listener)
  if (listeners.size === 1) build()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      teardown()
      active = ''
    }
  }
}
