import { useFrame, useThree } from '@react-three/fiber'
import { useState } from 'react'
import { CatmullRomCurve3, MathUtils, Vector3, type Camera, type PerspectiveCamera } from 'three'
import { world } from '../bus'

// Points the camera travels through: outside the gate, through the arch, down the hall, to the doorway.
const PATH: [number, number, number][] = [
  [0, 1.5, 17], [0, 1.7, 8], [0, 2.0, 0.5], [0, 1.9, -9], [0, 2.0, -20], [0, 1.9, -28], [0, 1.8, -31],
]

interface Work {
  pos: Vector3
  look: Vector3
  smooth: number
}

// Places the camera for one frame. Plain function so the render code stays free of mutation.
function place(camera: Camera, curve: CatmullRomCurve3, work: Work, mobile: boolean, dt: number) {
  const cam = camera as PerspectiveCamera
  // Extra smoothing on top of the scroll scrub keeps motion silky.
  work.smooth = MathUtils.damp(work.smooth, world.progress, 6, dt)
  const t = MathUtils.lerp(work.smooth, 1, world.push)
  curve.getPoint(t, work.pos)
  curve.getPoint(Math.min(t + 0.05, 1), work.look)
  if (t >= 0.999) work.look.set(0, 1.8, -46)
  work.look.y -= 0.2
  work.pos.z -= world.push * world.push * 8
  work.pos.x += world.pointerX * 0.25
  work.pos.y += world.pointerY * 0.12
  cam.position.copy(work.pos)
  cam.lookAt(work.look)
  const fov = (mobile ? 62 : 45) + world.push * 20
  if (cam.fov !== fov) {
    cam.fov = fov
    cam.updateProjectionMatrix()
  }
}

// GSAP writes `world.progress` and `world.push`. This reads them every frame (no React state).
// Mobile gets a higher, wider view so artefacts fit a portrait frame.
export function CameraRig() {
  const mobile = useThree((s) => s.size.width < 768)
  const [curve] = useState(() => new CatmullRomCurve3(PATH.map(([x, y, z]) => new Vector3(x, y + (mobile ? 0.5 : 0), z))))
  const [work] = useState<Work>(() => ({ pos: new Vector3(), look: new Vector3(), smooth: 0 }))
  useFrame(({ camera }, dt) => place(camera, curve, work, mobile, dt))
  return null
}
