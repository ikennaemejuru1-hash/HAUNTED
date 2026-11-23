import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { UnsignedByteType } from 'three'

// Full tier only. Bloom is gentle and only catches very bright things (embers, flames, glow).
export function Effects() {
  return (
    // 8-bit buffers: very bright pixels clip to white instead of overflowing into false (blue) colours.
    <EffectComposer multisampling={4} frameBufferType={UnsignedByteType}>
      <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.25} />
      <Vignette offset={0.3} darkness={0.75} />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
    </EffectComposer>
  )
}
