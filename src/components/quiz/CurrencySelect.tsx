import { CURRENCIES } from '../../data/currency'
import type { Currency } from '../../types/quiz'
import { cn } from '../../utils/cn'

interface Props {
  value: Currency
  onChange: (c: Currency) => void
}

export function CurrencySelect({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <p id="currency-label" className="label-tech mb-2">Currency (approximate rates)</p>
      <div role="radiogroup" aria-labelledby="currency-label" className="inline-flex gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={c === value}
            onClick={() => onChange(c)}
            className={cn(
              'label-tech min-h-11 min-w-16 rounded-sm border px-4 transition-colors',
              c === value ? 'border-gold bg-gold text-obsidian' : 'border-ash/50 text-silver hover:border-gold',
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
