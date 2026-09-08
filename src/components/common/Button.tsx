import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'light'
export type ButtonSize = 'md' | 'lg'

interface CommonProps {
  readonly children: ReactNode
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly icon?: LucideIcon
  readonly className?: string
  /** Tarikan magnetik halus ke arah kursor. Desktop saja. */
  readonly magnetic?: boolean
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>
type NativeAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>

export type ButtonProps =
  | (CommonProps & NativeButtonProps & { readonly as?: 'button' })
  | (CommonProps & NativeAnchorProps & { readonly as: 'a'; readonly href: string })

const BASE =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-body font-medium ' +
  'transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-out-expo)] ' +
  'hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-seafoam text-deep hover:bg-white',
  light: 'bg-deep text-offwhite hover:bg-turquoise',
  outline: 'border border-current/35 text-current hover:border-current/70 hover:bg-current/5',
  ghost: 'text-current hover:bg-current/10',
}

const SIZES: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-4 text-[0.9375rem]',
}

/**
 * Renders a `<button>` by default, or an `<a>` when `as="a"`, so that
 * link-shaped and action-shaped calls to action stay visually identical
 * without duplicating styles.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  className,
  magnetic = false,
  ...rest
}: ButtonProps) {
  // Hook selalu dipanggil; hanya ref-nya yang dipasang atau tidak.
  const magneticRef = useMagnetic<HTMLElement>()
  const ref = magnetic ? magneticRef : undefined
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)

  const content = (
    <>
      <span>{children}</span>
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  )

  if (rest.as === 'a') {
    const { as: _, ...anchorProps } = rest
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement> | undefined}
        data-cursor="link"
        className={classes}
        {...anchorProps}
      >
        {content}
      </a>
    )
  }

  const { as: _, ...buttonProps } = rest
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement> | undefined}
      type="button"
      data-cursor="link"
      className={classes}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
