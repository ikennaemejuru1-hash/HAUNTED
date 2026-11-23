import { Button, GlassPanel } from '../components/ui'

const REPO = 'https://github.com/ikennaemejuru1-hash/HAUNTED'

const stack = [
  'React 19 and TypeScript in strict mode',
  'Vite for building, Tailwind CSS for styling',
  'React Router with hash addresses, so the site works on static hosting',
  'Three.js with React Three Fiber for the 3D Threshold, loaded only after the page is ready',
  'Framer Motion and GSAP for interface and cinematic motion',
  'Vitest and Testing Library for tests',
]

// R11.1: concept, stack, how the engine works, the "not psychology" note, credits and the repository link.
export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header className="space-y-3">
        <p className="label-tech">The idea</p>
        <h1 className="text-4xl">About HAUNTED</h1>
        <p className="text-lg">
          HAUNTED turns a short quiz into a Halloween alter ego and up to three costumes you can really make, matched to your budget,
          your time and the clothes you already own.
        </p>
      </header>

      <GlassPanel className="bg-obsidian/75 p-5">
        <h2 className="text-2xl">How the engine works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>The first six questions each give points to one of four styles: Velvet Enigma, Arcane Wanderer, Crimson Phantom and Neon Revenant.</li>
          <li>The style with the most points is your identity. If two styles are very close, you get a hybrid name that blends them.</li>
          <li>Your budget and time limits remove costumes that are too costly or take too long. They are never bent.</li>
          <li>The rest are ranked by how well they fit your style, comfort level, event, group size and wardrobe. Items you own score higher.</li>
          <li>Every pick comes with plain reasons, so you can see why it was chosen. The same answers always give the same result.</li>
        </ol>
      </GlassPanel>

      <GlassPanel className="bg-obsidian/75 p-5" role="note">
        <h2 className="text-2xl">A styling profile, not psychology</h2>
        <p className="mt-3">
          Your identity is a creative styling profile made for fun. It does not measure your real personality and it is not a test of any kind.
          Costs are estimates in fixed rates, not live prices.
        </p>
      </GlassPanel>

      <GlassPanel className="bg-obsidian/75 p-5">
        <h2 className="text-2xl">Your privacy</h2>
        <p className="mt-3">
          Your answers and saved looks stay in your browser's Local Storage. HAUNTED has no accounts, no analytics and sends nothing about you anywhere.
        </p>
      </GlassPanel>

      <GlassPanel className="bg-obsidian/75 p-5">
        <h2 className="text-2xl">Built with</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">{stack.map((s) => <li key={s}>{s}</li>)}</ul>
      </GlassPanel>

      <GlassPanel className="bg-obsidian/75 p-5">
        <h2 className="text-2xl">Credits</h2>
        <p className="mt-3">
          Designed and built by the HAUNTED team with Kiro. Fonts are Cinzel, Inter and Space Grotesk (open licence, via Fontsource).
          Icons are from Lucide. Costume pictures are stylised placeholders until final art is added.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-sm border border-gold px-6 font-tech text-sm font-semibold uppercase tracking-[0.14em] text-gold hover:bg-burgundy hover:text-silver">
            View the repository
          </a>
          <Button to="/discover">Discover your dark side</Button>
        </div>
      </GlassPanel>
    </div>
  )
}
