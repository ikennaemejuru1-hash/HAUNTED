import { COSTUMES } from '../data/costumes'
import { budgetLabel } from '../data/currency'
import type { Costume, Identity, Recommendation, RecommendationResult } from '../types/engine'
import type { QuizAnswers, WardrobeItem } from '../types/quiz'
import {
  BUDGET_CEILING_USD, COMFORT, COST_SCALE_USD, HEADROOM_SCALE_USD, MAX_RECOMMENDATIONS, TIME_CEILING_MIN,
  TIME_SCALE_MIN, WEIGHTS,
} from './constants'
import { computeIdentity } from './scoring'
import { buildReasons } from './reasons'

const ownedSet = (a: QuizAnswers): Set<WardrobeItem> => new Set(a.wardrobe.filter((w) => w !== 'scratch'))
const requiredItems = (c: Costume) => [...c.requiredClothing, ...c.requiredAccessories]

// Hard filters (R4.8). Missing answers do not filter.
export function passesHard(c: Costume, a: QuizAnswers): boolean {
  const budgetOk = !a.budget || c.costUsd.min <= BUDGET_CEILING_USD[a.budget]
  const timeOk = !a.time || c.prepMinutes <= TIME_CEILING_MIN[a.time]
  return budgetOk && timeOk
}

export function wardrobeMatch(c: Costume, a: QuizAnswers): { owned: string[]; missing: string[] } {
  const have = ownedSet(a)
  const items = requiredItems(c)
  return {
    owned: items.filter((i) => have.has(i.wardrobe)).map((i) => i.label),
    missing: items.filter((i) => !have.has(i.wardrobe)).map((i) => i.label),
  }
}

function fits(c: Costume, a: QuizAnswers) {
  return {
    playMode: !a.playMode || a.playMode === 'open' || c.playModes.includes(a.playMode),
    event: !a.event || c.events.includes(a.event),
    comfort: !a.comfort || COMFORT[a.comfort].range.includes(c.difficulty),
  }
}

function softScore(c: Costume, a: QuizAnswers, id: Identity, restrictive: boolean): number {
  let s = 0
  if (c.aesthetic === id.primary) s += WEIGHTS.primary
  else if (c.aesthetic === id.secondary) s += WEIGHTS.secondary
  const { owned } = wardrobeMatch(c, a)
  const total = requiredItems(c).length
  s += total ? WEIGHTS.wardrobe * (owned.length / total) : 0
  if (a.comfort) {
    if (c.difficulty === COMFORT[a.comfort].ideal) s += WEIGHTS.comfortIdeal
    else if (COMFORT[a.comfort].range.includes(c.difficulty)) s += WEIGHTS.comfortInRange
  }
  const f = fits(c, a)
  if (a.event && f.event) s += WEIGHTS.event
  if (f.playMode) s += WEIGHTS.playMode
  const ceiling = a.budget && Number.isFinite(BUDGET_CEILING_USD[a.budget]) ? BUDGET_CEILING_USD[a.budget] : HEADROOM_SCALE_USD
  s += WEIGHTS.headroom * Math.max(0, 1 - c.costUsd.min / ceiling)
  if (restrictive) {
    s += WEIGHTS.restrictiveCost * Math.max(0, 1 - c.costUsd.min / COST_SCALE_USD)
    s += WEIGHTS.restrictiveTime * Math.max(0, 1 - c.prepMinutes / TIME_SCALE_MIN)
  }
  return Math.round(s * 100) / 100
}

function extraCost(c: Costume, missing: number, total: number) {
  const ratio = total ? missing / total : 0
  return { min: Math.round(c.costUsd.min * ratio), max: Math.round(c.costUsd.max * ratio) }
}

function build(c: Costume, a: QuizAnswers, id: Identity, restrictive: boolean, kind: Recommendation['kind']): Recommendation {
  const { owned, missing } = wardrobeMatch(c, a)
  const rec: Recommendation = {
    costume: c, score: softScore(c, a, id, restrictive), reasons: [], owned, missing,
    extraCostUsd: extraCost(c, missing.length, owned.length + missing.length), kind,
  }
  rec.reasons = buildReasons(rec, a, id)
  return rec
}

// Highest score first; equal scores break by costume id so output is stable (design step 6).
const byScore = (x: Recommendation, y: Recommendation) => y.score - x.score || x.costume.id.localeCompare(y.costume.id)

// Relaxation order (R4.10): play mode, then event, then comfort. Budget and time are never relaxed.
const RELAX_STAGES: ('playMode' | 'event' | 'comfort')[][] = [[], ['playMode'], ['playMode', 'event'], ['playMode', 'event', 'comfort']]

export function recommend(a: QuizAnswers): RecommendationResult {
  const identity = computeIdentity(a)
  const notices: string[] = []
  const pool = COSTUMES.filter((c) => passesHard(c, a))
  const wardrobeKnown = a.wardrobe.length > 0 && !a.wardrobe.includes('scratch')
  const anyOwned = pool.some((c) => wardrobeMatch(c, a).owned.length > 0)
  const restrictive = !wardrobeKnown || !anyOwned

  if (pool.length === 0) {
    // Stretch (R4.12): nothing fits budget and time, so offer the options that exceed the limits by the least.
    const budgetCap = a.budget ? BUDGET_CEILING_USD[a.budget] : Infinity
    const timeCap = a.time ? TIME_CEILING_MIN[a.time] : Infinity
    const overshoot = (c: Costume) =>
      Math.max(0, c.costUsd.min / budgetCap - 1) + Math.max(0, c.prepMinutes / timeCap - 1)
    const stretch = [...COSTUMES]
      .sort((x, y) => {
        const aes = Number(y.aesthetic === identity.primary) - Number(x.aesthetic === identity.primary)
        return aes || overshoot(x) - overshoot(y) || x.costUsd.min - y.costUsd.min || x.id.localeCompare(y.id)
      })
      .slice(0, MAX_RECOMMENDATIONS)
      .map((c) => build(c, a, identity, true, 'stretch'))
    notices.push('Nothing matched your budget and time together, so these are stretch options that exceed your limits by the least.')
    return { identity, recommendations: stretch, notices }
  }

  const chosen: Recommendation[] = []
  const taken = new Set<string>()
  let relaxed = false
  for (const [stage, dropped] of RELAX_STAGES.entries()) {
    if (chosen.length >= MAX_RECOMMENDATIONS) break
    const kind = stage === 0 ? 'match' : 'closest'
    const candidates = pool
      .filter((c) => !taken.has(c.id))
      .filter((c) => {
        const f = fits(c, a)
        return (['playMode', 'event', 'comfort'] as const).every((k) => dropped.includes(k) || f[k])
      })
      .map((c) => build(c, a, identity, restrictive, kind))
      .sort(byScore)
    for (const r of candidates) {
      if (chosen.length >= MAX_RECOMMENDATIONS) break
      chosen.push(r)
      taken.add(r.costume.id)
      if (kind === 'closest') relaxed = true
    }
  }
  if (relaxed) notices.push('Some picks are the closest match, because fewer than 3 costumes fit every answer.')
  if (restrictive) notices.push('Your wardrobe gave little to build on, so the cheapest and quickest looks in your style are preferred.')
  if (a.budget === 'lt20') notices.push(`Your budget is tight (${budgetLabel('lt20', a.currency).toLowerCase()}), so costs are kept low.`)
  return { identity, recommendations: chosen, notices }
}
