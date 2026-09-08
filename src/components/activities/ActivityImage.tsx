import { cn } from '@/lib/utils'

export interface ActivityImageProps {
  readonly src: string
  readonly alt: string
  readonly className?: string
  readonly imageClassName?: string
  readonly sizes?: string
  readonly priority?: boolean
  readonly hoverScale?: boolean
}

export function ActivityImage({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority = false,
  hoverScale = false,
}: ActivityImageProps) {
  return (
    <div data-parallax className={cn('relative overflow-hidden rounded-sm bg-sand-soft', className)}>
      <div data-parallax-shift className="absolute inset-[-8%]">
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          className={cn(
            'h-full w-full object-cover',
            hoverScale &&
              'transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]',
            imageClassName,
          )}
        />
      </div>
    </div>
  )
}
