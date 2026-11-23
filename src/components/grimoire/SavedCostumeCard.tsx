import { Trash2 } from 'lucide-react'
import { IDENTITIES } from '../../data/identities'
import type { Costume } from '../../types/engine'
import type { Currency } from '../../types/quiz'
import { CostumeImage } from '../atelier/CostumeImage'
import { costRange } from '../atelier/costRange'
import { Badge, Button, GlassPanel } from '../ui'

// One saved costume in the Grimoire, with a remove control (R10.3).
export function SavedCostumeCard({ costume: c, currency, onRemove }: { costume: Costume; currency: Currency; onRemove: () => void }) {
  return (
    <GlassPanel className="flex h-full flex-col gap-3 bg-obsidian/75 p-4" data-testid="saved-card">
      <CostumeImage costume={c} />
      <h3 className="text-xl">{c.name}</h3>
      <Badge tone="gold" className="self-start">{IDENTITIES[c.aesthetic].name}</Badge>
      <p className="text-sm">{c.description}</p>
      <p className="text-sm text-ash">{costRange(c, currency)} · {c.prepMinutes} min · <span className="capitalize">{c.difficulty}</span></p>
      <div className="mt-auto pt-2">
        <Button variant="ghost" onClick={onRemove} aria-label={`Remove: ${c.name}`}><Trash2 size={16} aria-hidden="true" /> Remove</Button>
      </div>
    </GlassPanel>
  )
}
