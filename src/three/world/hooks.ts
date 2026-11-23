import { useEffect, useState } from 'react'
import type { BufferGeometry, Material, Texture } from 'three'

// Builds a Three.js object once per mounted component and frees its GPU memory afterwards
// (steering rule: dispose geometries, materials and textures). Inputs are fixed for a mount.
export function useDisposable<T extends BufferGeometry | Material | Texture>(make: () => T): T {
  const [item] = useState(make)
  useEffect(() => () => item.dispose(), [item])
  return item
}
