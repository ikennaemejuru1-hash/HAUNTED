import { Doorway } from '../components/home/Doorway'
import { ExploreStyles } from '../components/home/ExploreStyles'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'

// The four chapters of the Threshold (R15.1): approach, threshold, hall, doorway.
export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ExploreStyles />
      <Doorway />
    </>
  )
}
