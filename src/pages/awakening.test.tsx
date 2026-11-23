import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { recommend } from '../engine'
import { QUIZ_KEY, validateState } from '../state/quizLogic'
import { renderAt } from '../test-utils'
import { PHASES } from '../components/awakening/timeline'
import { SOUND_KEY } from '../hooks/useSound'

const ANSWERS = { currency: 'USD', q1: 'A', q2: 'A', q3: 'B', q4: 'A', q5: 'A', q6: 'A', budget: '20to50', time: '30m2h', comfort: 'stylish', wardrobe: ['black', 'boots'], event: 'party', playMode: 'solo' }
const seed = () => window.localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers: ANSWERS, step: 11 }))
const expected = () => recommend(validateState({ answers: ANSWERS, step: 11 })!.answers)

function mockMedia(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('reduce'), media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeAll(async () => {
  // Load the lazy pages before fake timers start, so Suspense resolves quickly.
  await Promise.all([import('./Awakening'), import('./Results'), import('./Quiz')])
  window.scrollTo = () => {}
})
beforeEach(() => {
  mockMedia(false)
  window.localStorage.clear()
})
afterEach(() => vi.useRealTimers())

describe('awakening timeline (R6, AC21)', () => {
  it('ends within 10 seconds', () => {
    expect(PHASES[PHASES.length - 1].at).toBeLessThan(10)
  })

  it('shows the working text, then the awakened text and the card, with sound off', async () => {
    seed()
    vi.useFakeTimers()
    renderAt('/awakening')
    await act(async () => { await vi.advanceTimersByTimeAsync(100) })
    expect(screen.getByText('YOUR IDENTITY IS TAKING SHAPE...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'false')
    expect(window.localStorage.getItem(SOUND_KEY)).toBeNull()
    expect(document.querySelector('canvas')).toBeNull()
    await act(async () => { await vi.advanceTimersByTimeAsync(8100) })
    expect(screen.getByText('YOUR HALLOWEEN ALTER EGO HAS AWAKENED.')).toBeInTheDocument()
    await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
    expect(screen.getByTestId('identity-card')).toHaveTextContent(expected().identity.name)
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument()
  })

  it.each([0, 2000, 5000, 7000, 8500])('Skip goes straight to the results at %i ms', async (ms) => {
    seed()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderAt('/awakening')
    await act(async () => { await vi.advanceTimersByTimeAsync(ms + 50) })
    const skip = screen.getByRole('button', { name: 'Skip' })
    await act(async () => { skip.click() })
    expect(await screen.findByRole('heading', { name: 'Your costume picks' })).toBeInTheDocument()
  })

  it('shows an empty state with no result', async () => {
    renderAt('/awakening')
    expect(await screen.findByRole('heading', { name: 'No result yet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Take the quiz' })).toHaveAttribute('href', '/quiz')
  })
})

describe('results page (R7, AC12)', () => {
  it('renders the same identity and 3 reasoned picks from fixed answers', async () => {
    seed()
    renderAt('/results')
    const exp = expected()
    expect(await screen.findByRole('heading', { name: exp.identity.name })).toBeInTheDocument()
    const cards = screen.getAllByTestId('recommendation-card')
    expect(cards).toHaveLength(3)
    cards.forEach((card, i) => {
      expect(card).toHaveTextContent(exp.recommendations[i].costume.name)
      expect(card.querySelectorAll('li').length).toBeGreaterThan(0)
    })
    expect(screen.getByRole('heading', { name: 'Your palette' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Styling advice' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore my costumes' })).toHaveAttribute('href', `/atelier?aesthetic=${exp.identity.primary}`)
  })

  it('is identical however many times and wherever it is computed', () => {
    const a = expected()
    expect(JSON.stringify(expected())).toBe(JSON.stringify(a))
  })

  it('saves the result and shows saved state', async () => {
    seed()
    renderAt('/results')
    await userEvent.click(await screen.findByRole('button', { name: 'Save to my Grimoire' }))
    expect(screen.getByRole('button', { name: 'Saved to my Grimoire' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('haunted:v1:grimoire')!).costumes).toHaveLength(3)
  })

  it('retake asks for confirmation, then clears the answers', async () => {
    seed()
    renderAt('/results')
    await userEvent.click(await screen.findByRole('button', { name: 'Retake the quiz' }))
    await userEvent.click(screen.getByRole('button', { name: 'Keep my result' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(QUIZ_KEY)).toContain('"q1":"A"')
    await userEvent.click(screen.getByRole('button', { name: 'Retake the quiz' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, clear and retake' }))
    expect(await screen.findByText('1 of 12')).toBeInTheDocument()
    expect(window.localStorage.getItem(QUIZ_KEY)).not.toContain('"q1":"A"')
  })

  it('shows an empty state with no result', async () => {
    renderAt('/results')
    expect(await screen.findByRole('heading', { name: 'No result yet' })).toBeInTheDocument()
  })
})
