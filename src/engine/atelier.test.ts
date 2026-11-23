import { COSTUMES } from '../data/costumes'
import type { QuizAnswers } from '../types/quiz'
import { alchemize } from './alchemist'
import { BUDGET_CEILING_USD, TIME_CEILING_MIN } from './constants'
import { filterCostumes } from './filters'

const base: QuizAnswers = { currency: 'USD', wardrobe: [] }

describe('Atelier filters (R8.2)', () => {
  it('no filters returns everything', () => expect(filterCostumes(COSTUMES, {})).toHaveLength(COSTUMES.length))
  it('aesthetic', () => {
    const r = filterCostumes(COSTUMES, { aesthetic: 'crimson' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((c) => c.aesthetic === 'crimson')).toBe(true)
  })
  it('budget uses the cheapest cost against the ceiling', () => {
    const r = filterCostumes(COSTUMES, { budget: 'lt20' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((c) => c.costUsd.min <= BUDGET_CEILING_USD.lt20)).toBe(true)
  })
  it('difficulty', () => expect(filterCostumes(COSTUMES, { difficulty: 'easy' }).every((c) => c.difficulty === 'easy')).toBe(true))
  it('prep time', () => expect(filterCostumes(COSTUMES, { time: 'lt30m' }).every((c) => c.prepMinutes <= TIME_CEILING_MIN.lt30m)).toBe(true))
  it('solo, couple or group', () => expect(filterCostumes(COSTUMES, { play: 'group' }).every((c) => c.playModes.includes('group'))).toBe(true))
  it('filters combine with AND', () => {
    const all = filterCostumes(COSTUMES, { aesthetic: 'velvet', difficulty: 'easy', budget: 'lt20' })
    expect(all.every((c) => c.aesthetic === 'velvet' && c.difficulty === 'easy' && c.costUsd.min <= 20)).toBe(true)
    expect(all.length).toBeLessThan(filterCostumes(COSTUMES, { aesthetic: 'velvet' }).length)
  })
  it('can match nothing (AC18)', () => expect(filterCostumes(COSTUMES, { aesthetic: 'neon', budget: 'lt20', time: 'lt30m', difficulty: 'hard' })).toEqual([]))
})

describe('Wardrobe Alchemist (R9)', () => {
  it('lists looks built mostly from owned items and reports owned, missing, styling and extra cost', () => {
    const r = alchemize({ ...base, wardrobe: ['black', 'boots', 'accessories', 'jackets'] })
    expect(r.mode).toBe('owned')
    expect(r.items.length).toBeGreaterThan(0)
    for (const i of r.items) {
      expect(i.owned.length / (i.owned.length + i.missing.length)).toBeGreaterThanOrEqual(0.5)
      expect(i.styling.length).toBeGreaterThan(0)
    }
  })
  it('never lists a look whose extra cost is above the budget (R9.3)', () => {
    for (const wardrobe of [['black'], ['black', 'boots', 'jackets'], [], ['scratch']] as QuizAnswers['wardrobe'][]) {
      const r = alchemize({ ...base, budget: 'lt20', wardrobe })
      expect(r.items.every((i) => i.extraCostUsd.max <= 20)).toBe(true)
    }
  })
  it('says so and shows cheapest looks for "Start from scratch" (R9.4)', () => {
    const r = alchemize({ ...base, wardrobe: ['scratch'] })
    expect(r.mode).toBe('scratch')
    expect(r.note).toMatch(/scratch/)
    const costs = r.items.map((i) => i.extraCostUsd.max)
    expect(costs).toEqual([...costs].sort((a, b) => a - b))
  })
  it('works with no quiz result at all', () => {
    const r = alchemize(base)
    expect(r.mode).toBe('none')
    expect(r.items.length).toBeGreaterThan(0)
  })
})
