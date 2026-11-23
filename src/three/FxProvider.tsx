import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { writeItem } from '../utils/storage'
import type { FxPreference, Tier } from './quality'
import { FX_KEY, readDeviceFacts } from './facts'
import { FxContext } from './fxContext'
import { chooseTier, lowerOf, stepDown } from './quality'

export function FxProvider({ children }: { children: ReactNode }) {
  const [facts, setFacts] = useState(readDeviceFacts)
  // The lowest tier the runtime has forced during this visit.
  const [cap, setCap] = useState<Tier>('full')

  const setPreference = useCallback((preference: FxPreference) => {
    writeItem(FX_KEY, preference)
    setFacts((f) => ({ ...f, preference, forced: null }))
    setCap('full')
  }, [])
  const tier = lowerOf(chooseTier(facts), cap)
  // A tier chosen with ?fx=... is deliberate, so slow frames do not override it.
  const downgrade = useCallback(() => {
    if (!facts.forced) setCap(stepDown(tier))
  }, [facts.forced, tier])
  const fallToLite = useCallback(() => setCap('lite'), [])
  const value = useMemo(() => ({ tier, setPreference, downgrade, fallToLite }), [tier, setPreference, downgrade, fallToLite])
  return <FxContext.Provider value={value}>{children}</FxContext.Provider>
}
