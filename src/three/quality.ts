// Chooses how rich the 3D world should be. Pure functions only (no window), so they are unit tested.
export type Tier = 'full' | 'balanced' | 'lite'
export type FxPreference = 'auto' | 'full' | 'lite'

export interface DeviceFacts {
  webgl: boolean
  reducedMotion: boolean
  saveData: boolean
  cores: number | null
  memoryGb: number | null
  screenWidth: number
  preference: FxPreference
  // From a link such as ?fx=lite, used for measuring and for sharing a lite view.
  forced: Tier | null
}

export function chooseTier(f: DeviceFacts): Tier {
  // Hard reasons for lite: nothing the visitor chooses can override these.
  if (!f.webgl || f.reducedMotion) return 'lite'
  if (f.forced) return f.forced
  if (f.preference === 'lite' || f.saveData) return 'lite'
  const narrow = f.screenWidth < 768
  if (f.preference === 'full') return narrow ? 'balanced' : 'full'
  // Automatic choice from what the device tells us.
  if ((f.cores !== null && f.cores <= 2) || (f.memoryGb !== null && f.memoryGb <= 2)) return 'lite'
  if (narrow) return 'balanced'
  const strong = (f.cores === null || f.cores >= 6) && (f.memoryGb === null || f.memoryGb >= 4)
  return strong && f.screenWidth >= 1024 ? 'full' : 'balanced'
}

// Used when the frame rate stays low. Tiers only ever step down during a visit.
export function stepDown(tier: Tier): Tier {
  return tier === 'full' ? 'balanced' : 'lite'
}

export function lowerOf(a: Tier, b: Tier): Tier {
  const order: Tier[] = ['lite', 'balanced', 'full']
  return order[Math.min(order.indexOf(a), order.indexOf(b))]
}

// What each tier draws. The scene reads these numbers instead of hard-coding them.
export const tierSettings = {
  full: { fogLayers: 5, embers: 3000, motes: 220, post: true, dpr: [1, 2] as [number, number], lights: 6 },
  balanced: { fogLayers: 3, embers: 800, motes: 80, post: false, dpr: [1, 1.5] as [number, number], lights: 3 },
} as const
