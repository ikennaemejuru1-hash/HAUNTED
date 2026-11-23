import { useMemo } from 'react'
import { CanvasTexture, ExtrudeGeometry, LatheGeometry, Path, RepeatWrapping, Shape, SRGBColorSpace, Vector2 } from 'three'
import { palette } from '../palette'
import { useDisposable } from './hooks'

// Aged stone, made from noise drawn on a small canvas until the owner's stone texture arrives.
function useStoneTexture() {
  return useDisposable(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      let s = 99
      const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const v = 24 + Math.floor(rand() * 22) // warm charcoal range, red slightly above blue
          ctx.fillStyle = `rgb(${v + 4},${v + 2},${v})`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
    const t = new CanvasTexture(canvas)
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(6, 4)
    t.colorSpace = SRGBColorSpace
    return t
  })
}

// Half width w, straight wall height h, extra height `rise` to the point of the arch.
function archPath(w: number, h: number, rise: number) {
  const s = new Shape()
  s.moveTo(-w, 0)
  s.lineTo(-w, h)
  s.quadraticCurveTo(-w, h + rise * 0.8, 0, h + rise)
  s.quadraticCurveTo(w, h + rise * 0.8, w, h)
  s.lineTo(w, 0)
  s.lineTo(-w, 0)
  return s
}

interface WallProps {
  position: [number, number, number]
  width?: number
  height?: number
  archWidth: number
  archHeight: number
  archRise: number
}

// A thick wall with a pointed archway cut through it.
export function ArchWall({ position, width = 18, height = 10, archWidth, archHeight, archRise }: WallProps) {
  const stone = useStoneTexture()
  const geometry = useDisposable(() => {
    const outer = new Shape()
    outer.moveTo(-width / 2, 0)
    outer.lineTo(width / 2, 0)
    outer.lineTo(width / 2, height)
    outer.lineTo(-width / 2, height)
    outer.lineTo(-width / 2, 0)
    outer.holes.push(new Path(archPath(archWidth, archHeight, archRise).getPoints(16)))
    return new ExtrudeGeometry(outer, { depth: 1.4, bevelEnabled: false })
  })
  return (
    <mesh geometry={geometry} position={position}>
      <meshStandardMaterial map={stone} color={palette.silver} roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

export function Pillar({ position, height = 5 }: { position: [number, number, number]; height?: number }) {
  const geometry = useDisposable(() => {
    const pts = [[0.5, 0], [0.5, 0.25], [0.32, 0.35], [0.28, height - 0.5], [0.4, height - 0.3], [0.45, height]].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(pts, 14)
  })
  const stone = useStoneTexture()
  return (
    <mesh geometry={geometry} position={position}>
      <meshStandardMaterial map={stone} color={palette.silver} roughness={0.9} />
    </mesh>
  )
}

// A pair of pillars joined by a pointed stone rib, repeated down the hall.
export function HallBay({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <Pillar position={[-4.5, 0, 0]} />
      <Pillar position={[4.5, 0, 0]} />
      <mesh position={[0, 5, 0]}>
        <torusGeometry args={[4.5, 0.14, 6, 28, Math.PI]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function Floor() {
  const stone = useStoneTexture()
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
      <planeGeometry args={[40, 90]} />
      <meshStandardMaterial map={stone} color={palette.ash} roughness={0.8} metalness={0.15} />
    </mesh>
  )
}

// Gate pillars, finials and two spires frame the entrance wall.
export function GateDressing() {
  const spire = useMemo(() => [-6.2, 6.2], [])
  return (
    <>
      {[-2.6, 2.6].map((x) => (
        <group key={x} position={[x, 0, 0.7]}>
          <Pillar position={[0, 0, 0]} height={4.6} />
          <mesh position={[0, 5.1, 0]}>
            <coneGeometry args={[0.35, 0.9, 8]} />
            <meshStandardMaterial color={palette.gold} metalness={0.85} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {spire.map((x) => (
        <mesh key={x} position={[x, 12, 0.7]}>
          <coneGeometry args={[1.1, 4.5, 6]} />
          <meshStandardMaterial color={palette.charcoal} roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}
