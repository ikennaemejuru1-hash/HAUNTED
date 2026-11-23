import { useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Minimal save store used by the results page. The Grimoire phase (7.1) replaces this with GrimoireContext,
// keeping the same key so anything saved here carries over.
export const GRIMOIRE_KEY = 'haunted:v1:grimoire'

export interface SavedData {
  identity: string | null
  costumes: string[]
}

const empty: SavedData = { identity: null, costumes: [] }

function validate(raw: unknown): SavedData | null {
  if (typeof raw !== 'object' || raw === null) return null
  const { identity, costumes } = raw as Record<string, unknown>
  return {
    identity: typeof identity === 'string' ? identity : null,
    costumes: Array.isArray(costumes) ? [...new Set(costumes.filter((c): c is string => typeof c === 'string'))] : [],
  }
}

export function useSavedLooks() {
  const [data, setData] = useLocalStorage<SavedData>(GRIMOIRE_KEY, empty, validate)
  const saveResult = useCallback(
    (identity: string, costumeIds: string[]) =>
      setData((d) => ({ identity, costumes: [...new Set([...d.costumes, ...costumeIds])] })),
    [setData],
  )
  const saveCostume = useCallback(
    (id: string) => setData((d) => (d.costumes.includes(id) ? d : { ...d, costumes: [...d.costumes, id] })),
    [setData],
  )
  return { data, saveResult, saveCostume }
}
