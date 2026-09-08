import { MapPin } from 'lucide-react'

import { Container } from '@/components/common/Container'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { navigation, socialLinks } from '@/data/navigation'
import { addressLines, site } from '@/data/site'
import { useSectionNavigation } from '@/hooks/useSectionNavigation'

export function Footer() {
  const year = new Date().getFullYear()
  const goToSection = useSectionNavigation()

  return (
    <footer id="kontak" className="relative overflow-hidden bg-deep-900 pt-24 pb-10 text-offwhite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/50 to-transparent"
      />

      <Container width="wide">
        <ScrollReveal className="grid gap-16 lg:grid-cols-12 lg:gap-10" y={26}>
          <div className="lg:col-span-5">
            <h2 className="text-heading text-offwhite">
              Pokmaswas
              <br />
              San Dominggo
            </h2>
            <p className="mt-6 max-w-sm font-body text-[0.9375rem] leading-relaxed text-offwhite/55">
              {site.description}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-body text-[0.6875rem] font-medium tracking-[0.28em] text-seafoam/70 uppercase">
              Alamat
            </h3>
            <address className="mt-6 flex gap-3 font-body text-[0.9375rem] leading-relaxed text-offwhite/70 not-italic">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-turquoise" />
              <span>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-body text-[0.6875rem] font-medium tracking-[0.28em] text-seafoam/70 uppercase">
              Jelajahi
            </h3>
            <nav aria-label="Navigasi footer" className="mt-6">
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault()
                        goToSection(item.href)
                      }}
                      className="font-body text-[0.9375rem] text-offwhite/70 transition-colors hover:text-seafoam"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-body text-[0.6875rem] font-medium tracking-[0.28em] text-seafoam/70 uppercase">
              Terhubung
            </h3>
            <ul className="mt-6 space-y-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  {social.placeholder ? (
                    <span className="font-body text-[0.9375rem] text-offwhite/35">
                      {social.label}
                      <span className="sr-only"> (belum tersedia)</span>
                      <span aria-hidden="true" className="ml-2 text-[0.6875rem] tracking-wider">
                        SEGERA
                      </span>
                    </span>
                  ) : (
                    <a
                      href={social.href}
                      rel="noreferrer noopener"
                      target="_blank"
                      className="font-body text-[0.9375rem] text-offwhite/70 transition-colors hover:text-seafoam"
                    >
                      {social.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/8 pt-8 font-body text-xs text-offwhite/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.longName}
          </p>
          <p>Kelompok Masyarakat Pengawas · Kelautan dan Perikanan</p>
        </div>
      </Container>
    </footer>
  )
}
