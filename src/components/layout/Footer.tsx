import { Link } from 'react-router-dom'
import { useFx } from '../../three/fxContext'
import { cn } from '../../utils/cn'

// Visual effects switch (R15.9). Full and Balanced both count as "Full"; the choice is remembered.
function EffectsSwitch() {
  const { tier, setPreference } = useFx()
  const options = [
    { label: 'Full', value: 'full' as const, on: tier !== 'lite' },
    { label: 'Lite', value: 'lite' as const, on: tier === 'lite' },
  ]
  return (
    <div role="group" aria-label="Visual effects" className="mt-4 flex flex-wrap items-center gap-2">
      <span className="label-tech">Visual effects</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.on}
          onClick={() => setPreference(o.value)}
          className={cn(
            'min-h-11 min-w-16 rounded-sm border px-4 font-tech text-xs uppercase tracking-[0.14em]',
            o.on ? 'border-gold bg-burgundy text-silver' : 'border-ash/50 text-silver hover:border-gold hover:text-gold',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-gold/25 bg-obsidian px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="font-display text-lg tracking-[0.2em] text-gold">HAUNTED</p>
          <p className="mt-2 text-sm">Discover the costume your alter ego would wear.</p>
          <p className="mt-2 text-sm text-ash">
            Identities are creative styling profiles for fun. They do not measure real
            personality. Costs shown are estimates.
          </p>
          <EffectsSwitch />
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6">
            <li><Link className="flex min-h-11 items-center text-sm hover:text-gold" to="/discover">Discover</Link></li>
            <li><Link className="flex min-h-11 items-center text-sm hover:text-gold" to="/atelier">Atelier</Link></li>
            <li><Link className="flex min-h-11 items-center text-sm hover:text-gold" to="/grimoire">Grimoire</Link></li>
            <li><Link className="flex min-h-11 items-center text-sm hover:text-gold" to="/about">About</Link></li>
            <li>
              <a
                className="flex min-h-11 items-center text-sm hover:text-gold"
                href="https://github.com/ikennaemejuru1-hash/HAUNTED"
                target="_blank"
                rel="noreferrer"
              >
                Source code
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
