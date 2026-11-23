import { IDENTITIES } from '../../data/identities'
import type { Identity } from '../../types/engine'
import { Badge, GlassPanel } from '../ui'
import { cn } from '../../utils/cn'

// The identity card (R6.2, R7.1). It is a creative styling profile, not a personality test.
export function IdentityCard({ identity, className, headingLevel = 2 }: { identity: Identity; className?: string; headingLevel?: 1 | 2 }) {
  const p = IDENTITIES[identity.primary]
  const s = IDENTITIES[identity.secondary]
  const H = `h${headingLevel}` as 'h1' | 'h2'
  return (
    <GlassPanel className={cn('bg-obsidian/80 p-6 text-center sm:p-8', className)} data-testid="identity-card">
      <p className="label-tech text-xs uppercase tracking-[0.2em]">{identity.isHybrid ? 'Hybrid identity' : 'Your identity'}</p>
      <H className="mt-2 text-3xl sm:text-4xl">{identity.name}</H>
      <p className="mt-2 font-display text-lg text-gold">{p.tagline}</p>
      <p className="mx-auto mt-4 max-w-xl">{p.description}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="label-tech text-xs uppercase tracking-[0.14em]">Primary aesthetic</dt>
          <dd className="mt-1"><Badge tone="gold">{p.name}</Badge></dd>
        </div>
        <div>
          <dt className="label-tech text-xs uppercase tracking-[0.14em]">Secondary aesthetic</dt>
          <dd className="mt-1"><Badge>{s.name}</Badge></dd>
        </div>
      </dl>
    </GlassPanel>
  )
}
