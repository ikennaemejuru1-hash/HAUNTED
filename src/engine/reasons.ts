import { budgetLabel } from '../data/currency'
import { IDENTITIES } from '../data/identities'
import { QUESTIONS } from '../data/questions'
import { BUDGET_CEILING_USD } from './constants'
import type { Identity, Recommendation } from '../types/engine'
import type { QuizAnswers } from '../types/quiz'

const label = (key: string, value: string) =>
  QUESTIONS.find((q) => q.key === key)?.options.find((o) => o.value === value)?.label ?? value

// Plain sentences that quote the user's own answers (R4.11).
export function buildReasons(rec: Recommendation, a: QuizAnswers, id: Identity): string[] {
  const c = rec.costume
  const out: string[] = []
  if (c.aesthetic === id.primary) out.push(`Matches your ${IDENTITIES[id.primary].word1} ${IDENTITIES[id.primary].word2} style`)
  else if (c.aesthetic === id.secondary) out.push(`Draws on your secondary ${IDENTITIES[id.secondary].name.replace('The ', '')} side`)
  if (a.budget) {
    const ok = rec.kind !== 'stretch' && c.costUsd.min <= BUDGET_CEILING_USD[a.budget]
    out.push(ok ? `Fits your budget: ${budgetLabel(a.budget, a.currency)} (estimate)` : `Goes over your budget of ${budgetLabel(a.budget, a.currency)}, so treat it as a stretch`)
  }
  if (a.time) out.push(rec.kind !== 'stretch' ? `Ready within your time: ${label('time', a.time).toLowerCase()}` : `Takes ${c.prepMinutes} minutes, longer than you wanted`)
  const total = rec.owned.length + rec.missing.length
  if (rec.owned.length > 0) out.push(`You already own ${rec.owned.length} of ${total} required items`)
  else if (a.wardrobe.includes('scratch')) out.push('Built from scratch, as you chose')
  if (a.comfort && label('comfort', a.comfort)) out.push(`${c.difficulty[0].toUpperCase()}${c.difficulty.slice(1)} difficulty suits your ${label('comfort', a.comfort).toLowerCase()} taste`)
  if (a.event && c.events.includes(a.event)) out.push(`Works for ${label('event', a.event).toLowerCase()}`)
  if (a.playMode && a.playMode !== 'open' && c.playModes.includes(a.playMode)) out.push(`Works ${a.playMode === 'solo' ? 'on your own' : a.playMode === 'couple' ? 'as a pair' : 'for a group'}`)
  return out
}
