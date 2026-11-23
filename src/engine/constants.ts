import type { BudgetTier, ComfortId, TimeTier } from '../types/quiz'
import type { Difficulty } from '../types/engine'

// All tunable numbers live here so the engine logic stays free of magic values (design section 5).
export const POINTS_PER_ANSWER = 3
export const HYBRID_MAX_GAP = 3
export const HYBRID_MIN_SECOND = 6
export const MAX_RECOMMENDATIONS = 3

export const BUDGET_CEILING_USD: Record<BudgetTier, number> = { lt20: 20, '20to50': 50, '50to100': 100, gt100: Infinity }
export const TIME_CEILING_MIN: Record<TimeTier, number> = { lt30m: 30, '30m2h': 120, '2to5h': 300, gt5h: Infinity }
// Used only to scale the "cost headroom" bonus when the budget has no ceiling.
export const HEADROOM_SCALE_USD = 200

export const WEIGHTS = {
  primary: 40,
  secondary: 20,
  wardrobe: 25,
  comfortIdeal: 10,
  comfortInRange: 6,
  event: 5,
  playMode: 5,
  headroom: 5,
  restrictiveCost: 5,
  restrictiveTime: 5,
} as const

export const COMFORT: Record<ComfortId, { ideal: Difficulty; range: Difficulty[] }> = {
  simple: { ideal: 'easy', range: ['easy'] },
  stylish: { ideal: 'medium', range: ['easy', 'medium'] },
  elaborate: { ideal: 'hard', range: ['medium', 'hard'] },
  experimental: { ideal: 'hard', range: ['medium', 'hard'] },
}

export const TIME_SCALE_MIN = 300
export const COST_SCALE_USD = 100
