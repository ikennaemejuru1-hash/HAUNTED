import { useCallback, useEffect, useRef, useState } from 'react'
import { readItem, writeItem } from '../utils/storage'

export const SOUND_KEY = 'haunted:v1:sound'

// Sound is off until the visitor turns it on, and the choice is remembered (R6.4).
// The tone is made with the Web Audio API, so there are no audio files (R13.5).
export function useSound(active: boolean) {
  const [on, setOn] = useState(() => readItem(SOUND_KEY) === 'on')
  const ctx = useRef<AudioContext | null>(null)

  const toggle = useCallback(() => {
    setOn((v) => {
      writeItem(SOUND_KEY, v ? 'off' : 'on')
      return !v
    })
  }, [])

  useEffect(() => {
    if (!on || !active || typeof AudioContext === 'undefined') return
    const ac = new AudioContext()
    ctx.current = ac
    const gain = ac.createGain()
    gain.gain.setValueAtTime(0, ac.currentTime)
    gain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 2) // soft fade in, never a sudden sound
    gain.connect(ac.destination)
    for (const f of [55, 82.5]) {
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      osc.connect(gain)
      osc.start()
    }
    return () => {
      gain.gain.cancelScheduledValues(ac.currentTime)
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3)
      setTimeout(() => void ac.close().catch(() => {}), 400)
    }
  }, [on, active])

  return { on, toggle }
}
