import { createContext, useContext } from 'react'
import type { SavedIdentity } from './grimoireLogic'

export interface GrimoireContextValue {
  identity: SavedIdentity | null
  costumes: string[]
  /** False when Local Storage is blocked: saves still work, but only until the page closes. */
  persistent: boolean
  isSaved: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  saveResult: (identity: SavedIdentity, ids: string[]) => void
}

export const GrimoireContext = createContext<GrimoireContextValue | null>(null)

export function useGrimoire(): GrimoireContextValue {
  const ctx = useContext(GrimoireContext)
  if (!ctx) throw new Error('useGrimoire must be used inside GrimoireProvider')
  return ctx
}
