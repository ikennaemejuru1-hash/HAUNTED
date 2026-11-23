import { SECTIONS } from '../../data/questions'
import type { SectionId } from '../../types/quiz'

interface Props {
  current: number
  total: number
  section: SectionId
}

export function ProgressBar({ current, total, section }: Props) {
  return (
    <div className="mb-6">
      <div className="label-tech mb-2 flex justify-between">
        <span>Section {section}: {SECTIONS[section]}</span>
        <span>{current} of {total}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Question ${current} of ${total}`}
        className="h-1.5 overflow-hidden rounded-full bg-charcoal"
      >
        <div className="h-full bg-gold transition-[width] duration-300" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  )
}
