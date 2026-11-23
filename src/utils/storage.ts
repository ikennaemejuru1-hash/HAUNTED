// Safe Local Storage access. Private mode or a full disk can make storage throw,
// so every call is wrapped and falls back to memory. Keys are versioned (haunted:v1:*).
const memory = new Map<string, string>()

export function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null
  } catch {
    return memory.get(key) ?? null
  }
}

export function writeItem(key: string, value: string): void {
  memory.set(key, value)
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Blocked storage: the in-memory copy keeps the setting for this visit.
  }
}

// True when Local Storage can really be written. Used to show a gentle "this visit only" notice.
export function storageWorks(): boolean {
  try {
    const probe = 'haunted:probe'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

// Tests only: forget the in-memory copies so one test cannot leak saved data into the next.
export function forgetMemory(): void {
  memory.clear()
}
