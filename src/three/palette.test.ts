import { hexToRgb, isCool, palette } from './palette'

describe('3D palette (R15.12)', () => {
  it('has exactly the seven approved tokens', () => {
    expect(Object.values(palette)).toEqual(['#0A0908', '#1E1B1C', '#641B35', '#C5A15B', '#E87524', '#8A8786', '#CFCBC6'])
  })

  it('contains no blue, purple, teal or cyan', () => {
    for (const hex of Object.values(palette)) expect(isCool(hex), hex).toBe(false)
  })

  it('the cool check does catch blue and purple', () => {
    for (const hex of ['#0000FF', '#4B6CC1', '#7A3FB5', '#00CED1', '#1E1B3C']) expect(isCool(hex), hex).toBe(true)
  })

  it('parses hex into rgb', () => {
    expect(hexToRgb('#C5A15B')).toEqual([197, 161, 91])
  })
})
