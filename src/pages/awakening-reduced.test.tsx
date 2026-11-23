import { screen } from '@testing-library/react'
import { QUIZ_KEY } from '../state/quizLogic'
import { renderAt } from '../test-utils'

// Framer Motion reads the reduced-motion setting once, so this case lives in its own file.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduce'), media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
  window.scrollTo = () => {}
})

it('reduced motion skips the sequence and shows the card at once (R6.5)', async () => {
  const answers = { currency: 'USD', q1: 'A', q2: 'A', q3: 'B', q4: 'A', q5: 'A', q6: 'A', budget: '20to50', time: '30m2h', comfort: 'stylish', wardrobe: ['black'], event: 'party', playMode: 'solo' }
  window.localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers, step: 11 }))
  renderAt('/awakening')
  expect(await screen.findByTestId('identity-card')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument()
  expect(document.querySelector('canvas')).toBeNull()
})
