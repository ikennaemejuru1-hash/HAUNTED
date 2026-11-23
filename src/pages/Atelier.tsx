import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlchemistPanel } from '../components/atelier/AlchemistPanel'
import { CostumeCard } from '../components/atelier/CostumeCard'
import { CostumeDetailModal } from '../components/atelier/CostumeDetailModal'
import { FilterPanel } from '../components/atelier/FilterPanel'
import { Button, EmptyState } from '../components/ui'
import { COSTUMES } from '../data/costumes'
import { AESTHETIC_ORDER } from '../data/identities'
import { filterCostumes, type AtelierFilters } from '../engine/filters'
import { QuizProvider } from '../state/QuizContext'
import { useQuiz } from '../state/quizContextValue'
import type { Costume } from '../types/engine'

// Results links here with ?aesthetic=velvet. Anything else in the address is ignored.
function initialFilters(param: string | null): AtelierFilters {
  const aesthetic = AESTHETIC_ORDER.find((id) => id === param)
  return aesthetic ? { aesthetic } : {}
}

function AtelierInner() {
  const [params] = useSearchParams()
  const { answers } = useQuiz()
  const [filters, setFilters] = useState<AtelierFilters>(() => initialFilters(params.get('aesthetic')))
  const [open, setOpen] = useState<{ costume: Costume; opener: HTMLElement } | null>(null)
  const shown = filterCostumes(COSTUMES, filters)

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <p className="label-tech">Browse every look</p>
        <h1 className="text-4xl">The Costume Atelier</h1>
        <p className="max-w-2xl text-lg">Every costume HAUNTED can recommend, with real costs and steps. Costs are estimates, not live prices.</p>
      </header>

      <FilterPanel filters={filters} currency={answers.currency} count={shown.length} onChange={setFilters} />

      <section aria-labelledby="costumes-heading">
        <h2 id="costumes-heading" className="sr-only">Costumes</h2>
        {shown.length === 0 ? (
          <EmptyState
            icon={<SearchX size={36} />}
            title="No costumes match these filters"
            description="Try a larger budget, more prep time or a different aesthetic."
            action={<Button onClick={() => setFilters({})}>Clear filters</Button>}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => (
              <li key={c.id}><CostumeCard costume={c} currency={answers.currency} onDetails={(costume, opener) => setOpen({ costume, opener })} /></li>
            ))}
          </ul>
        )}
      </section>

      <AlchemistPanel answers={answers} />
      {open && <CostumeDetailModal costume={open.costume} opener={open.opener} currency={answers.currency} onClose={() => setOpen(null)} />}
    </div>
  )
}

export default function Atelier() {
  return (
    <QuizProvider>
      <AtelierInner />
    </QuizProvider>
  )
}
