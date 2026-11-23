// Every colour used inside the 3D scene. Built from the design tokens, so the scene can never
// contain purple or blue (R15.12). If you add a colour here, the palette test checks it.
export const palette = {
  obsidian: '#0A0908',
  charcoal: '#1E1B1C',
  burgundy: '#641B35',
  gold: '#C5A15B',
  ember: '#E87524',
  ash: '#8A8786',
  silver: '#CFCBC6',
} as const

export type PaletteName = keyof typeof palette

export function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// A colour is "cool" (blue, purple, teal, cyan) when its hue sits between green-cyan and magenta
// (about 165 to 300 degrees) and it is not nearly grey. Burgundy (hue about 340) is warm and passes.
export function isCool(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min
  if (chroma < 0.04) return false
  let hue: number
  if (max === r) hue = ((g - b) / chroma) % 6
  else if (max === g) hue = (b - r) / chroma + 2
  else hue = (r - g) / chroma + 4
  hue = (hue * 60 + 360) % 360
  return hue >= 165 && hue <= 300
}
