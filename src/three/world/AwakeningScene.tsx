import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, type MutableRefObject, type ReactNode } from 'react'
import { Color, MathUtils, type Group, type PointLight } from 'three'
import { world } from '../bus'
import { palette } from '../palette'
import { tierSettings, type Tier } from '../quality'
import type { AestheticId } from '../../types/quiz'
import { Grimoire, Lantern, Mask, Mirror } from './Artefacts'
import { Candle, ParticleField } from './Atmosphere'

// The 3D Awakening (design 11.5). Presentation only: it is given the identity and never changes it.
// It reuses the Threshold artefacts and particles, so it adds very little code of its own.
const ORDER: AestheticId[] = ['velvet', 'arcane', 'crimson', 'neon']
const ART: Record<AestheticId, (p: { focus: MutableRefObject<number> }) => ReactNode> = {
  velvet: Mirror, arcane: Grimoire, crimson: Mask, neon: Lantern,
}
const ease = (a: number, b: number, t: number) => MathUtils.smoothstep(t, a, b)

interface SceneProps {
  start: MutableRefObject<number>
  primary: AestheticId
  secondary: AestheticId
  isHybrid: boolean
  glow: string
}

function Artefact({ id, index, scene }: { id: AestheticId; index: number; scene: SceneProps }) {
  const group = useRef<Group>(null)
  const focus = useRef(0.2)
  const angle = useRef((index * Math.PI) / 2)
  const keep = id === scene.primary || (scene.isHybrid && id === scene.secondary)
  const Art = ART[id]
  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const t = (performance.now() - scene.start.current) / 1000
    const orbiting = t > 1.5
    angle.current += dt * (0.3 + 1.7 * ease(1.5, 4, t))
    const rise = ease(4, 6.5, t)
    const settle = keep ? rise : 0
    // Orbit position, blended toward the centre top (hybrid: the two artefacts sit side by side and merge).
    const offset = keep && scene.isHybrid ? (id === scene.primary ? -0.45 : 0.45) : 0
    g.position.set(
      MathUtils.lerp(Math.cos(angle.current) * 2.7, offset, settle),
      0.9 + Math.sin(t * 1.2 + index) * 0.08 + settle * 1.5,
      MathUtils.lerp(Math.sin(angle.current) * 2.7, 0, settle),
    )
    g.rotation.y = MathUtils.damp(g.rotation.y, keep && settle > 0.5 ? 0 : -angle.current + Math.PI / 2, 4, dt)
    const dissolve = keep ? 1 : 1 - ease(4, 5.5, t)
    const visible = t > 0.6
    g.visible = visible && dissolve > 0.01
    g.scale.setScalar((orbiting ? 0.9 : 0.5 + 0.4 * ease(0.6, 1.5, t)) * dissolve * (1 + settle * 0.5))
    focus.current = MathUtils.damp(focus.current, keep && rise > 0.5 ? 1 : 0.2, 3, dt)
  })
  return (
    <group ref={group} visible={false}>
      <Art focus={focus} />
    </group>
  )
}

function Rig({ scene, tier }: { scene: SceneProps; tier: Exclude<Tier, 'lite'> }) {
  const camera = useThree((s) => s.camera)
  const key = useRef<PointLight>(null)
  const colors = useRef({ from: new Color(palette.ember), to: new Color(scene.glow) })
  useFrame(() => {
    const t = (performance.now() - scene.start.current) / 1000
    // Candles light as the artefacts begin to orbit.
    world.progress = t > 1.5 ? 1 : 0
    const settle = ease(8, 10, t)
    camera.position.set(0, 2.3 - settle * 0.3, 7.5 - settle * 1.5)
    camera.lookAt(0, 1.2, 0)
    if (key.current) {
      const shift = ease(6.5, 8, t)
      key.current.color.copy(colors.current.from).lerp(colors.current.to, shift)
      key.current.intensity = 6 + ease(0, 1.5, t) * 10 + shift * 14
    }
  })
  const s = tierSettings[tier]
  return (
    <>
      <ambientLight intensity={0.25} color={palette.silver} />
      <pointLight ref={key} position={[0, 3.5, 2]} distance={14} decay={2} color={palette.ember} />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.1, 1.4, 0.6, 24]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 32]} />
        <meshStandardMaterial color={palette.obsidian} roughness={1} />
      </mesh>
      {ORDER.map((id, i) => (
        <Artefact key={id} id={id} index={i} scene={scene} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Candle key={i} position={[Math.cos((i * Math.PI) / 3) * 4, 0, Math.sin((i * Math.PI) / 3) * 4]} litAt={0.5} seed={i * 2.1} withLight={s.lights > 3 || i % 2 === 0} intensity={7} />
      ))}
      <ParticleField count={Math.round(s.embers / 2)} colorA={palette.ember} colorB={palette.gold} speed={[0.2, 0.6]} size={5} alpha={0.9} height={7} />
    </>
  )
}

interface Props extends SceneProps {
  tier: Exclude<Tier, 'lite'>
  onReady: () => void
  onLost: () => void
}

export default function AwakeningScene({ tier, onReady, onLost, ...scene }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={tierSettings[tier].dpr}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 2.3, 7.5] }}
      gl={{ antialias: tier !== 'full', powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onLost()
        })
      }}
    >
      <FrameCounter onReady={onReady} />
      <Rig scene={scene} tier={tier} />
    </Canvas>
  )
}

function FrameCounter({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 3) onReady()
  })
  return null
}
