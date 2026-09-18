import { useSyncExternalStore } from 'react'

import { getActiveSection, subscribeActiveSection } from '@/lib/sectionSpy'

/** Href bagian yang sedang dibaca, atau string kosong bila belum ada. */
export function useActiveSection(): string {
  return useSyncExternalStore(subscribeActiveSection, getActiveSection, () => '')
}
