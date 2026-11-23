import { QUESTIONS } from '../data/questions'
import type { AestheticId, Choice, QuizAnswers } from '../types/quiz'
import { hybridName, computeIdentity } from './scoring'
import { recommend } from './recommend'

const mk = (c: Choice[], rest: Partial<QuizAnswers> = {}): QuizAnswers => ({
  q1: c[0], q2: c[1], q3: c[2], q4: c[3], q5: c[4], q6: c[5], currency: 'USD', wardrobe: [], ...rest,
})
const all = (c: Choice) => mk([c, c, c, c, c, c])
const full = (rest: Partial<QuizAnswers> = {}) =>
  mk(['A', 'A', 'A', 'A', 'A', 'A'], { budget: 'gt100', time: 'gt5h', comfort: 'stylish', wardrobe: ['black'], event: 'party', playMode: 'solo', ...rest })

describe('identity scoring (AC4 to AC6)', () => {
  it.each<[string, QuizAnswers, string, boolean, number]>([
    ['all A', all('A'), 'The Velvet Enigma', false, 18],
    ['all B', all('B'), 'The Arcane Wanderer', false, 18],
    ['all C', all('C'), 'The Crimson Phantom', false, 18],
    ['all D', all('D'), 'The Neon Revenant', false, 18],
    ['Velvet 9 / Crimson 9 (Q5 = A)', mk(['C', 'A', 'C', 'A', 'A', 'C']), 'Velvet Phantom', true, 9],
    ['Velvet 12 / Arcane 6', mk(['A', 'A', 'A', 'A', 'B', 'B']), 'The Velvet Enigma', false, 12],
    ['Arcane 9 / Velvet 9 (Q5 = B)', mk(['A', 'B', 'A', 'A', 'B', 'B']), 'Arcane Enigma', true, 9],
    ['Crimson 9 / Arcane 6 (gap 3)', mk(['C', 'C', 'C', 'B', 'B', 'D']), 'Crimson Wanderer', true, 9],
    ['Neon 9 / Crimson 9 (Q5 = D)', mk(['C', 'C', 'C', 'D', 'D', 'D']), 'Neon Phantom', true, 9],
    ['second below 6 is not hybrid', mk(['A', 'A', 'A', 'A', 'A', 'B']), 'The Velvet Enigma', false, 15],
  ])('%s', (_n, a, name, hybrid, top) => {
    const id = computeIdentity(a)
    expect(id.name).toBe(name)
    expect(id.isHybrid).toBe(hybrid)
    expect(id.scores[id.primary]).toBe(top)
  })

  it('breaks ties by Q5, then Q1, then Q4, then fixed order', () => {
    expect(computeIdentity(mk(['A', 'A', 'B', 'B', 'B', 'A'])).primary).toBe('arcane')
    // 6 vs 6 vs 6 vs 0: Q5 = C
    expect(computeIdentity(mk(['A', 'A', 'B', 'B', 'C', 'C'])).primary).toBe('crimson')
    // Q5 not in tie, Q1 = A decides
    expect(computeIdentity(mk(['A', 'A', 'B', 'B', 'D', 'D'])).primary).toBe('neon')
    expect(computeIdentity(mk(['A', 'B', 'B', 'D', 'C', 'C'])).primary).toBe('crimson')
    // all unanswered: fixed order
    expect(computeIdentity({ currency: 'USD', wardrobe: [] }).primary).toBe('velvet')
  })

  it('names hybrids from the lead first word and secondary second word (R4.6)', () => {
    const pairs: [AestheticId, AestheticId, string][] = [
      ['velvet', 'crimson', 'Velvet Phantom'], ['arcane', 'velvet', 'Arcane Enigma'],
      ['crimson', 'arcane', 'Crimson Wanderer'], ['neon', 'crimson', 'Neon Phantom'],
    ]
    pairs.forEach(([p, s, n]) => expect(hybridName(p, s)).toBe(n))
  })

  it('records which answers influenced the score', () => {
    expect(computeIdentity(all('C')).influencedBy).toHaveLength(6)
  })
})

describe('determinism and Q7 to Q12 independence (AC7, AC11)', () => {
  it('returns identical results for identical answers', () => {
    expect(recommend(full())).toEqual(recommend(full()))
  })
  it('keeps the identity when only Q7 to Q12 change', () => {
    const base = computeIdentity(full())
    const budgets = ['lt20', '20to50', '50to100', 'gt100'] as const
    const times = ['lt30m', '30m2h', '2to5h', 'gt5h'] as const
    for (const budget of budgets) for (const time of times) for (const comfort of ['simple', 'experimental'] as const) {
      const r = recommend(full({ budget, time, comfort, wardrobe: ['scratch'], event: 'school', playMode: 'group' }))
      expect(r.identity).toEqual(base)
    }
  })
  it('does not mutate the answers', () => {
    const a = full({ wardrobe: ['black', 'boots'] })
    const copy = structuredClone(a)
    recommend(a)
    expect(a).toEqual(copy)
  })
})

describe('filters (AC8, AC9)', () => {
  it('never recommends a costume above a tight budget', () => {
    const r = recommend(full({ budget: 'lt20' }))
    expect(r.recommendations.length).toBe(3)
    r.recommendations.forEach((x) => { expect(x.costume.costUsd.min).toBeLessThanOrEqual(20); expect(x.kind).not.toBe('stretch') })
  })
  it('never recommends a costume above a 30 minute limit', () => {
    const r = recommend(full({ time: 'lt30m' }))
    r.recommendations.forEach((x) => expect(x.costume.prepMinutes).toBeLessThanOrEqual(30))
  })
  it('honours the 2 to 5 hour ceiling on every budget', () => {
    for (const budget of ['lt20', '20to50', '50to100', 'gt100'] as const) {
      recommend(full({ budget, time: '2to5h' })).recommendations.forEach((x) => expect(x.costume.prepMinutes).toBeLessThanOrEqual(300))
    }
  })
})

describe('wardrobe ranking (AC10)', () => {
  it('ranks owned-item costumes above equal ones without them', () => {
    const none = recommend(full({ wardrobe: ['scratch'] }))
    const owns = recommend(full({ wardrobe: ['black', 'boots', 'accessories'] }))
    const score = (r: typeof none, id: string) => r.recommendations.find((x) => x.costume.id === id)?.score
    const best = owns.recommendations[0]
    expect(best.owned.length).toBeGreaterThan(0)
    const before = score(none, best.costume.id)
    if (before !== undefined) expect(best.score).toBeGreaterThan(before)
  })
  it('reports owned and missing items and extra cost', () => {
    const r = recommend(full({ wardrobe: ['black', 'boots', 'accessories'], budget: 'gt100' }))
    for (const x of r.recommendations) {
      expect(x.owned.length + x.missing.length).toBe(x.costume.requiredClothing.length + x.costume.requiredAccessories.length)
      expect(x.extraCostUsd.max).toBeLessThanOrEqual(x.costume.costUsd.max)
    }
  })
})

describe('restrictive and edge cases', () => {
  it('prefers cheap, quick looks when starting from scratch', () => {
    const r = recommend(full({ wardrobe: ['scratch'] }))
    expect(r.recommendations[0].costume.costUsd.min).toBeLessThanOrEqual(30)
    expect(r.notices.join(' ')).toMatch(/wardrobe/)
  })
  it('relaxes play mode, event, comfort in order and marks closest', () => {
    const r = recommend(full({ budget: 'lt20', time: 'lt30m', comfort: 'elaborate', event: 'school', playMode: 'couple' }))
    expect(r.recommendations.length).toBe(3)
    expect(r.recommendations.some((x) => x.kind === 'closest')).toBe(true)
    expect(r.notices.join(' ')).toMatch(/closest/)
    r.recommendations.forEach((x) => { expect(x.costume.costUsd.min).toBeLessThanOrEqual(20); expect(x.costume.prepMinutes).toBeLessThanOrEqual(30) })
  })
  it('returns unique recommendations, at most 3', () => {
    const r = recommend(full())
    expect(new Set(r.recommendations.map((x) => x.costume.id)).size).toBe(r.recommendations.length)
    expect(r.recommendations.length).toBeLessThanOrEqual(3)
  })
  it('works with only Q1 to Q6 answered', () => {
    expect(recommend(all('B')).recommendations).toHaveLength(3)
  })
  it.each(['A', 'B', 'C', 'D'] as const)('all-%s puts its own aesthetic first', (c) => {
    const r = recommend({ ...all(c), budget: 'gt100', time: 'gt5h' })
    expect(r.recommendations[0].costume.aesthetic).toBe(r.identity.primary)
  })
})

describe('reasons (R4.11)', () => {
  it('quote the user answers', () => {
    const r = recommend(full({ budget: 'lt20', time: 'lt30m', wardrobe: ['black', 'accessories'] }))
    const text = r.recommendations[0].reasons.join(' | ')
    expect(text).toMatch(/Fits your budget: Under \$20/)
    expect(text).toMatch(/under 30 minutes/)
    expect(text).toMatch(/You already own \d of \d required items/)
    expect(text).toMatch(/party/i)
  })
  it('shows budget in the chosen currency', () => {
    const r = recommend(full({ budget: 'lt20', currency: 'GBP' }))
    expect(r.recommendations[0].reasons.join(' ')).toMatch(/£/)
  })
})

describe('data sanity', () => {
  it('QUESTIONS Q1 to Q6 are the identity questions', () => {
    expect(QUESTIONS.slice(0, 6).map((q) => q.key)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6'])
  })
})
