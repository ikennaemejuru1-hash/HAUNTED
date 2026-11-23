import { palette } from '../palette'
import { tierSettings, type Tier } from '../quality'
import { ArchWall, Floor, GateDressing, HallBay } from './Architecture'
import { Candle, FogLayers, ParticleField } from './Atmosphere'
import { ArtefactRig, Grimoire, Lantern, Mask, Mirror } from './Artefacts'

const ARTEFACTS = [Mirror, Grimoire, Mask, Lantern]

type Active = Exclude<Tier, 'lite'>

// Where the four artefacts stand in the hall: the identity index matches the Explore Styles list.
// Mobile screens are narrow, so x is passed in from the caller.
const SPOTS: [number, number][] = [[-1, -14], [1, -19.5], [-1, -25], [1, -30.5]]
const LIGHTS = [palette.gold, palette.gold, palette.ember, palette.ember]

export function ThresholdScene({ tier, mobile }: { tier: Active; mobile: boolean }) {
  const s = tierSettings[tier]
  const spread = mobile ? 1.15 : 2.3
  return (
    <>
      <color attach="background" args={[palette.obsidian]} />
      <fogExp2 attach="fog" args={[palette.obsidian, 0.028]} />
      <ambientLight color={palette.gold} intensity={0.55} />
      <directionalLight color={palette.gold} intensity={1.1} position={[0, 12, 14]} />
      <pointLight color={palette.burgundy} intensity={60} distance={30} decay={2} position={[0, 4, 12]} />

      {/* The moon: a warm gold disc and halo high behind the gate. */}
      <mesh position={[0, 15, -38]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial color={palette.gold} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 15, -38.2]}>
        <circleGeometry args={[11, 32]} />
        <meshBasicMaterial color={palette.gold} fog={false} transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <ArchWall position={[0, 0, 0]} archWidth={2.3} archHeight={3.4} archRise={2.4} />
      <GateDressing />
      <Floor />
      {[-6, -12, -18, -24, -30, -36].map((z) => (
        <HallBay key={z} z={z} />
      ))}

      {/* Chapter 1: one candle lights for each of the three steps. */}
      <Candle position={[-1.3, 0, -3]} litAt={0.2} seed={0.5} withLight={s.lights > 3} />
      <Candle position={[0, 0, -3.8]} litAt={0.28} seed={2.1} withLight={s.lights > 3} />
      <Candle position={[1.3, 0, -3]} litAt={0.36} seed={4.2} withLight={s.lights > 3} />

      {/* Braziers either side of the gate (chapter 0). */}
      <Candle position={[-4.5, 0, 6]} seed={1} intensity={20} />
      <Candle position={[4.5, 0, 6]} seed={3} intensity={20} />

      {SPOTS.map(([side, z], i) => (
        <ArtefactRig key={z} index={i} position={[side * spread, 1.9, z]} light={LIGHTS[i]}>
          {(focus) => {
            const Artefact = ARTEFACTS[i]
            return <Artefact focus={focus} />
          }}
        </ArtefactRig>
      ))}

      {/* Chapter 3: the doorway glows ember from within. */}
      <ArchWall position={[0, 0, -42]} archWidth={2.2} archHeight={3} archRise={2.2} />
      {/* Deep burgundy door light with a smaller ember core, so ember never becomes a large fill. */}
      <mesh position={[0, 3.5, -42.4]}>
        <planeGeometry args={[7, 8]} />
        <meshBasicMaterial color={palette.burgundy} fog={false} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 2.2, -42.3]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color={palette.ember} fog={false} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <pointLight color={palette.ember} intensity={50} distance={16} decay={2} position={[0, 3, -38]} />

      <FogLayers tier={tier} />
      <ParticleField count={s.embers} colorA={palette.ember} colorB={palette.gold} speed={[0.3, 1]} size={5} alpha={0.95} height={10} />
      <ParticleField count={s.motes} colorA={palette.silver} colorB={palette.silver} speed={[0.05, 0.2]} size={3} alpha={0.35} height={8} />
    </>
  )
}
