import type { AestheticId } from '../../types/quiz'
import { IDENTITIES } from '../../data/identities'
import { cn } from '../../utils/cn'
import { atOrAfter, type PhaseName } from './timeline'

const ORDER: AestheticId[] = ['velvet', 'arcane', 'crimson', 'neon']

function Glyph({ id }: { id: AestheticId }) {
  const s = { fill: 'none', stroke: 'var(--color-gold)', strokeWidth: 1.4 }
  if (id === 'velvet') return <ellipse cx="0" cy="0" rx="7" ry="10" {...s} />
  if (id === 'arcane') return <path d="M-8 -6h16v12h-16zM0 -6v12" {...s} />
  if (id === 'crimson') return <path d="M-8 -8c0 12 4 16 8 16s8-4 8-16c-5 2-11 2-16 0z" {...s} />
  return <path d="M0 -10l7 8-7 12-7-12z" {...s} />
}

// The lite Awakening (R6.6): poster-style art, CSS fog and an SVG sigil, with the same timing as the 3D version.
export function AwakeningLite({ phase, primary, secondary, isHybrid }: { phase: PhaseName; primary: AestheticId; secondary: AestheticId; isHybrid: boolean }) {
  const risen = atOrAfter(phase, 'rise')
  const lit = atOrAfter(phase, 'orbit')
  const tinted = atOrAfter(phase, 'sigil')
  const glow = IDENTITIES[primary].palette[1].hex
  return (
    <div aria-hidden="true" data-testid="awakening-lite" className="absolute inset-0 overflow-hidden">
      <div className="hero-light absolute inset-0" />
      <div className="fog-layer fog-a" />
      <div className="fog-layer fog-b" />
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: tinted ? 0.55 : lit ? 0.3 : 0.1, background: `radial-gradient(circle at 50% 48%, ${glow}, transparent 55%)` }}
      />
      <svg viewBox="-60 -60 120 120" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        <ellipse cx="0" cy="26" rx="22" ry="5" style={{ fill: 'var(--color-charcoal)' }} />
        <rect x="-10" y="14" width="20" height="12" style={{ fill: 'var(--color-charcoal)', stroke: 'var(--color-gold)', strokeWidth: 0.4 }} />
        <g className={cn(lit && 'awaken-orbit')}>
          {ORDER.map((id, i) => {
            const keep = id === primary || (isHybrid && id === secondary)
            const a = (i * Math.PI) / 2
            const pos = risen && keep ? { x: id === primary ? (isHybrid ? -4 : 0) : 4, y: -16 } : { x: Math.cos(a) * 34, y: Math.sin(a) * 12 - 6 }
            return (
              <g
                key={id}
                transform={`translate(${pos.x} ${pos.y})`}
                style={{ opacity: risen && !keep ? 0 : 1, transition: 'opacity 1.5s ease, transform 2s ease' }}
              >
                <Glyph id={id} />
              </g>
            )
          })}
        </g>
        {[-24, -12, 12, 24].map((x) => (
          <g key={x} style={{ opacity: lit ? 1 : 0, transition: 'opacity 1s' }}>
            <rect x={x - 1} y="20" width="2" height="6" style={{ fill: 'var(--color-silver)' }} />
            <ellipse cx={x} cy="18" rx="1.2" ry="2.2" style={{ fill: 'var(--color-ember)' }} />
          </g>
        ))}
      </svg>
      <div className="hero-vignette absolute inset-0" />
    </div>
  )
}
