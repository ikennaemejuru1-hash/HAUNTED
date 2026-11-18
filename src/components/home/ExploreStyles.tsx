import { Gem, Moon, Flame, Zap } from 'lucide-react'
import { Badge, Button, GlassPanel } from '../ui'

// Short teasers only. Full identity descriptions arrive with the engine in Phase 4.
const styles = [
  { icon: Gem, name: 'The Velvet Enigma', mood: 'Gothic luxury', text: 'Dark elegance, rich fabrics and quiet mystery.' },
  { icon: Moon, name: 'The Arcane Wanderer', mood: 'Haunted fantasy', text: 'Old magic, long cloaks and symbols that glow in the mist.' },
  { icon: Flame, name: 'The Crimson Phantom', mood: 'Horror cinema', text: 'Dramatic shadows, deep reds and a flair for the theatrical.' },
  { icon: Zap, name: 'The Neon Revenant', mood: 'Futuristic Halloween', text: 'Sharp, modern and electric, with a ghost from the future.' },
]

export function ExploreStyles() {
  return (
    <section id="explore-styles" tabIndex={-1} aria-labelledby="styles-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 outline-none">
      <p className="label-tech text-center">Four identities and their blends</p>
      <h2 id="styles-heading" className="mt-2 text-center text-3xl sm:text-4xl">Explore Styles</h2>
      <p className="mx-auto mt-3 max-w-xl text-center">
        Your answers can land on one style or a blend of two, like a Velvet Phantom.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {styles.map(({ icon: Icon, name, mood, text }) => (
          <li key={name}>
            <GlassPanel className="h-full p-6 transition-colors duration-200 hover:border-gold/60 hover:bg-burgundy/30">
              <Icon className="text-gold" size={32} aria-hidden="true" />
              <h3 className="mt-4 text-xl">{name}</h3>
              <Badge className="mt-2">{mood}</Badge>
              <p className="mt-3">{text}</p>
            </GlassPanel>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button to="/discover">DISCOVER YOUR DARK SIDE</Button>
      </div>
    </section>
  )
}
