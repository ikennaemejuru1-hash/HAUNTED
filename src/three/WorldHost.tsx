import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'
import { ErrorBoundary } from './ErrorBoundary'
import { useFx } from './fxContext'

// The 3D code is a separate file. It is fetched only after the page has painted, and only
// on devices that are allowed to run it, so the first load stays small (N9).
const WorldCanvas = lazy(() => import('./world/WorldCanvas'))

function whenIdle(run: () => void): () => void {
  // Safari has no requestIdleCallback, so a short timer stands in for it.
  const w: Window = window
  if (typeof w.requestIdleCallback === 'function') {
    const id = w.requestIdleCallback(run, { timeout: 1500 })
    return () => w.cancelIdleCallback(id)
  }
  const id = setTimeout(run, 400)
  return () => clearTimeout(id)
}

export function WorldHost() {
  const { tier, downgrade, fallToLite } = useFx()
  const { pathname } = useLocation()
  const [wanted, setWanted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (tier === 'lite') return
    return whenIdle(() => setWanted(true))
  }, [tier])

  if (tier === 'lite' || !wanted) return null
  const visible = ready && pathname === '/'

  return (
    <ErrorBoundary onError={fallToLite}>
      <Suspense fallback={null}>
        <div
          aria-hidden="true"
          data-testid="world"
          className={cn('pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700', visible ? 'opacity-100' : 'opacity-0')}
        >
          <WorldCanvas
            tier={tier}
            scene={pathname === '/' ? 'threshold' : 'none'}
            onReady={() => setReady(true)}
            onSlow={downgrade}
            onLost={fallToLite}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
