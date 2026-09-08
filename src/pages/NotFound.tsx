import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'

export default function NotFound() {
  return (
    <Section tone="deep" className="flex min-h-[70svh] items-center">
      <Container width="default" className="text-center">
        <p className="font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase">404</p>
        <h1 className="mt-6 text-title text-offwhite">Halaman ini tidak ditemukan.</h1>
        <p className="mx-auto mt-6 max-w-md font-body text-lead text-offwhite/60">
          Tautan yang Anda buka mungkin sudah berubah. Silakan kembali ke halaman utama.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-seafoam px-7 py-4 font-body text-[0.9375rem] font-medium text-deep"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Kembali ke beranda
        </Link>
      </Container>
    </Section>
  )
}
