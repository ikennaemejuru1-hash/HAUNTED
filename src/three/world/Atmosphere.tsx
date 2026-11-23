import { Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, DoubleSide, type Group, type PointLight, type ShaderMaterial } from 'three'
import { palette } from '../palette'
import { tierSettings, type Tier } from '../quality'
import { world } from '../bus'
import { useDisposable } from './hooks'
import { fogFrag, flameFrag, particleFrag, particleVert, planeVert } from './shaders'

type Active = Exclude<Tier, 'lite'>
const c = (hex: string) => new Color(hex)

// Z positions along the camera path where fog sheets hang. The camera passes through them.
const FOG_Z = [10, -2, -11, -19, -26]

export function FogLayers({ tier }: { tier: Active }) {
  const count = tierSettings[tier].fogLayers
  const zs = count === 5 ? FOG_Z : [8, -8, -22].slice(0, count)
  return (
    <>
      {zs.map((z, i) => (
        <FogSheet key={z} z={z} seed={i * 7.3} speed={0.015 + i * 0.01} dir={i % 2 ? -1 : 1} />
      ))}
    </>
  )
}

function FogSheet({ z, seed, speed, dir }: { z: number; seed: number; speed: number; dir: number }) {
  const mat = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSpeed: { value: speed * dir }, uSeed: { value: seed }, uDensity: { value: 0.5 }, uColor: { value: c(palette.ash) } }),
    [speed, dir, seed],
  )
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })
  return (
    <mesh position={[0, 3, z]} rotation={[0, 0, 0]}>
      <planeGeometry args={[26, 9]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={planeVert} fragmentShader={fogFrag} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
  )
}

interface ParticleProps {
  count: number
  colorA: string
  colorB: string
  speed: [number, number]
  size: number
  alpha: number
  height: number
}

// Ember and dust use one GPU draw call each: a single Points object with a custom shader.
export function ParticleField({ count, colorA, colorB, speed, size, alpha, height }: ParticleProps) {
  const mat = useRef<ShaderMaterial>(null)
  const geometry = useDisposable(() => {
    // Deterministic pseudo-random so the field looks the same on every load.
    let s = 1234567
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(rand() - 0.5) * 14, rand() * height, 14 - rand() * 56], i * 3)
      spd[i] = speed[0] + rand() * (speed[1] - speed[0])
      phase[i] = rand() * 40
    }
    return makeGeometry(pos, spd, phase)
  })
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 }, uSize: { value: size }, uHeight: { value: height }, uPx: { value: Math.min(window.devicePixelRatio, 2) },
      uColorA: { value: c(colorA) }, uColorB: { value: c(colorB) }, uAlpha: { value: alpha },
    }),
    [size, height, colorA, colorB, alpha],
  )
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })
  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={particleVert} fragmentShader={particleFrag} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  )
}

function makeGeometry(pos: Float32Array, spd: Float32Array, phase: Float32Array) {
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(pos, 3))
  g.setAttribute('aSpeed', new BufferAttribute(spd, 1))
  g.setAttribute('aPhase', new BufferAttribute(phase, 1))
  return g
}

interface CandleProps {
  position: [number, number, number]
  // Scroll progress at which this candle lights (chapter 1 lights one per step).
  litAt?: number
  seed?: number
  withLight?: boolean
  intensity?: number
}

export function Candle({ position, litAt = 0, seed = 0, withLight = true, intensity = 14 }: CandleProps) {
  const light = useRef<PointLight>(null)
  const flame = useRef<ShaderMaterial>(null)
  const group = useRef<Group>(null)
  const uniforms = useMemo(() => ({ uTime: { value: seed }, uLit: { value: 0 }, uInner: { value: c(palette.silver) }, uOuter: { value: c(palette.ember) } }), [seed])
  const lit = useRef(litAt === 0 ? 1 : 0)
  useFrame(({ clock }, dt) => {
    const target = world.progress >= litAt ? 1 : 0
    lit.current += (target - lit.current) * Math.min(1, dt * 3)
    // Smooth overlapping sine waves, never a hard flicker (N3).
    const t = clock.elapsedTime + seed
    const flicker = 0.88 + 0.08 * Math.sin(t * 2.1) + 0.04 * Math.sin(t * 5.3 + 1)
    if (flame.current) {
      flame.current.uniforms.uTime.value = t
      flame.current.uniforms.uLit.value = lit.current
    }
    if (light.current) light.current.intensity = intensity * lit.current * flicker
    if (group.current) group.current.visible = lit.current > 0.01
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.4, 10]} />
        <meshStandardMaterial color={palette.silver} roughness={0.8} />
      </mesh>
      <group ref={group} position={[0, 0.55, 0]}>
        <Billboard>
          <mesh>
            <planeGeometry args={[0.22, 0.4]} />
            <shaderMaterial ref={flame} uniforms={uniforms} vertexShader={planeVert} fragmentShader={flameFrag} transparent depthWrite={false} blending={AdditiveBlending} />
          </mesh>
        </Billboard>
        {/* The light floats a little above the wick. Right at the wick it would be so bright on the
            candle top that half-float post buffers overflow and show false colours. */}
        {withLight && <pointLight ref={light} position={[0, 0.7, 0.45]} color={palette.ember} distance={12} decay={2} intensity={0} />}
      </group>
    </group>
  )
}
