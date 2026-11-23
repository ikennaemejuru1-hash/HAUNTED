import { useCallback, useState } from 'react'
import { readItem, writeItem } from '../utils/storage'

// Like useState, but the value is saved under `key`. Saved text that fails to parse or
// fails `validate` is discarded and `initial` is used instead, so bad data never crashes the app.
export function useLocalStorage<T>(key: string, initial: T, validate: (v: unknown) => T | null) {
  const [value, setValue] = useState<T>(() => {
    const raw = readItem(key)
    if (raw === null) return initial
    try {
      return validate(JSON.parse(raw)) ?? initial
    } catch {
      return initial
    }
  })
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        writeItem(key, JSON.stringify(v))
        return v
      })
    },
    [key],
  )
  return [value, set] as const
}
