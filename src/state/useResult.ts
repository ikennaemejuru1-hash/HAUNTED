import { useMemo } from 'react'
import { recommend } from '../engine'
import type { RecommendationResult } from '../types/engine'
import { useQuiz } from './quizContextValue'

// The result is always computed from the saved answers by the pure engine. The Awakening and every
// tier read this same value, so the reveal can never change the outcome (R6.7).
export function useResult(): { result: RecommendationResult | null; answers: ReturnType<typeof useQuiz>['answers']; reset: () => void } {
  const { answers, isComplete, reset } = useQuiz()
  const result = useMemo(() => (isComplete ? recommend(answers) : null), [answers, isComplete])
  return { result, answers, reset }
}
