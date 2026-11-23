import { QUESTIONS } from '../data/questions'
import type { Question, QuizAnswers, QuizState, SingleKey, WardrobeItem } from '../types/quiz'

export const QUIZ_KEY = 'haunted:v1:quiz'
export const TOTAL = QUESTIONS.length

export const emptyAnswers = (): QuizAnswers => ({ currency: 'NGN', wardrobe: [] })
export const initialState = (): QuizState => ({ answers: emptyAnswers(), step: 0 })

export function isAnswered(q: Question, a: QuizAnswers): boolean {
  return q.key === 'wardrobe' ? a.wardrobe.length > 0 : a[q.key] !== undefined
}

// Q10: "scratch" clears every other choice, and any other choice clears "scratch".
export function toggleWardrobe(current: WardrobeItem[], item: WardrobeItem): WardrobeItem[] {
  if (item === 'scratch') return current.includes('scratch') ? [] : ['scratch']
  const without = current.filter((i) => i !== 'scratch')
  return without.includes(item) ? without.filter((i) => i !== item) : [...without, item]
}

export function setSingle(a: QuizAnswers, key: SingleKey, value: string): QuizAnswers {
  return { ...a, [key]: value }
}

// Accepts only well-formed saved data. Anything else returns null so the caller starts fresh.
export function validateState(raw: unknown): QuizState | null {
  if (typeof raw !== 'object' || raw === null) return null
  const { answers, step } = raw as Record<string, unknown>
  if (typeof answers !== 'object' || answers === null) return null
  if (typeof step !== 'number' || !Number.isInteger(step) || step < 0 || step >= TOTAL) return null
  const src = answers as Record<string, unknown>
  const clean = emptyAnswers()
  if (src.currency === 'NGN' || src.currency === 'USD' || src.currency === 'GBP') clean.currency = src.currency
  for (const q of QUESTIONS) {
    const allowed = q.options.map((o) => o.value)
    if (q.key === 'wardrobe') {
      if (Array.isArray(src.wardrobe)) {
        const items = [...new Set(src.wardrobe)].filter((v): v is WardrobeItem => allowed.includes(v as string))
        clean.wardrobe = items.includes('scratch') ? ['scratch'] : items
      }
    } else if (typeof src[q.key] === 'string' && allowed.includes(src[q.key] as string)) {
      ;(clean as unknown as Record<string, unknown>)[q.key] = src[q.key]
    }
  }
  // Never resume past a question whose earlier answers are missing.
  const firstGap = QUESTIONS.findIndex((q) => !isAnswered(q, clean))
  return { answers: clean, step: firstGap === -1 ? step : Math.min(step, firstGap) }
}
