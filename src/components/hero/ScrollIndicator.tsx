export interface ScrollIndicatorProps {
  readonly label?: string
}

/**
 * Purely decorative: the journey it hints at is also reachable through
 * the hero's own call to action, so it is hidden from assistive tech.
 */
export function ScrollIndicator({ label = 'Gulir' }: ScrollIndicatorProps) {
  return (
    <div
      data-hero-indicator
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[16vh] hidden flex-col items-center gap-3 md:flex"
    >
      <span className="font-body text-[0.625rem] tracking-[0.32em] text-offwhite/60 uppercase">
        {label}
      </span>
      <span className="relative block h-14 w-px overflow-hidden bg-white/20">
        <span className="absolute inset-x-0 top-0 block h-5 animate-[hero-scroll_2.4s_var(--ease-out-expo)_infinite] bg-seafoam" />
      </span>
    </div>
  )
}
