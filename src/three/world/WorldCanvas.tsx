import { useGSAP } from '@gsap/react'
import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { doorway, world } from '../bus'
import { tierSettings, type Tier } from '../quality'
import { CameraRig } from './CameraRig'
import { SceneDirector, type SceneName } from './SceneDirector'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Props {
  tier: Exclude<Tier, 'lite'>
  scene: SceneName
  onReady: () => void
  onSlow: () => void
  onLost: () => void
}

// Tells the page the first frames are drawn, so the poster can fade out.
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 3) onReady()
  })
  return null
}

export default function WorldCanvas({ tier, scene, onReady, onSlow, onLost }: Props) {
  const [visible, setVisible] = useState(!document.hidden)
  const settings = tierSettings[tier]

  // Pause drawing when the tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Pointer drift (ignored on touch screens, which never fire pointermove while idle).
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      world.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      world.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // GSAP owns the camera timeline: scroll position becomes `world.progress`, scrubbed for smoothness.
  useGSAP(() => {
    if (scene !== 'threshold') return
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      endTrigger: '#doorway',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        world.progress = self.progress
      },
    })
    world.progress = trigger.progress
    return () => {
      trigger.kill()
    }
  }, [scene])

  // The doorway push (R15.7): a quick camera dash through the glowing door, under 1 second.
  useEffect(() => {
    doorway.run = () =>
      new Promise<void>((resolve) => {
        // A timer also resolves, so a slow device still changes page in under 1 second.
        const done = () => {
          clearTimeout(timer)
          resolve()
        }
        const timer = setTimeout(done, 900)
        gsap.to(world, { push: 1, duration: 0.8, ease: 'power2.in', onComplete: done })
      })
    return () => {
      doorway.run = null
    }
  }, [])

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={visible && scene !== 'none' ? 'always' : 'never'}
      dpr={settings.dpr}
      camera={{ fov: 45, near: 0.1, far: 120, position: [0, 1.5, 17] }}
      gl={{ antialias: tier !== 'full', powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        // If the browser takes the GPU away, fall back to the poster instead of a blank screen (R15.11).
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onLost()
        })
      }}
    >
      <PerformanceMonitor bounds={() => [24, 60]} onDecline={onSlow} />
      <ReadySignal onReady={onReady} />
      <CameraRig />
      <SceneDirector scene={scene} tier={tier} />
    </Canvas>
  )
}
