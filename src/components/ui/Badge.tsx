import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'ember'
  className?: string
}

// Small uppercase tag. Ember is for active or warning states only.
const tones = {
  neutral: 'border-ash/60 text-ash',
  gold: 'border-gold/60 text-gold',
  ember: 'border-ember/70 text-ember',
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm border px-2 py-0.5 font-tech text-xs uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
