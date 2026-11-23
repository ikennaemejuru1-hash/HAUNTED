import { IDENTITIES, AESTHETIC_ORDER } from '../data/identities'
import { QUESTIONS } from '../data/questions'
import type { Identity, Influence } from '../types/engine'
import type { AestheticId, Choice, QuizAnswers } from '../types/quiz'
import { HYBRID_MAX_GAP, HYBRID_MIN_SECOND, POINTS_PER_ANSWER } from './constants'

const CHOICE_TO_AESTHETIC: Record<Choice, AestheticId> = { A: 'velvet', B: 'arcane', C: 'crimson', D: 'neon' }
const QKEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

// Only Q1 to Q6 are read here. Q7 to Q12 can never change the identity (R4.7).
export function scoreAesthetics(a: QuizAnswers): { scores: Record<AestheticId, number>; influencedBy: Influence[] } {
  const scores: Record<AestheticId, number> = { velvet: 0, arcane: 0, crimson: 0, neon: 0 }
  const influencedBy: Influence[] = []
  for (const key of QKEYS) {
    const choice = a[key]
    if (!choice) continue
    const aesthetic = CHOICE_TO_AESTHETIC[choice]
    scores[aesthetic] += POINTS_PER_ANSWER
    const q = QUESTIONS.find((x) => x.key === key)
    influencedBy.push({
      question: q?.prompt ?? key,
      answer: q?.options.find((o) => o.value === choice)?.label ?? choice,
      aesthetic,
    })
  }
  return { scores, influencedBy }
}

// Highest score first. Ties: the aesthetic picked on Q5, then Q1, then Q4, then fixed order (R4.3).
export function rankAesthetics(scores: Record<AestheticId, number>, a: QuizAnswers): AestheticId[] {
  const picked = (key: 'q5' | 'q1' | 'q4', id: AestheticId) => (a[key] && CHOICE_TO_AESTHETIC[a[key]] === id ? 1 : 0)
  return [...AESTHETIC_ORDER].sort(
    (x, y) =>
      scores[y] - scores[x] ||
      picked('q5', y) - picked('q5', x) ||
      picked('q1', y) - picked('q1', x) ||
      picked('q4', y) - picked('q4', x) ||
      AESTHETIC_ORDER.indexOf(x) - AESTHETIC_ORDER.indexOf(y),
  )
}

// Lead's first word plus the secondary's second word, e.g. Velvet + Crimson = "Velvet Phantom" (R4.6).
export function hybridName(primary: AestheticId, secondary: AestheticId): string {
  return `${IDENTITIES[primary].word1} ${IDENTITIES[secondary].word2}`
}

export function computeIdentity(a: QuizAnswers): Identity {
  const { scores, influencedBy } = scoreAesthetics(a)
  const [primary, secondary] = rankAesthetics(scores, a)
  const isHybrid = scores[primary] - scores[secondary] <= HYBRID_MAX_GAP && scores[secondary] >= HYBRID_MIN_SECOND
  return {
    name: isHybrid ? hybridName(primary, secondary) : IDENTITIES[primary].name,
    isHybrid, primary, secondary, scores, influencedBy,
  }
}
