import { useEffect, useState } from 'react'
import { PHASES, type PhaseName } from './timeline'

// Steps through the timeline with timers. Presentation only: it never touches the result (R6.7).
// With reduced motion the sequence is replaced by a short fade straight to the card (R6.5).
export function usePhase(reduced: boolean): PhaseName {
  const [phase, setPhase] = useState<PhaseName>('gather')
  useEffect(() => {
    if (reduced) return
    const timers = PHASES.slice(1).map((p) => setTimeout(() => setPhase(p.name), p.at * 1000))
    return () => timers.forEach(clearTimeout)
  }, [reduced])
  return reduced ? 'card' : phase
}
