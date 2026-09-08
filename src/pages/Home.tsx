import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import { HomePage } from '@/sections/Home/HomePage'
import { scrollToSection } from '@/lib/scroll'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = window.requestAnimationFrame(() => scrollToSection(hash))
    return () => window.cancelAnimationFrame(id)
  }, [hash])

  return <HomePage />
}
