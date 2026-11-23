import { COSTUMES } from '../data/costumes'
import type { Costume } from '../types/engine'
import type { QuizAnswers } from '../types/quiz'
import { BUDGET_CEILING_USD } from './constants'
import { wardrobeMatch } from './recommend'

export interface AlchemyItem {
  costume: Costume
  owned: string[]
  missing: string[]
  extraCostUsd: { min: number; max: number }
  styling: string[]
}

export interface AlchemyResult {
  // owned: built from the wardrobe. scratch: the user said they own nothing. none: no wardrobe answer.
  mode: 'owned' | 'scratch' | 'none'
  note: string
  items: AlchemyItem[]
}

const MIN_OWNED_SHARE = 0.5
const MAX_ITEMS = 6

function toItem(c: Costume, a: QuizAnswers): AlchemyItem {
  const { owned, missing } = wardrobeMatch(c, a)
  const total = owned.length + missing.length
  const ratio = total ? missing.length / total : 0
  return {
    costume: c, owned, missing,
    extraCostUsd: { min: Math.round(c.costUsd.min * ratio), max: Math.round(c.costUsd.max * ratio) },
    styling: [...c.makeup, ...c.diySteps.slice(0, 1)],
  }
}

const byCheapest = (x: AlchemyItem, y: AlchemyItem) =>
  x.extraCostUsd.max - y.extraCostUsd.max || x.extraCostUsd.min - y.extraCostUsd.min || x.costume.id.localeCompare(y.costume.id)

// R9. Costumes whose extra cost goes over the budget are never listed (R9.3), in any mode.
export function alchemize(a: QuizAnswers): AlchemyResult {
  const ceiling = a.budget ? BUDGET_CEILING_USD[a.budget] : Infinity
  const fits = (i: AlchemyItem) => i.extraCostUsd.max <= ceiling
  const wardrobe = a.wardrobe.filter((w) => w !== 'scratch')

  const cheapest = (): AlchemyItem[] =>
    COSTUMES.map((c) => toItem(c, { ...a, wardrobe: [] })).filter(fits).sort(byCheapest).slice(0, MAX_ITEMS)

  if (a.wardrobe.includes('scratch')) {
    return { mode: 'scratch', note: 'You chose to start from scratch, so here are the cheapest complete looks.', items: cheapest() }
  }
  if (wardrobe.length === 0) {
    return { mode: 'none', note: 'Take the quiz and tell us what you own, and the Alchemist will build looks from your wardrobe. Until then, here are the cheapest complete looks.', items: cheapest() }
  }
  const items = COSTUMES.map((c) => toItem(c, a))
    .filter((i) => i.owned.length / (i.owned.length + i.missing.length) >= MIN_OWNED_SHARE && fits(i))
    .sort((x, y) => y.owned.length / (y.owned.length + y.missing.length) - x.owned.length / (x.owned.length + x.missing.length) || byCheapest(x, y))
    .slice(0, MAX_ITEMS)
  if (items.length === 0) {
    return { mode: 'owned', note: 'Nothing is mostly buildable from your wardrobe within your budget. Here are the cheapest complete looks instead.', items: cheapest() }
  }
  return { mode: 'owned', note: 'Looks you can build mostly from what you already own.', items }
}
