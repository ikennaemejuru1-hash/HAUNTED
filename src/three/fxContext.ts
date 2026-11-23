import { createContext, useContext } from 'react'
import type { FxPreference, Tier } from './quality'

export interface Fx {
  tier: Tier
  setPreference: (p: FxPreference) => void
  // Called by the 3D chunk when frames are slow or WebGL breaks. Never steps back up.
  downgrade: () => void
  fallToLite: () => void
}

export const FxContext = createContext<Fx | null>(null)

export function useFx(): Fx {
  const fx = useContext(FxContext)
  if (!fx) throw new Error('useFx must be used inside FxProvider')
  return fx
}
