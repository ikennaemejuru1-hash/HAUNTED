import { FlaskConical } from 'lucide-react'
import { useMemo } from 'react'
import { formatAmount } from '../../data/currency'
import { alchemize } from '../../engine/alchemist'
import type { QuizAnswers } from '../../types/quiz'
import { SaveButton } from '../grimoire/SaveButton'
import { Badge, Button, GlassPanel } from '../ui'
import { CostumeImage } from './CostumeImage'

// The Wardrobe Alchemist (R9): costumes you can build from what you already own.
export function AlchemistPanel({ answers }: { answers: QuizAnswers }) {
  const { mode, note, items } = useMemo(() => alchemize(answers), [answers])
  const money = (n: number) => formatAmount(n, answers.currency)
  return (
    <section aria-labelledby="alchemist-heading" className="space-y-4">
      <div className="flex items-center gap-3">
        <FlaskConical className="text-gold" size={28} aria-hidden="true" />
        <h2 id="alchemist-heading" className="text-2xl">Wardrobe Alchemist</h2>
      </div>
      <GlassPanel className="bg-obsidian/75 p-4" role="note">
        <p>{note}</p>
        {mode !== 'owned' && <div className="mt-3"><Button to="/quiz" variant="secondary">{mode === 'none' ? 'Take the quiz' : 'Change my answers'}</Button></div>}
      </GlassPanel>
      {items.length === 0 ? (
        <p>No look fits your budget. Try a larger budget in the quiz.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={i.costume.id}>
              <GlassPanel className="flex h-full flex-col gap-3 bg-obsidian/75 p-4" data-testid="alchemist-card">
                <CostumeImage costume={i.costume} />
                <h3 className="text-xl">{i.costume.name}</h3>
                {i.owned.length > 0 && <div><Badge tone="gold">You own</Badge><p className="mt-1 text-sm">{i.owned.join(', ')}</p></div>}
                {i.missing.length > 0 && <div><Badge tone="ember">You need</Badge><p className="mt-1 text-sm">{i.missing.join(', ')}</p></div>}
                <p className="text-sm"><span className="label-tech text-xs uppercase">Styling</span><br />{i.styling.map((t) => t.replace(/\.$/, '')).join('. ')}.</p>
                <p className="text-sm text-ash">Extra cost about {money(i.extraCostUsd.min)} to {money(i.extraCostUsd.max)}.</p>
                <div className="mt-auto pt-2"><SaveButton id={i.costume.id} name={i.costume.name} /></div>
              </GlassPanel>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
