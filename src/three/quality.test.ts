import { chooseTier, lowerOf, stepDown, type DeviceFacts } from './quality'

const strong: DeviceFacts = {
  webgl: true, reducedMotion: false, saveData: false, cores: 8, memoryGb: 8,
  screenWidth: 1440, preference: 'auto', forced: null,
}
const facts = (over: Partial<DeviceFacts>): DeviceFacts => ({ ...strong, ...over })

describe('chooseTier (R15.8)', () => {
  it('gives strong desktops the full tier', () => {
    expect(chooseTier(strong)).toBe('full')
  })
  it('gives phones the balanced tier', () => {
    expect(chooseTier(facts({ screenWidth: 390, cores: 6 }))).toBe('balanced')
  })
  it('gives laptops without strong specs the balanced tier', () => {
    expect(chooseTier(facts({ cores: 4 }))).toBe('balanced')
    expect(chooseTier(facts({ screenWidth: 900 }))).toBe('balanced')
  })
  it('falls to lite without WebGL, with reduced motion, or with Save-Data', () => {
    expect(chooseTier(facts({ webgl: false }))).toBe('lite')
    expect(chooseTier(facts({ reducedMotion: true }))).toBe('lite')
    expect(chooseTier(facts({ saveData: true }))).toBe('lite')
  })
  it('falls to lite on weak devices', () => {
    expect(chooseTier(facts({ cores: 2 }))).toBe('lite')
    expect(chooseTier(facts({ memoryGb: 2 }))).toBe('lite')
  })
  it('treats unknown cores and memory as capable', () => {
    expect(chooseTier(facts({ cores: null, memoryGb: null }))).toBe('full')
  })
  it('respects the visitor choice, but never forces 3D where it cannot run', () => {
    expect(chooseTier(facts({ preference: 'lite' }))).toBe('lite')
    expect(chooseTier(facts({ preference: 'full', cores: 2 }))).toBe('full')
    expect(chooseTier(facts({ preference: 'full', screenWidth: 390 }))).toBe('balanced')
    expect(chooseTier(facts({ preference: 'full', webgl: false }))).toBe('lite')
    expect(chooseTier(facts({ preference: 'full', reducedMotion: true }))).toBe('lite')
  })
  it('honours a tier forced by ?fx= unless WebGL or motion rules say lite', () => {
    expect(chooseTier(facts({ forced: 'lite' }))).toBe('lite')
    expect(chooseTier(facts({ forced: 'full', cores: 2 }))).toBe('full')
    expect(chooseTier(facts({ forced: 'full', webgl: false }))).toBe('lite')
  })
})

describe('stepDown and lowerOf', () => {
  it('steps full to balanced to lite and stops', () => {
    expect(stepDown('full')).toBe('balanced')
    expect(stepDown('balanced')).toBe('lite')
    expect(stepDown('lite')).toBe('lite')
  })
  it('lowerOf picks the weaker tier', () => {
    expect(lowerOf('full', 'balanced')).toBe('balanced')
    expect(lowerOf('lite', 'full')).toBe('lite')
  })
})
