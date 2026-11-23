import type { AestheticId } from '../../types/quiz'
import { cn } from '../../utils/cn'

// One gold sigil per identity. Lines are drawn with a stroke-dash transition, so it "draws itself".
const SIDES: Record<AestheticId, number> = { velvet: 3, arcane: 5, crimson: 4, neon: 6 }

function polygon(n: number, r: number, rotate = -90): string {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((rotate + (360 / n) * i) * Math.PI) / 180
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
  })
  return `M${pts.join('L')}Z`
}

export function Sigil({ aesthetic, drawn, className }: { aesthetic: AestheticId; drawn: boolean; className?: string }) {
  const n = SIDES[aesthetic]
  const star = n >= 5 ? Array.from({ length: n }, (_, i) => (i * 2) % n) : null
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((-90 + (360 / n) * i) * Math.PI) / 180
    return [50 + 30 * Math.cos(a), 50 + 30 * Math.sin(a)]
  })
  const starPath = star ? `M${star.map((i) => pts[i].map((v) => v.toFixed(2)).join(',')).join('L')}Z` : null
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      data-testid="sigil"
      className={cn(drawn && 'sigil-drawn', className)}
      fill="none"
      strokeWidth="0.7"
      strokeLinecap="round"
      style={{ stroke: 'var(--color-gold)' }}
    >
      <circle className="sigil-path" pathLength="1" cx="50" cy="50" r="44" />
      <circle className="sigil-path" pathLength="1" cx="50" cy="50" r="36" style={{ transitionDelay: '0.3s' }} />
      <path className="sigil-path" pathLength="1" d={polygon(n, 30)} style={{ transitionDelay: '0.6s' }} />
      {starPath && <path className="sigil-path" pathLength="1" d={starPath} style={{ transitionDelay: '0.9s' }} />}
      <circle className="sigil-path" pathLength="1" cx="50" cy="50" r="4" style={{ transitionDelay: '1.2s', stroke: 'var(--color-ember)' }} />
    </svg>
  )
}
