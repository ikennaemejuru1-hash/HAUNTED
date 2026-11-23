import { IDENTITIES } from '../../data/identities'
import type { Costume } from '../../types/engine'
import type { Currency } from '../../types/quiz'
import { costRange } from './costRange'
import { SaveButton } from '../grimoire/SaveButton'
import { Badge, Button, GlassPanel } from '../ui'
import { CostumeImage } from './CostumeImage'

interface Props {
  costume: Costume
  currency: Currency
  onDetails: (c: Costume, trigger: HTMLElement) => void
}

// One Atelier card (R8.1).
export function CostumeCard({ costume: c, currency, onDetails }: Props) {
  return (
    <GlassPanel className="flex h-full flex-col gap-3 bg-obsidian/75 p-4" data-testid="costume-card">
      <CostumeImage costume={c} />
      <h3 className="text-xl">{c.name}</h3>
      <Badge tone="gold" className="self-start">{IDENTITIES[c.aesthetic].name}</Badge>
      <p className="text-sm">{c.description}</p>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div><dt className="label-tech text-xs uppercase">Cost</dt><dd>{costRange(c, currency)}</dd></div>
        <div><dt className="label-tech text-xs uppercase">Difficulty</dt><dd className="capitalize">{c.difficulty}</dd></div>
        <div><dt className="label-tech text-xs uppercase">Prep</dt><dd>{c.prepMinutes} min</dd></div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <Button variant="ghost" aria-label={`View details: ${c.name}`} onClick={(e) => onDetails(c, e.currentTarget)}>View Details</Button>
        <SaveButton id={c.id} name={c.name} />
      </div>
    </GlassPanel>
  )
}
