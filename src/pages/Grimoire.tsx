import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SavedCostumeCard } from '../components/grimoire/SavedCostumeCard'
import { Button, EmptyState, GlassPanel } from '../components/ui'
import { COSTUMES } from '../data/costumes'
import { IDENTITIES } from '../data/identities'
import { useGrimoire } from '../state/grimoireContextValue'
import { QuizProvider } from '../state/QuizContext'
import { useQuiz } from '../state/quizContextValue'

function GrimoireInner() {
  const { identity, costumes, persistent, remove } = useGrimoire()
  const { answers, isComplete } = useQuiz()
  // Saved ids were checked on load, but look each one up anyway so an unknown id can never crash the page.
  const saved = costumes.flatMap((id) => COSTUMES.find((c) => c.id === id) ?? [])
  const empty = saved.length === 0 && !identity

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="label-tech">Kept on this device</p>
        <h1 className="text-4xl">Your Grimoire</h1>
      </header>

      {!persistent && (
        <GlassPanel className="bg-obsidian/75 p-4" role="note">
          <p className="text-sm">Your browser is blocking storage, so saved looks last only until you close this page. Everything still works meanwhile.</p>
        </GlassPanel>
      )}

      {empty ? (
        <EmptyState
          icon={<BookOpen size={36} />}
          title="Your Grimoire is empty"
          description="Save costumes from the Atelier or your results and they will wait for you here."
          action={<Button to="/atelier">Browse the Atelier</Button>}
        />
      ) : (
        <>
          <GlassPanel className="bg-obsidian/75 p-5">
            <h2 className="text-2xl">Your identity</h2>
            {identity ? (
              <>
                <p className="mt-2 font-display text-3xl text-gold">{identity.name}</p>
                <p className="mt-1">{IDENTITIES[identity.primary].tagline}</p>
              </>
            ) : (
              <p className="mt-2">No identity saved yet. Save your results to keep it here.</p>
            )}
            <div className="mt-4">
              <Button to={isComplete ? '/results' : '/quiz'} variant="secondary">
                {isComplete ? 'Back to my recommendations' : 'Take the quiz'}
              </Button>
            </div>
          </GlassPanel>

          <section aria-labelledby="saved-heading">
            <h2 id="saved-heading" className="text-2xl">Saved costumes ({saved.length})</h2>
            {saved.length === 0 ? (
              <p className="mt-3">No costumes saved yet. <Link className="text-gold underline" to="/atelier">Browse the Atelier</Link>.</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((c) => (
                  <li key={c.id}><SavedCostumeCard costume={c} currency={answers.currency} onRemove={() => remove(c.id)} /></li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default function Grimoire() {
  return (
    <QuizProvider>
      <GrimoireInner />
    </QuizProvider>
  )
}
