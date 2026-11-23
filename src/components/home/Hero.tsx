import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { useDoorway } from '../../three/useDoorway'
import { scrollToSection } from '../../utils/scroll'

export function Hero() {
  const reduce = useReducedMotion()
  const push = useDoorway('/discover')
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
      className="relative flex min-h-[calc(100svh-4rem)] flex-col"
    >
      <div className="text-scrim relative mx-auto my-auto flex w-full max-w-3xl flex-col justify-center px-6 py-14 text-center">
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
          <Button to="/discover" onClick={push} className="w-full max-w-xs">
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
    </section>
  )
}
