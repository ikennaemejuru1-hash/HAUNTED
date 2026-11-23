import type { AnswerOption as Option } from '../../types/quiz'
import { AnswerOption } from './AnswerOption'

interface Props {
  labelledBy: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
}

export function MultiSelectGrid({ labelledBy, options, selected, onToggle }: Props) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => (
        <AnswerOption
          key={o.value}
          role="checkbox"
          label={o.label}
          hint={o.hint}
          selected={selected.includes(o.value)}
          onSelect={() => onToggle(o.value)}
        />
      ))}
    </div>
  )
}
