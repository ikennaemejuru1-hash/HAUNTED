import { createContext, useContext } from 'react'
import type { Currency, QuizAnswers, SingleKey, WardrobeItem } from '../types/quiz'

export interface QuizContextValue {
  answers: QuizAnswers
  step: number
  canNext: boolean
  isComplete: boolean
  answer: (key: SingleKey, value: string) => void
  toggleItem: (item: WardrobeItem) => void
  setCurrency: (c: Currency) => void
  next: () => void
  prev: () => void
  reset: () => void
}

export const QuizContext = createContext<QuizContextValue | null>(null)

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
