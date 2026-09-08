import type { NavItem, SocialLink } from '@/types'

/** In-page anchors today, ordered to match the page's narrative. When
 *  dedicated routes land (/tentang, /kegiatan, /galeri, /berita,
 *  /kontak) only `href` changes. */
export const navigation: readonly NavItem[] = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Peran', href: '#peran' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kegiatan', href: '#kegiatan' },
  { label: 'Kontak', href: '#kontak' },
]

/** Placeholders until the group publishes its accounts — rendered as
 *  inert text, never as links that go nowhere. */
export const socialLinks: readonly SocialLink[] = [
  { label: 'Instagram', href: '', placeholder: true },
  { label: 'Facebook', href: '', placeholder: true },
  { label: 'WhatsApp', href: '', placeholder: true },
]
