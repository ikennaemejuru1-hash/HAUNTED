import { useState } from 'react'
import { world } from '../../three/bus'
import { cn } from '../../utils/cn'
import { Badge, GlassPanel } from '../ui'
import { Sigil } from './Sigil'

// Short teasers only. Full identity descriptions arrive with the engine in Phase 4.
// The order matches the four artefacts in the 3D hall: mirror, grimoire, mask, lantern.
const styles = [
  { sigil: 'mirror', name: 'The Velvet Enigma', mood: 'Gothic luxury', text: 'Dark elegance, rich fabrics and quiet mystery.' },
  { sigil: 'grimoire', name: 'The Arcane Wanderer', mood: 'Haunted fantasy', text: 'Old magic, long cloaks and symbols that glow in the mist.' },
  { sigil: 'mask', name: 'The Crimson Phantom', mood: 'Horror cinema', text: 'Dramatic shadows, deep reds and a flair for the theatrical.' },
  { sigil: 'lantern', name: 'The Neon Revenant', mood: 'Futuristic Halloween', text: 'Sharp, modern and electric, with a ghost from the future.' },
] as const

export function ExploreStyles() {
  // Hover and keyboard focus preview an artefact. Tapping pins it, which is how touch screens use it.
  const [pinned, setPinned] = useState(-1)
  const [hover, setHover] = useState(-1)
  const set = (hoverIndex: number) => {
    setHover(hoverIndex)
    world.active = hoverIndex >= 0 ? hoverIndex : pinned
  }
  const pin = (i: number) => {
    const next = pinned === i ? -1 : i
    setPinned(next)
    world.active = next
  }

  return (
    <section id="explore-styles" tabIndex={-1} aria-labelledby="styles-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 outline-none">
      <div className="text-scrim mx-auto max-w-2xl px-4 py-6 text-center">
        <p className="label-tech">Four identities and their blends</p>
        <h2 id="styles-heading" className="mt-2 text-3xl sm:text-4xl">Explore Styles</h2>
        <p className="mx-auto mt-3 max-w-xl">
          Your answers can land on one style or a blend of two, like a Velvet Phantom.
        </p>
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {styles.map(({ sigil, name, mood, text }, i) => {
          const on = hover === i || pinned === i
          return (
            <li key={name}>
              <button
                type="button"
                aria-pressed={pinned === i}
                onClick={() => pin(i)}
                onPointerEnter={() => set(i)}
                onPointerLeave={() => set(-1)}
                onFocus={() => set(i)}
                onBlur={() => set(-1)}
                className="block h-full w-full rounded-md text-left"
              >
                <GlassPanel className={cn('h-full p-6 transition-colors duration-200', on ? 'border-gold/70 bg-burgundy/40' : 'bg-obsidian/70')}>
                  <Sigil name={sigil} className={cn('transition-colors', on ? 'text-ember' : 'text-gold')} />
                  <h3 className="mt-4 text-xl">{name}</h3>
                  <Badge className="mt-2">{mood}</Badge>
                  <p className="mt-3">{text}</p>
                </GlassPanel>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
