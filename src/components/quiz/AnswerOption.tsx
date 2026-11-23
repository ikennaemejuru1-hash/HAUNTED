import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Props {
  label: string
  hint?: string
  selected: boolean
  role: 'radio' | 'checkbox'
  onSelect: () => void
}

// One selectable answer. A short pop plays on selection unless reduced motion is on (R3.9).
export function AnswerOption({ label, hint, selected, role, onSelect }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      animate={selected && !reduce ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex min-h-14 w-full items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors duration-200',
        selected
          ? 'border-ember bg-burgundy/60 text-silver shadow-[0_0_20px_-8px_var(--color-ember)]'
          : 'border-ash/40 bg-charcoal/60 text-silver hover:border-gold hover:bg-burgundy/40',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center border',
          role === 'radio' ? 'rounded-full' : 'rounded-sm',
          selected ? 'border-ember bg-ember text-obsidian' : 'border-ash',
        )}
      >
        {selected && <Check className="size-4" strokeWidth={3} />}
      </span>
      <span>
        <span className="block">{label}</span>
        {hint && <span className="block text-sm text-ash">{hint}</span>}
      </span>
    </motion.button>
  )
}
