export type AestheticId = 'velvet' | 'arcane' | 'crimson' | 'neon'
export type Choice = 'A' | 'B' | 'C' | 'D'
export type BudgetTier = 'lt20' | '20to50' | '50to100' | 'gt100'
export type TimeTier = 'lt30m' | '30m2h' | '2to5h' | 'gt5h'
export type ComfortId = 'simple' | 'stylish' | 'elaborate' | 'experimental'
export type EventId = 'party' | 'photoshoot' | 'school' | 'trick' | 'fun'
export type PlayMode = 'solo' | 'couple' | 'group' | 'open'
export type Currency = 'NGN' | 'USD' | 'GBP'
export type WardrobeItem =
  | 'black' | 'white' | 'jackets' | 'boots' | 'dresses'
  | 'accessories' | 'makeup' | 'themed' | 'other' | 'scratch'

export interface QuizAnswers {
  q1?: Choice
  q2?: Choice
  q3?: Choice
  q4?: Choice
  q5?: Choice
  q6?: Choice
  budget?: BudgetTier
  currency: Currency
  time?: TimeTier
  comfort?: ComfortId
  wardrobe: WardrobeItem[]
  event?: EventId
  playMode?: PlayMode
}

// The answer slots that a question writes to.
export type SingleKey = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'budget' | 'time' | 'comfort' | 'event' | 'playMode'
export type QuestionKey = SingleKey | 'wardrobe'

export type SectionId = 'A' | 'B' | 'C' | 'D'

export interface AnswerOption {
  value: string
  label: string
  hint?: string
}

export interface Question {
  number: number
  key: QuestionKey
  section: SectionId
  prompt: string
  kind: 'single' | 'multi'
  options: AnswerOption[]
  // Q7 only: option labels depend on the chosen currency.
  currencyAware?: boolean
}

export interface QuizState {
  answers: QuizAnswers
  step: number
}
