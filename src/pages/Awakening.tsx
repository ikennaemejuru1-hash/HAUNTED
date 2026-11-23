import { useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AwakeningLite } from '../components/awakening/AwakeningLite'
import { Sigil } from '../components/awakening/Sigil'
import { atOrAfter } from '../components/awakening/timeline'
import { usePhase } from '../components/awakening/usePhase'
import { IdentityCard } from '../components/results/IdentityCard'
import { NoResult } from '../components/results/NoResult'
import { Button } from '../components/ui'
import { useSound } from '../hooks/useSound'
import { IDENTITIES } from '../data/identities'
import { QuizProvider } from '../state/QuizContext'
import { useResult } from '../state/useResult'
import { ErrorBoundary } from '../three/ErrorBoundary'
import { useFx } from '../three/fxContext'
import type { RecommendationResult } from '../types/engine'

// The 3D scene is a separate chunk, fetched only when this page runs on a tier that allows WebGL.
const AwakeningScene = lazy(() => import('../three/world/AwakeningScene'))

function Reveal({ result }: { result: RecommendationResult }) {
  const { identity } = result
  const navigate = useNavigate()
  const { tier, fallToLite } = useFx()
  const reducedMotion = useReducedMotion() ?? false
  const phase = usePhase(reducedMotion)
  const [sceneReady, setSceneReady] = useState(false)
  // Clock start for the 3D scene, taken once when the reveal mounts.
  const [start] = useState(() => ({ current: performance.now() }))
  const playing = !atOrAfter(phase, 'card')
  const sound = useSound(playing)
  const toResults = () => navigate('/results', { replace: true })
  const use3d = tier !== 'lite' && !reducedMotion
  const glow = IDENTITIES[identity.primary].palette[1].hex
  const revealed = atOrAfter(phase, 'reveal')
  const text = revealed ? 'YOUR HALLOWEEN ALTER EGO HAS AWAKENED.' : 'YOUR IDENTITY IS TAKING SHAPE...'

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden" data-tier={use3d ? tier : 'lite'} data-phase={phase}>
      <div className="absolute inset-0 bg-obsidian" aria-hidden="true">
        <AwakeningLite phase={phase} primary={identity.primary} secondary={identity.secondary} isHybrid={identity.isHybrid} />
        {use3d && (
          <ErrorBoundary onError={fallToLite}>
            <Suspense fallback={null}>
              <div className={sceneReady ? 'absolute inset-0 opacity-100 transition-opacity duration-700' : 'absolute inset-0 opacity-0'} data-testid="awakening-3d">
                <AwakeningScene
                  tier={tier}
                  start={start}
                  primary={identity.primary}
                  secondary={identity.secondary}
                  isHybrid={identity.isHybrid}
                  glow={glow}
                  onReady={() => setSceneReady(true)}
                  onLost={fallToLite}
                />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] flex-col items-center justify-between px-4 py-6">
        <div className="flex w-full max-w-3xl justify-end gap-2">
          <Button variant="ghost" onClick={sound.toggle} aria-pressed={sound.on}>
            {sound.on ? 'Sound on' : 'Sound off'}
          </Button>
          {playing && <Button variant="secondary" onClick={toResults}>Skip</Button>}
        </div>

        <div className="relative flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
          {atOrAfter(phase, 'sigil') && !atOrAfter(phase, 'card') && (
            <SigilDrawing aesthetic={identity.primary} />
          )}
          {!atOrAfter(phase, 'card') && (
            <p role="status" aria-live="polite" className="font-display text-2xl tracking-[0.12em] text-silver [text-shadow:0_2px_12px_var(--color-obsidian)] sm:text-3xl">
              <span className="rounded-sm bg-obsidian/60 px-3 py-1">{text}</span>
            </p>
          )}
          {atOrAfter(phase, 'card') && (
            <div className="card-rise w-full">
              <p role="status" className="mb-4 font-display text-xl tracking-[0.12em] text-gold">YOUR HALLOWEEN ALTER EGO HAS AWAKENED.</p>
              <IdentityCard identity={identity} headingLevel={2} />
              <div className="mt-6 flex justify-center">
                <Button onClick={toResults}>See my full results</Button>
              </div>
            </div>
          )}
        </div>
        <div />
      </div>
    </div>
  )
}

// The sigil draws itself: it mounts undrawn, then draws on the next frame so the transition runs.
function SigilDrawing({ aesthetic }: { aesthetic: Parameters<typeof Sigil>[0]['aesthetic'] }) {
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return <Sigil aesthetic={aesthetic} drawn={drawn} className="h-40 w-40 sm:h-52 sm:w-52" />
}

function AwakeningInner() {
  const { result } = useResult()
  if (!result) return <NoResult />
  return <Reveal result={result} />
}

// The Awakening reveal (R6). The identity is computed first, so the reveal is presentation only.
export default function Awakening() {
  return (
    <QuizProvider>
      <h1 className="sr-only">Your awakening</h1>
      <AwakeningInner />
    </QuizProvider>
  )
}
