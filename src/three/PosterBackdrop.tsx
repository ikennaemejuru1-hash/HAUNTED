import { useLocation } from 'react-router-dom'
import { assets } from '../data/assets'

// The picture behind everything. It is the lite tier, the WebGL fallback, and the frame shown
// while the 3D loads. Until the owner's generated poster exists it is drawn in code from palette tokens.
// It is decorative and aria-hidden. Text never sits directly on it without a panel or scrim.

function Fog() {
  return (
    <>
      <div className="fog-layer fog-a" />
      <div className="fog-layer fog-b" />
      <div className="fog-layer fog-c" />
    </>
  )
}

const stop = (token: string, opacity = 1) => ({ stopColor: `var(--color-${token})`, stopOpacity: opacity })

function ThresholdArt() {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" style={stop('gold', 0.55)} />
          <stop offset="1" style={stop('gold', 0)} />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={stop('charcoal', 0)} />
          <stop offset="1" style={stop('obsidian')} />
        </linearGradient>
      </defs>
      <circle cx="80" cy="30" r="34" fill="url(#moon-glow)" />
      <circle cx="80" cy="30" r="5" style={{ fill: 'var(--color-gold)', opacity: 0.6 }} />
      {/* Gatehouse wall with a pointed arch cut out of it (even-odd fill). */}
      <path
        fillRule="evenodd"
        style={{ fill: 'var(--color-charcoal)' }}
        d="M0 100V52h40V34l4-8 4 8v18h24V50h0v50zM160 100V52h-40V34l-4-8-4 8v18H88z"
      />
      <path
        fillRule="evenodd"
        style={{ fill: 'var(--color-obsidian)' }}
        d="M0 100V60h58c0-10 10-24 22-30 12 6 22 20 22 30h58v40z M70 100V64c0-8 5-15 10-19 5 4 10 11 10 19v36z"
      />
      <path d="M70 100V64c0-8 5-15 10-19 5 4 10 11 10 19v36" fill="none" strokeWidth="0.4" style={{ stroke: 'var(--color-gold)', opacity: 0.55 }} />
      <rect x="0" y="60" width="160" height="40" fill="url(#ground)" />
    </svg>
  )
}

function DoorwayArt() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="door-glow" cx="50%" cy="60%" r="55%">
          <stop offset="0" style={stop('ember', 0.85)} />
          <stop offset="0.45" style={stop('burgundy', 0.55)} />
          <stop offset="1" style={stop('obsidian', 0)} />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#door-glow)" />
      <path d="M36 100V52c0-12 8-22 14-28 6 6 14 16 14 28v48z" style={{ fill: 'var(--color-obsidian)', opacity: 0.55 }} />
      <path d="M36 100V52c0-12 8-22 14-28 6 6 14 16 14 28v48" fill="none" strokeWidth="0.35" style={{ stroke: 'var(--color-gold)', opacity: 0.7 }} />
    </svg>
  )
}

export function PosterBackdrop() {
  const { pathname } = useLocation()
  const variant = pathname === '/' ? 'threshold' : pathname === '/discover' ? 'doorway' : 'plain'
  const poster = assets.posterDesktop

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      {variant === 'threshold' && (poster ? <img src={poster} alt="" className="h-full w-full object-cover" /> : <ThresholdArt />)}
      {variant === 'doorway' && <DoorwayArt />}
      {variant === 'plain' && <div className="hero-light absolute inset-0" />}
      <Fog />
      <div className="hero-vignette absolute inset-0" />
    </div>
  )
}
