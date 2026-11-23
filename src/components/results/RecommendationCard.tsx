import { formatAmount } from '../../data/currency'
import { IDENTITIES } from '../../data/identities'
import type { Recommendation } from '../../types/engine'
import type { Currency } from '../../types/quiz'
import { SaveButton } from '../grimoire/SaveButton'
import { Badge, GlassPanel } from '../ui'

const KIND: Record<Recommendation['kind'], string | null> = { match: null, closest: 'Closest match', stretch: 'Stretch option' }

interface Props {
  rec: Recommendation
  rank: number
  currency: Currency
}

// One costume recommendation with the reasons that led to it (R4.11, R7.1).
export function RecommendationCard({ rec, rank, currency }: Props) {
  const c = rec.costume
  const kind = KIND[rec.kind]
  const cost = `${formatAmount(c.costUsd.min, currency)} to ${formatAmount(c.costUsd.max, currency)}`
  return (
    <GlassPanel className="flex h-full flex-col gap-3 bg-obsidian/75 p-5" data-testid="recommendation-card">
      <p className="label-tech text-xs uppercase tracking-[0.14em]">Pick {rank}</p>
      <h3 className="text-xl">{c.name}</h3>
      <div className="flex flex-wrap gap-2">
        <Badge tone="gold">{IDENTITIES[c.aesthetic].name}</Badge>
        {kind && <Badge tone="ember">{kind}</Badge>}
      </div>
      <p>{c.description}</p>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div><dt className="label-tech text-xs uppercase">Cost</dt><dd>{cost}</dd></div>
        <div><dt className="label-tech text-xs uppercase">Difficulty</dt><dd className="capitalize">{c.difficulty}</dd></div>
        <div><dt className="label-tech text-xs uppercase">Prep</dt><dd>{c.prepMinutes} min</dd></div>
      </dl>
      <div>
        <h4 className="label-tech text-xs uppercase tracking-[0.14em]">Why it fits you</h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {rec.reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>
      {rec.missing.length > 0 && (
        <p className="text-sm text-ash">
          Still needed: {rec.missing.join(', ')}. Extra cost about {formatAmount(rec.extraCostUsd.min, currency)} to {formatAmount(rec.extraCostUsd.max, currency)}.
        </p>
      )}
      <div className="mt-auto pt-2">
        <SaveButton id={c.id} name={c.name} />
      </div>
    </GlassPanel>
  )
}
