import { assets } from './assets'
import { COSTUMES } from './costumes'
import { AESTHETIC_ORDER } from './identities'
import { BUDGET_CEILING_USD, TIME_CEILING_MIN } from '../engine/constants'

describe('costume dataset (R5.4)', () => {
  it('has at least 5 per aesthetic and 20 in total', () => {
    expect(COSTUMES.length).toBeGreaterThanOrEqual(20)
    AESTHETIC_ORDER.forEach((a) => expect(COSTUMES.filter((c) => c.aesthetic === a).length).toBeGreaterThanOrEqual(5))
  })
  it('has unique ids and valid, non-empty fields', () => {
    expect(new Set(COSTUMES.map((c) => c.id)).size).toBe(COSTUMES.length)
    for (const c of COSTUMES) {
      expect(AESTHETIC_ORDER).toContain(c.aesthetic)
      expect(['easy', 'medium', 'hard']).toContain(c.difficulty)
      expect(c.name.trim()).not.toBe('')
      expect(c.description.trim()).not.toBe('')
      expect(c.requiredClothing.length + c.requiredAccessories.length).toBeGreaterThan(0)
      expect(c.makeup.length).toBeGreaterThan(0)
      expect(c.diySteps.length).toBeGreaterThanOrEqual(3)
      expect(c.events.length).toBeGreaterThan(0)
      expect(c.playModes.length).toBeGreaterThan(0)
      expect(c.costUsd.min).toBeGreaterThan(0)
      expect(c.costUsd.max).toBeGreaterThanOrEqual(c.costUsd.min)
      expect(c.prepMinutes).toBeGreaterThan(0)
      expect(JSON.stringify(c)).not.toContain('\u2014')
    }
  })
  it('has an image entry in the asset manifest for every costume', () => {
    for (const c of COSTUMES) expect(Object.keys(assets.costumes)).toContain(c.image)
  })
  it('covers every budget tier, time tier and play mode', () => {
    const tierOf = (v: number, caps: number[]) => caps.findIndex((cap) => v <= cap)
    const bCaps = Object.values(BUDGET_CEILING_USD)
    const tCaps = Object.values(TIME_CEILING_MIN)
    expect(new Set(COSTUMES.map((c) => tierOf(c.costUsd.min, bCaps))).size).toBe(4)
    expect(new Set(COSTUMES.map((c) => tierOf(c.prepMinutes, tCaps))).size).toBe(4)
    const modes = new Set(COSTUMES.flatMap((c) => c.playModes))
    expect(modes).toEqual(new Set(['solo', 'couple', 'group']))
  })
})
