import type { AestheticId, EventId, PlayMode, WardrobeItem } from './quiz'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface RequiredItem {
  label: string
  wardrobe: WardrobeItem
}

export interface Costume {
  id: string
  name: string
  aesthetic: AestheticId
  description: string
  requiredClothing: RequiredItem[]
  requiredAccessories: RequiredItem[]
  makeup: string[]
  costUsd: { min: number; max: number } // estimates
  prepMinutes: number
  difficulty: Difficulty
  diySteps: string[]
  image: string // key into assets.costumes
  events: EventId[]
  playModes: Exclude<PlayMode, 'open'>[]
}

export interface Influence {
  question: string
  answer: string
  aesthetic: AestheticId
}

export interface Identity {
  name: string // "The Velvet Enigma" or a hybrid such as "Velvet Phantom"
  isHybrid: boolean
  primary: AestheticId
  secondary: AestheticId
  scores: Record<AestheticId, number>
  influencedBy: Influence[]
}

export interface Recommendation {
  costume: Costume
  score: number
  reasons: string[]
  owned: string[]
  missing: string[]
  extraCostUsd: { min: number; max: number }
  kind: 'match' | 'closest' | 'stretch'
}

export interface RecommendationResult {
  identity: Identity
  recommendations: Recommendation[] // up to 3
  notices: string[]
}
