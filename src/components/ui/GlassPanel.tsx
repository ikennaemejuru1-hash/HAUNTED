import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

// A translucent charcoal card with a thin gold edge. It is the main container for content.
export function GlassPanel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md border border-gold/25 bg-charcoal/40 shadow-[inset_0_1px_0_0_rgb(197_161_91/0.12)] backdrop-blur-md',
        className,
      )}
      {...rest}
    />
  )
}
