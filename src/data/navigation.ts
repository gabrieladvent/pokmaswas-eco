import type { NavItem, SocialLink } from '@/types'

export const navigation: readonly NavItem[] = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Peran', href: '#peran' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kegiatan', href: '#kegiatan' },
  { label: 'Kontak', href: '#kontak' },
]

export const socialLinks: readonly SocialLink[] = [
  { label: 'Instagram', href: '', placeholder: true },
  { label: 'Facebook', href: '', placeholder: true },
  { label: 'WhatsApp', href: '', placeholder: true },
]
