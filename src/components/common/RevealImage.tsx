import { cn } from '@/lib/utils'

export interface RevealImageProps {
  readonly src: string
  readonly alt: string
  readonly srcSet?: string
  readonly sizes?: string
  readonly className?: string
  readonly imageClassName?: string
  readonly loading?: 'lazy' | 'eager'
  readonly fetchPriority?: 'high' | 'low' | 'auto'
  readonly overscan?: boolean
}

export function RevealImage({
  src,
  alt,
  srcSet,
  sizes,
  className,
  imageClassName,
  loading = 'lazy',
  fetchPriority,
  overscan = true,
}: RevealImageProps) {
  return (
    <div data-reveal-frame className={cn('relative overflow-hidden', className)}>
      <div data-reveal-shift className={cn('absolute', overscan ? 'inset-[-10%]' : 'inset-0')}>
        <img
          data-reveal-image
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}
