/**
 * Button — pill CTA primitive (DESIGN.md §5).
 *
 * Variants: primary (accent), secondary (cool), ghost (transparent + hairline).
 * Sizes: sm / md / lg. Real <button>. Pill radius 56px.
 *
 * States:
 *   default → hover (scale 1.02 + variant hover surface) → active
 *   (scale 0.98 + variant active surface) → focus-visible (global
 *   :focus-visible ring from --accent-focus-ring, DESIGN.md §8) →
 *   disabled (60% opacity, no shadow).
 *
 * Motion (DESIGN.md §6): 200ms cubic-bezier(0.32,0.72,0,1) on
 * transform/opacity/filter ONLY — never layout properties. The trailing
 * icon rides in its own circular wrapper (button-in-button, soft-skill)
 * and gets kinetic tension on group-hover (translate + scale).
 *
 * API:
 *   <Button variant="primary" size="md" icon={<ArrowRight />} iconLabel="Go">
 *     Label
 *   </Button>
 *   <Button variant="ghost" size="sm" disabled>…</Button>
 *   <Button variant="secondary" fullWidth>…</Button>   // w-full (mobile form submit)
 */
import { forwardRef } from 'react'

const VARIANTS = {
  primary: {
    base: 'bg-accent-primary text-white shadow-[0_1px_2px_rgba(13,18,79,0.04)]',
    hover: 'enabled:hover:bg-accent-hover',
    active: 'enabled:active:bg-accent-active',
    icon: 'bg-white/15',
  },
  secondary: {
    base: 'bg-surface-cool text-text-primary',
    hover: 'enabled:hover:bg-accent-primary/10',
    active: 'enabled:active:bg-accent-primary/15',
    icon: 'bg-accent-primary/12',
  },
  ghost: {
    base: 'border border-border-default bg-transparent text-text-primary',
    hover: 'enabled:hover:bg-surface-cool',
    active: 'enabled:active:bg-surface-tint',
    icon: 'bg-surface-cool',
  },
}

const SIZES = {
  sm: {
    btn: 'gap-2 px-4 py-2 text-sm',
    icon: 'h-7 w-7',
    iconSvg: '[&_svg]:h-[18px] [&_svg]:w-[18px]',
    iconOnly: 'h-9 w-9',
  },
  md: {
    btn: 'gap-2.5 px-6 py-3 text-base',
    icon: 'h-8 w-8',
    iconSvg: '[&_svg]:h-[18px] [&_svg]:w-[18px]',
    iconOnly: 'h-11 w-11',
  },
  lg: {
    btn: 'gap-3 px-8 py-4 text-lg',
    icon: 'h-9 w-9',
    iconSvg: '[&_svg]:h-5 [&_svg]:w-5',
    iconOnly: 'h-12 w-12',
  },
}

const MOTION =
  'transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]'

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    fullWidth = false,
    icon = null,
    iconLabel,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const v = VARIANTS[variant]
  const s = SIZES[size]
  const iconOnly = !children && !!icon

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={iconOnly ? iconLabel : undefined}
      className={[
        'group relative inline-flex select-none items-center justify-center rounded-[56px]',
        'font-sans font-semibold leading-[1.2] tracking-[0.01em]',
        'enabled:hover:scale-[1.02] enabled:active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
        v.base,
        v.hover,
        v.active,
        MOTION,
        iconOnly ? s.iconOnly : s.btn,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
      {icon && (
        <span
          aria-hidden="true"
          className={[
            'flex shrink-0 items-center justify-center rounded-full',
            v.icon,
            s.icon,
            s.iconSvg,
            MOTION,
            'group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:scale-105',
            'group-active:translate-x-0 group-active:translate-y-0 group-active:scale-100',
          ].join(' ')}
        >
          {icon}
        </span>
      )}
    </button>
  )
})

export default Button