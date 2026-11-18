import { Link } from 'react-router-dom'

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
