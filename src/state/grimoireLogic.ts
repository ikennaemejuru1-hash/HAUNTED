import { COSTUMES } from '../data/costumes'
import { AESTHETIC_ORDER, IDENTITIES } from '../data/identities'
import type { AestheticId } from '../types/quiz'

// Grimoire storage (R10.2, R10.5, R10.6). Same key as the early stub so earlier saves carry over.
export const GRIMOIRE_KEY = 'haunted:v1:grimoire'
// Bump this and add a branch in `migrate` when the saved shape changes.
export const GRIMOIRE_VERSION = 1

export interface SavedIdentity {
  name: string
  primary: AestheticId
  secondary: AestheticId
}

export interface GrimoireData {
  version: number
  identity: SavedIdentity | null
  costumes: string[]
}

export const emptyGrimoire = (): GrimoireData => ({ version: GRIMOIRE_VERSION, identity: null, costumes: [] })

const KNOWN_IDS = new Set(COSTUMES.map((c) => c.id))
const isAesthetic = (v: unknown): v is AestheticId => typeof v === 'string' && (AESTHETIC_ORDER as string[]).includes(v)

// Unknown, duplicate and non-text ids are dropped, so a removed costume never crashes the page.
export function cleanIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.filter((c): c is string => typeof c === 'string' && KNOWN_IDS.has(c)))]
}

// The first stub stored only the identity name. Rebuild primary and secondary from the name:
// "The Velvet Enigma" is one aesthetic, "Velvet Phantom" is word1 of one and word2 of another.
function identityFromName(name: string): SavedIdentity | null {
  const whole = AESTHETIC_ORDER.find((id) => IDENTITIES[id].name === name)
  if (whole) return { name, primary: whole, secondary: whole }
  const [w1, w2] = name.split(' ')
  const primary = AESTHETIC_ORDER.find((id) => IDENTITIES[id].word1 === w1)
  const secondary = AESTHETIC_ORDER.find((id) => IDENTITIES[id].word2 === w2)
  return primary && secondary ? { name, primary, secondary } : null
}

function cleanIdentity(raw: unknown): SavedIdentity | null {
  if (typeof raw === 'string') return identityFromName(raw)
  if (typeof raw !== 'object' || raw === null) return null
  const { name, primary, secondary } = raw as Record<string, unknown>
  return typeof name === 'string' && isAesthetic(primary) && isAesthetic(secondary) ? { name, primary, secondary } : null
}

// Accepts the current shape, the unversioned stub shape, and nothing else. Returns null for junk.
export function validateGrimoire(raw: unknown): GrimoireData | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const { version, identity, costumes } = raw as Record<string, unknown>
  // A version from the future cannot be read safely, so it is ignored rather than guessed at.
  if (typeof version === 'number' && version > GRIMOIRE_VERSION) return null
  return { version: GRIMOIRE_VERSION, identity: cleanIdentity(identity), costumes: cleanIds(costumes) }
}
