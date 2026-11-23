import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { world } from '../bus'
import type { Tier } from '../quality'
import { Effects } from './Effects'
import { ThresholdScene } from './ThresholdScene'

export type SceneName = 'threshold' | 'none'

// Picks what the single shared canvas shows. Phase 5 adds the Awakening scene here.
export function SceneDirector({ scene, tier }: { scene: SceneName; tier: Exclude<Tier, 'lite'> }) {
  const mobile = useThree((s) => s.size.width < 768)
  useEffect(() => {
    // Coming back to the landing page starts a fresh approach to the gate.
    if (scene === 'threshold') world.push = 0
  }, [scene])
  if (scene === 'none') return null
  return (
    <>
      <ThresholdScene tier={tier} mobile={mobile} />
      {tier === 'full' && <Effects />}
    </>
  )
}
