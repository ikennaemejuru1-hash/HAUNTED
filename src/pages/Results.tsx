import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityCard } from '../components/results/IdentityCard'
import { resultText } from '../components/results/resultText'
import { NoResult } from '../components/results/NoResult'
import { RecommendationCard } from '../components/results/RecommendationCard'
import { Badge, Button, GlassPanel } from '../components/ui'
import { budgetLabel } from '../data/currency'
import { AESTHETIC_ORDER, IDENTITIES } from '../data/identities'
import { QUESTIONS } from '../data/questions'
import { QuizProvider } from '../state/QuizContext'
import { useResult } from '../state/useResult'
import { useSavedLooks } from '../state/useSavedLooks'
import type { RecommendationResult } from '../types/engine'
import type { QuizAnswers } from '../types/quiz'

const timeLabel = (a: QuizAnswers) => QUESTIONS.find((q) => q.key === 'time')?.options.find((o) => o.value === a.time)?.label

function ResultsView({ result, answers, onRetake }: { result: RecommendationResult; answers: QuizAnswers; onRetake: () => void }) {
  const { identity, recommendations, notices } = result
  const { data, saveResult, saveCostume } = useSavedLooks()
  const [confirming, setConfirming] = useState(false)
  const [status, setStatus] = useState('')
  const profile = IDENTITIES[identity.primary]
  const second = IDENTITIES[identity.secondary]
  const advice = identity.isHybrid ? [...profile.advice.slice(0, 2), second.advice[0]] : profile.advice
  const ids = recommendations.map((r) => r.costume.id)
  const allSaved = data.identity === identity.name && ids.every((id) => data.costumes.includes(id))
  const maxScore = Math.max(...Object.values(identity.scores), 1)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resultText(result))
      setStatus('Copied to your clipboard.')
    } catch {
      setStatus('Copy is not available in this browser. Select the text from your results instead.')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <h1 className="sr-only">Your results</h1>
      <IdentityCard identity={identity} />

      {notices.length > 0 && (
        <GlassPanel className="bg-obsidian/75 p-4" role="note">
          <ul className="space-y-1 text-sm">{notices.map((n) => <li key={n}>{n}</li>)}</ul>
        </GlassPanel>
      )}

      <section aria-labelledby="picks-heading">
        <h2 id="picks-heading" className="text-2xl">Your costume picks</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {recommendations.map((r, i) => (
            <li key={r.costume.id}>
              <RecommendationCard
                rec={r}
                rank={i + 1}
                currency={answers.currency}
                saved={data.costumes.includes(r.costume.id)}
                onSave={() => saveCostume(r.costume.id)}
              />
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassPanel className="bg-obsidian/75 p-5">
          <h2 className="text-xl">Your style scores</h2>
          <ul className="mt-3 space-y-3">
            {AESTHETIC_ORDER.map((id) => (
              <li key={id}>
                <div className="flex justify-between text-sm"><span>{IDENTITIES[id].name}</span><span>{identity.scores[id]}</span></div>
                <div className="mt-1 h-2 rounded-sm bg-charcoal" role="presentation">
                  <div className="h-2 rounded-sm bg-gold" style={{ width: `${(identity.scores[id] / maxScore) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </GlassPanel>
        <GlassPanel className="bg-obsidian/75 p-5">
          <h2 className="text-xl">Your palette</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {profile.palette.map((c) => (
              <li key={c.name} className="flex items-center gap-2 text-sm">
                <span className="h-8 w-8 shrink-0 rounded-sm border border-gold/40" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
        <GlassPanel className="bg-obsidian/75 p-5">
          <h2 className="text-xl">Your budget and time</h2>
          <p className="mt-3 text-sm">
            Budget: {answers.budget ? budgetLabel(answers.budget, answers.currency) : 'not set'}. Time: {timeLabel(answers)?.toLowerCase() ?? 'not set'}.
          </p>
          <p className="mt-2 text-sm text-ash">Costs are estimates, not live prices.</p>
        </GlassPanel>
        <GlassPanel className="bg-obsidian/75 p-5">
          <h2 className="text-xl">Styling advice</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{advice.map((a) => <li key={a}>{a}</li>)}</ul>
        </GlassPanel>
      </div>

      <GlassPanel className="bg-obsidian/75 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Button to={`/atelier?aesthetic=${identity.primary}`}>Explore my costumes</Button>
          <Button variant="secondary" onClick={() => saveResult(identity.name, ids)} aria-pressed={allSaved}>
            {allSaved ? 'Saved to my Grimoire' : 'Save to my Grimoire'}
          </Button>
          <Button variant="ghost" onClick={copy}>Copy my result</Button>
          <Button variant="ghost" onClick={() => setConfirming(true)}>Retake the quiz</Button>
        </div>
        <p role="status" className="mt-3 min-h-5 text-sm text-ash">{status || (allSaved ? 'Saved on this device only.' : '')}</p>
        {confirming && (
          <div role="alertdialog" aria-labelledby="retake-title" aria-describedby="retake-desc" className="mt-3 rounded-sm border border-ember/60 p-4">
            <p id="retake-title" className="font-display text-lg">Retake the quiz?</p>
            <p id="retake-desc" className="mt-1 text-sm">This clears your answers and this result. Anything in your Grimoire stays.</p>
            <div className="mt-3 flex gap-3">
              <Button onClick={onRetake}>Yes, clear and retake</Button>
              <Button variant="secondary" autoFocus onClick={() => setConfirming(false)}>Keep my result</Button>
            </div>
          </div>
        )}
        <Badge className="mt-4">Made for fun, not a personality test</Badge>
      </GlassPanel>
    </div>
  )
}

function ResultsInner() {
  const { result, answers, reset } = useResult()
  const navigate = useNavigate()
  if (!result) return <NoResult />
  return (
    <ResultsView
      result={result}
      answers={answers}
      onRetake={() => {
        reset()
        navigate('/quiz')
      }}
    />
  )
}

export default function Results() {
  return (
    <QuizProvider>
      <ResultsInner />
    </QuizProvider>
  )
}
