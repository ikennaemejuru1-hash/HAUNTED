import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { AESTHETIC_ORDER, IDENTITIES } from '../../data/identities'
import { hasFilters, type AtelierFilters } from '../../engine/filters'
import { budgetLabel } from '../../data/currency'
import type { Currency } from '../../types/quiz'
import { Button, GlassPanel } from '../ui'

interface Props {
  filters: AtelierFilters
  currency: Currency
  count: number
  onChange: (next: AtelierFilters) => void
}

const select = 'mt-1 min-h-11 w-full rounded-sm border border-ash/60 bg-obsidian px-3 text-silver'

// Filters (R8.2). On small screens the panel folds away behind a button, like a drawer.
export function FilterPanel({ filters, currency, count, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const set = <K extends keyof AtelierFilters>(key: K) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value || undefined })
  const field = (label: string, key: keyof AtelierFilters, options: [string, string][]) => (
    <label className="block text-sm">
      <span className="label-tech text-xs uppercase tracking-[0.14em]">{label}</span>
      <select className={select} value={filters[key] ?? ''} onChange={set(key)}>
        <option value="">Any</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
  return (
    <GlassPanel className="bg-obsidian/75 p-4">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <Button variant="secondary" aria-expanded={open} aria-controls="atelier-filters" onClick={() => setOpen((o) => !o)}>
          <SlidersHorizontal size={16} aria-hidden="true" /> Filters
        </Button>
        <p className="text-sm text-ash">{count} shown</p>
      </div>
      <form id="atelier-filters" aria-label="Filter costumes" onSubmit={(e) => e.preventDefault()} className={`${open ? 'mt-4 grid' : 'hidden'} gap-3 sm:grid-cols-2 md:mt-0 md:grid md:grid-cols-3 lg:grid-cols-6`}>
        {field('Aesthetic', 'aesthetic', AESTHETIC_ORDER.map((id) => [id, IDENTITIES[id].name]))}
        {field('Budget', 'budget', (['lt20', '20to50', '50to100', 'gt100'] as const).map((t) => [t, budgetLabel(t, currency)]))}
        {field('Difficulty', 'difficulty', [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']])}
        {field('Prep time', 'time', [['lt30m', 'Under 30 minutes'], ['30m2h', 'Up to 2 hours'], ['2to5h', 'Up to 5 hours'], ['gt5h', 'Any length']])}
        {field('Who', 'play', [['solo', 'Solo'], ['couple', 'Couple'], ['group', 'Group']])}
        <div className="flex items-end">
          <Button variant="ghost" onClick={() => onChange({})} disabled={!hasFilters(filters)}>Clear filters</Button>
        </div>
      </form>
      <p className="mt-3 hidden text-sm text-ash md:block" role="status">{count} {count === 1 ? 'costume' : 'costumes'} shown</p>
    </GlassPanel>
  )
}
