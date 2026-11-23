// Awakening timeline in seconds (design 11.5). The whole reveal ends before 10 s (R6.1, AC21).
export const PHASES = [
  { name: 'gather', at: 0 }, // altar in darkness, embers flow in
  { name: 'orbit', at: 1.5 }, // four artefacts orbit, candles ignite
  { name: 'rise', at: 4 }, // others dissolve, the primary artefact rises
  { name: 'sigil', at: 6.5 }, // light shifts to the identity palette, sigil draws
  { name: 'reveal', at: 8 }, // "ALTER EGO HAS AWAKENED", camera settles
  { name: 'card', at: 9 }, // identity card rises
] as const

export type PhaseName = (typeof PHASES)[number]['name']
export const PHASE_ORDER: PhaseName[] = PHASES.map((p) => p.name)
export const atOrAfter = (phase: PhaseName, than: PhaseName) => PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(than)
