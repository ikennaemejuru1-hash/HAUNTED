import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { QUESTIONS } from '../data/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Currency, QuizAnswers, QuizState, SingleKey, WardrobeItem } from '../types/quiz'
import { QUIZ_KEY, TOTAL, initialState, isAnswered, setSingle, toggleWardrobe, validateState } from './quizLogic'

interface QuizContextValue {
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

const QuizContext = createContext<QuizContextValue | null>(null)

// Holds the answers and the current question, and saves them so a refresh keeps progress (R3.7).
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<QuizState>(QUIZ_KEY, initialState(), validateState)
  const { answers, step } = state

  const answer = useCallback(
    (key: SingleKey, value: string) => setState((s) => ({ ...s, answers: setSingle(s.answers, key, value) })),
    [setState],
  )
  const toggleItem = useCallback(
    (item: WardrobeItem) =>
      setState((s) => ({ ...s, answers: { ...s.answers, wardrobe: toggleWardrobe(s.answers.wardrobe, item) } })),
    [setState],
  )
  const setCurrency = useCallback(
    (currency: Currency) => setState((s) => ({ ...s, answers: { ...s.answers, currency } })),
    [setState],
  )
  const next = useCallback(
    (): void => setState((s) => (isAnswered(QUESTIONS[s.step], s.answers) && s.step < TOTAL - 1 ? { ...s, step: s.step + 1 } : s)),
    [setState],
  )
  const prev = useCallback((): void => setState((s) => ({ ...s, step: Math.max(0, s.step - 1) })), [setState])
  const reset = useCallback(() => setState(initialState()), [setState])

  const value = useMemo<QuizContextValue>(
    () => ({
      answers,
      step,
      canNext: isAnswered(QUESTIONS[step], answers),
      isComplete: QUESTIONS.every((q) => isAnswered(q, answers)),
      answer, toggleItem, setCurrency, next, prev, reset,
    }),
    [answers, step, answer, toggleItem, setCurrency, next, prev, reset],
  )
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
