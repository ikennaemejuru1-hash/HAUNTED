import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { doorway } from './bus'

// Click handler for the "Discover your dark side" links. When the 3D world is running,
// the camera pushes through the doorway first (under 1 second), then the page changes.
export function useDoorway(to: string) {
  const navigate = useNavigate()
  return (e: MouseEvent<HTMLAnchorElement>) => {
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
    if (!doorway.run || modified) return
    e.preventDefault()
    void doorway.run().then(() => navigate(to))
  }
}
