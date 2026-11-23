import { Button, GlassPanel } from '../components/ui'

const facts = [
  ['12', 'questions'],
  ['4', 'short sections'],
  ['~3', 'minutes'],
]

// The Discovery Introduction (R2.4). Start leads to the quiz, which is built in Phase 3.
export default function Discover() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
     {/* The doorway glow is the page backdrop (PosterBackdrop). The content sits on its own panel. */}
     <GlassPanel className="bg-obsidian/75 px-5 py-10 text-center sm:px-10">
      <p className="label-tech">Before you begin</p>
      <h1 className="mt-2 text-4xl">Discover Your Dark Side</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg">
        Answer a few questions about your style, budget, time and wardrobe. HAUNTED turns them into
        a Halloween identity and up to three costumes you can really make.
      </p>
      <ul className="mt-10 grid grid-cols-3 gap-3">
        {facts.map(([n, label]) => (
          <li key={label}>
            <GlassPanel className="p-4">
              <p className="font-display text-3xl text-gold">{n}</p>
              <p className="label-tech mt-1">{label}</p>
            </GlassPanel>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-8 max-w-xl text-sm text-ash">
        Your identity is a creative styling profile, made for fun. It does not measure your real
        personality. Nothing you answer leaves your browser.
      </p>
      <div className="mt-8 flex justify-center">
        <Button to="/quiz">Start the quiz</Button>
      </div>
     </GlassPanel>
    </div>
  )
}
