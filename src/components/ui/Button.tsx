import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

// Every variant is at least 44px tall (min-h-11) so it is easy to tap.
const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-6 font-tech text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  // Gold fill with obsidian text: 8.2:1 contrast.
  primary: 'bg-gold text-obsidian hover:brightness-110 shadow-[0_0_24px_-6px_var(--color-ember)]',
  secondary: 'border border-gold text-gold hover:bg-burgundy hover:text-silver',
  ghost: 'text-silver hover:bg-charcoal hover:text-gold',
}

interface CommonProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { to?: undefined }

type LinkButtonProps = CommonProps & { to: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }

// Renders a real <button>, or a router <Link> that looks like a button when `to` is given.
// Links navigate and buttons act, so each uses the right HTML element for screen readers.
export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', className, children } = props
  const classes = cn(base, variants[variant], className)
  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    )
  }
  const { variant: _v, className: _c, children: _ch, to: _t, ...rest } = props
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
