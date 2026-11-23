import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { storageWorks } from '../utils/storage'
import { GrimoireContext, type GrimoireContextValue } from './grimoireContextValue'
import { GRIMOIRE_KEY, emptyGrimoire, validateGrimoire, type GrimoireData } from './grimoireLogic'

// One shared Grimoire so every Save button on every page shows the same state (R10.1).
export function GrimoireProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<GrimoireData>(GRIMOIRE_KEY, emptyGrimoire(), validateGrimoire)
  const [persistent] = useState(storageWorks)

  const toggle = useCallback(
    (id: string) =>
      setData((d) => ({ ...d, costumes: d.costumes.includes(id) ? d.costumes.filter((c) => c !== id) : [...d.costumes, id] })),
    [setData],
  )
  const remove = useCallback(
    (id: string) => setData((d) => ({ ...d, costumes: d.costumes.filter((c) => c !== id) })),
    [setData],
  )
  const saveResult = useCallback<GrimoireContextValue['saveResult']>(
    (identity, ids) => setData((d) => ({ ...d, identity, costumes: [...new Set([...d.costumes, ...ids])] })),
    [setData],
  )

  const value = useMemo<GrimoireContextValue>(
    () => ({
      identity: data.identity,
      costumes: data.costumes,
      persistent,
      isSaved: (id) => data.costumes.includes(id),
      toggle, remove, saveResult,
    }),
    [data, persistent, toggle, remove, saveResult],
  )
  return <GrimoireContext.Provider value={value}>{children}</GrimoireContext.Provider>
}
