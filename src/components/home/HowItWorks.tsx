import { ClipboardList, Sparkles, Shirt } from 'lucide-react'
import { GlassPanel } from '../ui'

const steps = [
  {
    icon: ClipboardList,
    title: 'Answer 12 short questions',
    text: 'Tell us about your style, budget, time, comfort and the clothes you already own.',
  },
  {
    icon: Sparkles,
    title: 'Awaken your alter ego',
    text: 'Your answers shape a Halloween identity: a creative styling profile, made just for fun.',
  },
  {
    icon: Shirt,
    title: 'Get costumes you can really make',
    text: 'Up to three looks that fit your budget and time, each with a plain reason why.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" tabIndex={-1} aria-labelledby="how-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 outline-none">
      <p className="label-tech text-center">Three steps</p>
      <h2 id="how-heading" className="mt-2 text-center text-3xl sm:text-4xl">How It Works</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title}>
            <GlassPanel className="h-full p-6">
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-ember" aria-hidden="true">{i + 1}</span>
                <Icon className="text-gold" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2">{text}</p>
            </GlassPanel>
          </li>
        ))}
      </ol>
    </section>
  )
}
