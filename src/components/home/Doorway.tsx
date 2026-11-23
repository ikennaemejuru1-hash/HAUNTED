import { useDoorway } from '../../three/useDoorway'
import { Button } from '../ui'

// Chapter 3. The camera faces the glowing door; pressing the button pushes through it.
export function Doorway() {
  const push = useDoorway('/discover')
  return (
    <section id="doorway" aria-labelledby="doorway-heading" className="flex min-h-[80svh] items-center justify-center px-4 py-20">
      <div className="text-scrim max-w-xl px-6 py-10 text-center">
        <p className="label-tech">The final door</p>
        <h2 id="doorway-heading" className="mt-2 text-3xl sm:text-4xl">Step through</h2>
        <p className="mt-3">Twelve short questions stand between you and your alter ego.</p>
        <div className="mt-8 flex justify-center">
          <Button to="/discover" onClick={push}>DISCOVER YOUR DARK SIDE</Button>
        </div>
      </div>
    </section>
  )
}
