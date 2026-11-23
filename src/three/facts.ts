import { readItem } from '../utils/storage'
import type { DeviceFacts, FxPreference, Tier } from './quality'

export const FX_KEY = 'haunted:v1:fx'

interface NavigatorExtras {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function readPreference(): FxPreference {
  const v = readItem(FX_KEY)
  return v === 'full' || v === 'lite' ? v : 'auto'
}

// Reads the browser. Kept out of quality.ts so that file stays pure.
export function readDeviceFacts(): DeviceFacts {
  const nav = navigator as Navigator & NavigatorExtras
  const fx = new URLSearchParams(window.location.search).get('fx')
  const forced: Tier | null = fx === 'lite' || fx === 'full' || fx === 'balanced' ? fx : null
  return {
    // WebGL2RenderingContext is missing in jsdom and old browsers, which means "no 3D".
    webgl: typeof WebGL2RenderingContext !== 'undefined' || typeof WebGLRenderingContext !== 'undefined',
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    saveData: nav.connection?.saveData ?? false,
    cores: nav.hardwareConcurrency ?? null,
    memoryGb: nav.deviceMemory ?? null,
    screenWidth: window.innerWidth,
    preference: readPreference(),
    forced,
  }
}
