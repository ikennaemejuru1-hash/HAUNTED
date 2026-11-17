// Temporary page for task 2.2: shows the palette and fonts so we can check them by eye.
// Task 2.4 and 2.6 replace this with the real layout and Home page.
const swatches = [
  ['obsidian', 'bg-obsidian'],
  ['charcoal', 'bg-charcoal'],
  ['burgundy', 'bg-burgundy'],
  ['gold', 'bg-gold'],
  ['ember', 'bg-ember'],
  ['ash', 'bg-ash'],
  ['silver', 'bg-silver'],
] as const

export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <p className="label-tech">Design tokens preview</p>
      <h1 className="font-display text-4xl">HAUNTED</h1>
      <p className="mt-2">Body text in Inter, warm silver on obsidian.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map(([name, cls]) => (
          <li key={name} className="rounded border border-gold/25 p-2">
            <div className={`h-12 rounded ${cls}`} aria-hidden="true" />
            <span className="label-tech">{name}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 min-h-11 rounded bg-gold px-5 font-tech text-obsidian">
        Focus me with Tab
      </button>
    </main>
  )
}
