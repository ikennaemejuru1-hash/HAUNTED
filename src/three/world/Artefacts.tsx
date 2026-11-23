import { useFrame, useThree } from '@react-three/fiber'
import { useRef, type MutableRefObject, type ReactNode } from 'react'
import { Color, ExtrudeGeometry, LatheGeometry, MathUtils, MeshBasicMaterial, Path, Shape, Vector2, type Group, type Mesh, type PointLight } from 'three'
import { world } from '../bus'
import { palette } from '../palette'
import { useDisposable } from './hooks'

type Focus = MutableRefObject<number>

interface RigProps {
  index: number
  position: [number, number, number]
  light: string
  children: (focus: Focus) => ReactNode
}

// Shared behaviour for every artefact: float, idle spin, drift toward the pointer,
// and turn toward the camera with a stronger light when its identity is hovered or focused.
export function ArtefactRig({ index, position, light, children }: RigProps) {
  const group = useRef<Group>(null)
  const lamp = useRef<PointLight>(null)
  const focus = useRef(0)
  const camera = useThree((s) => s.camera)
  useFrame(({ clock }, dt) => {
    const g = group.current
    if (!g) return
    const on = world.active === index ? 1 : 0
    focus.current = MathUtils.damp(focus.current, on, 4, dt)
    const t = clock.elapsedTime + index * 1.7
    g.position.y = position[1] + Math.sin(t * 0.8) * 0.12
    const idle = Math.sin(t * 0.35) * 0.5
    const toCamera = Math.atan2(camera.position.x - position[0], camera.position.z - position[2])
    const target = MathUtils.lerp(idle + world.pointerX * 0.3, toCamera, focus.current)
    g.rotation.y = MathUtils.damp(g.rotation.y, target, 3, dt)
    g.rotation.x = MathUtils.damp(g.rotation.x, world.pointerY * -0.12, 3, dt)
    g.scale.setScalar(1 + focus.current * 0.12)
    if (lamp.current) lamp.current.intensity = 3 + focus.current * 14
  })
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.9, 16]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.9} />
      </mesh>
      <group ref={group} position={[0, position[1], 0]}>
        {children(focus)}
      </group>
      <pointLight ref={lamp} color={light} position={[0, position[1] + 0.6, 1.2]} distance={7} decay={2} intensity={3} />
    </group>
  )
}

const gold = { color: palette.gold, metalness: 0.9, roughness: 0.35 }

export function Mirror({ focus }: { focus: Focus }) {
  const frame = useDisposable(() => {
    const outer = new Shape().absellipse(0, 0, 0.62, 0.9, 0, Math.PI * 2, false, 0)
    outer.holes.push(new Path().absellipse(0, 0, 0.5, 0.78, 0, Math.PI * 2, true, 0))
    return new ExtrudeGeometry(outer, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 28 })
  })
  const glow = useRef<MeshBasicMaterial>(null)
  const frameMat = useRef<Mesh>(null)
  useFrame(() => {
    if (glow.current) glow.current.opacity = 0.05 + focus.current * 0.55
    const m = frameMat.current?.material
    if (m && 'emissiveIntensity' in m) m.emissiveIntensity = focus.current * 0.5
  })
  return (
    <group>
      <mesh ref={frameMat} geometry={frame} position={[0, 0, -0.05]}>
        <meshStandardMaterial {...gold} emissive={palette.gold} emissiveIntensity={0} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color={palette.obsidian} metalness={1} roughness={0.12} />
      </mesh>
      {/* Faint reflection of candle flames that appears when the glass "clears". */}
      <mesh position={[0, 0.1, 0.01]} scale={[0.9, 1.4, 1]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial ref={glow} color={palette.ember} transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function Grimoire({ focus }: { focus: Focus }) {
  const pages = useRef<Group[]>([])
  const runes = useRef<Group>(null)
  useFrame(({ clock }, dt) => {
    // Pages riffle open on focus, one after another.
    pages.current.forEach((p, i) => {
      if (p) p.rotation.y = MathUtils.damp(p.rotation.y, -focus.current * (0.5 + i * 0.28), 5, dt)
    })
    if (runes.current) {
      runes.current.rotation.y = clock.elapsedTime * (0.4 + focus.current * 1.4)
      runes.current.children.forEach((r) => {
        const mat = (r as Mesh).material
        if (!Array.isArray(mat) && 'opacity' in mat) mat.opacity = 0.45 + focus.current * 0.55
      })
    }
  })
  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1, 1.3, 0.1]} />
        <meshStandardMaterial color={palette.burgundy} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.1, 1.3, 0.3]} />
        <meshStandardMaterial color={palette.burgundy} roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-0.46, 0, -0.04 + i * 0.03]} ref={(el) => { if (el) pages.current[i] = el }}>
          <mesh position={[0.46, 0, 0]}>
            <boxGeometry args={[0.92, 1.2, 0.02]} />
            <meshStandardMaterial color={palette.silver} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[1, 1.3, 0.08]} />
        <meshStandardMaterial {...gold} roughness={0.5} />
      </mesh>
      <group ref={runes} position={[0, 0.1, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos((i / 6) * Math.PI * 2) * 1.1, Math.sin(i * 1.7) * 0.25, Math.sin((i / 6) * Math.PI * 2) * 1.1]}>
            <octahedronGeometry args={[0.07]} />
            <meshBasicMaterial color={palette.gold} transparent opacity={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Mask({ focus }: { focus: Focus }) {
  // One material shared by all cracks, so one colour change lights them together.
  const crack = useDisposable(() => new MeshBasicMaterial({ color: palette.burgundy }))
  const ember = useRef(new Color(palette.ember))
  const dim = useRef(new Color(palette.burgundy))
  useFrame(() => {
    // Cracks glow from dim burgundy to ember as the identity is focused.
    crack.color.copy(dim.current).lerp(ember.current, focus.current)
  })
  return (
    <group scale={[0.85, 1.05, 0.8]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={palette.silver} roughness={0.28} metalness={0.05} side={2} />
      </mesh>
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.62]} scale={[1, 0.6, 1]}>
          <circleGeometry args={[0.12, 20]} />
          <meshBasicMaterial color={palette.obsidian} />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 0.7]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshStandardMaterial color={palette.silver} roughness={0.3} />
      </mesh>
      {[[-0.1, 0.35, 0.66, 0.4], [0.3, -0.15, 0.62, -0.7], [-0.15, -0.3, 0.64, 1.2]].map(([x, y, z, r]) => (
        <mesh key={x} position={[x, y, z]} rotation={[0, 0, r]} material={crack}>
          <boxGeometry args={[0.025, 0.4, 0.01]} />
        </mesh>
      ))}
    </group>
  )
}

function setOpacity(m: MeshBasicMaterial, v: number) {
  m.opacity = v
}

export function Lantern({ focus }: { focus: Focus }) {
  const body = useDisposable(() => {
    const pts = [[0.25, 0], [0.38, 0.1], [0.4, 0.5], [0.3, 0.8], [0.18, 0.9]].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(pts, 8)
  })
  const core = useRef<Mesh>(null)
  const lines = useDisposable(() => new MeshBasicMaterial({ color: palette.ember, transparent: true, opacity: 0.2 }))
  useFrame(({ clock }) => {
    if (core.current) core.current.scale.setScalar(0.85 + focus.current * 0.15 + Math.sin(clock.elapsedTime * 1.5) * 0.03 * (1 - focus.current))
    setOpacity(lines, 0.2 + focus.current * 0.8)
  })
  return (
    <group position={[0, -0.45, 0]}>
      <mesh geometry={body}>
        {/* Open framework: wireframe stands in for the missing glass panes. */}
        <meshStandardMaterial {...gold} wireframe />
      </mesh>
      <mesh ref={core} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshBasicMaterial color={palette.ember} />
      </mesh>
      {[0.2, 0.45, 0.7].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={lines}>
          <torusGeometry args={[0.37 - Math.abs(y - 0.45) * 0.2, 0.008, 6, 24]} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.14, 0.015, 6, 16]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  )
}
