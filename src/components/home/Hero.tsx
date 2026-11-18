import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { HeroArt } from '../art/HeroArt'
import { scrollToSection } from '../../utils/scroll'

export function Hero() {
  const reduce = useReducedMotion()
  // Text rises gently into place. With reduced motion it simply appears.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: 'easeOut' as const, delay },
        }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden"
    >
      {/* Decorative layers sit behind the text (z-index below content). */}
      <div
        aria-hidden="true"
        className="hero-light absolute inset-0 -z-10"
      />
      {/* Vignette: darkens the corners like a film frame. */}
      <div
        aria-hidden="true"
        className="hero-vignette absolute inset-0 -z-10"
      />
      {/* The moon: a soft CSS glow (no hard edges) high on the right, away from the text. */}
      <div aria-hidden="true" className="hero-moon absolute -z-10" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 pb-6 pt-14 text-center">
        <motion.p className="label-tech" {...rise(0)}>
          Kiroween 2026 · Costume discovery
        </motion.p>
        <motion.h1
          id="hero-heading"
          className="mt-4 text-[clamp(2.25rem,8vw,4.5rem)] font-semibold leading-[1.05] hero-text-shadow"
          {...rise(0.1)}
        >
          YOUR ALTER EGO IS WAITING.
        </motion.h1>
        <motion.div
          aria-hidden="true"
          className="mx-auto my-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
          {...rise(0.2)}
        />
        <motion.p className="mx-auto max-w-xl text-lg hero-text-shadow" {...rise(0.3)}>
          Discover the Halloween look that matches your personality, aesthetic and imagination.
        </motion.p>
        <motion.div className="mt-8 flex flex-col items-center gap-4" {...rise(0.4)}>
          <Button to="/discover" className="w-full max-w-xs">
            DISCOVER YOUR DARK SIDE
          </Button>
          <nav aria-label="On this page" className="flex flex-wrap justify-center gap-x-6">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="min-h-11 font-tech text-sm uppercase tracking-[0.14em] text-silver underline-offset-4 hover:text-gold hover:underline"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('explore-styles')}
              className="min-h-11 font-tech text-sm uppercase tracking-[0.14em] text-silver underline-offset-4 hover:text-gold hover:underline"
            >
              Explore Styles
            </button>
            <Link
              to="/about"
              className="flex min-h-11 items-center font-tech text-sm uppercase tracking-[0.14em] text-silver underline-offset-4 hover:text-gold hover:underline"
            >
              About HAUNTED
            </Link>
          </nav>
        </motion.div>
      </div>
      {/* Skyline band: its own space at the bottom, so it never overlaps the text. */}
      <div className="h-[clamp(120px,22vh,220px)] shrink-0">
        <HeroArt />
      </div>
    </section>
  )
}
