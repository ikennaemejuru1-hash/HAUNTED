import type { Costume, Difficulty } from '../types/engine'
import type { AestheticId, BudgetTier, TimeTier } from '../types/quiz'
import { BUDGET_CEILING_USD, TIME_CEILING_MIN } from './constants'

export type PlayFilter = 'solo' | 'couple' | 'group'

// Every field is optional. An empty field means "any". Fields combine with AND (R8.2).
export interface AtelierFilters {
  aesthetic?: AestheticId
  budget?: BudgetTier
  difficulty?: Difficulty
  time?: TimeTier
  play?: PlayFilter
}

export function filterCostumes(costumes: Costume[], f: AtelierFilters): Costume[] {
  return costumes.filter(
    (c) =>
      (!f.aesthetic || c.aesthetic === f.aesthetic) &&
      // Same rule as the engine (AC8, AC9): the cheapest way to make it must fit the ceiling.
      (!f.budget || c.costUsd.min <= BUDGET_CEILING_USD[f.budget]) &&
      (!f.difficulty || c.difficulty === f.difficulty) &&
      (!f.time || c.prepMinutes <= TIME_CEILING_MIN[f.time]) &&
      (!f.play || c.playModes.includes(f.play)),
  )
}

export const hasFilters = (f: AtelierFilters) => Object.values(f).some(Boolean)
