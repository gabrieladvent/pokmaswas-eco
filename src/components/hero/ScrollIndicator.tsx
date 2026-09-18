export interface ScrollIndicatorProps {
  readonly label?: string
}

export function ScrollIndicator({ label = 'Gulir' }: ScrollIndicatorProps) {
  return (
    <div
      data-hero-indicator
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[9vh] flex flex-col items-center gap-3 md:bottom-[16vh]"
    >
      <span className="font-body text-[0.625rem] tracking-[0.32em] text-offwhite/60 uppercase">
        {label}
      </span>
      <span className="relative block h-10 w-px overflow-hidden bg-white/20 md:h-14">
        <span className="absolute inset-x-0 top-0 block h-5 animate-[hero-scroll_2.4s_var(--ease-out-expo)_infinite] bg-seafoam" />
      </span>
    </div>
  )
}
