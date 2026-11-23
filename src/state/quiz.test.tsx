import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QUESTIONS } from '../data/questions'
import { budgetLabel } from '../data/currency'
import { renderAt } from '../test-utils'
import { QUIZ_KEY, toggleWardrobe, validateState } from './quizLogic'

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
  window.scrollTo = () => {}
})
beforeEach(() => window.localStorage.clear())

const next = () => screen.getByRole('button', { name: /^(Next|Awaken)$/ })
const pick = async (name: RegExp | string) => userEvent.click(await screen.findByRole('radio', { name }))

describe('quiz data', () => {
  it('has 12 questions in sections A to D with unique option values', () => {
    expect(QUESTIONS).toHaveLength(12)
    expect(new Set(QUESTIONS.map((q) => q.section))).toEqual(new Set(['A', 'B', 'C', 'D']))
    QUESTIONS.forEach((q) => expect(new Set(q.options.map((o) => o.value)).size).toBe(q.options.length))
    expect(QUESTIONS.find((q) => q.number === 10)?.kind).toBe('multi')
  })
})

describe('Q10 rules (AC3)', () => {
  it('scratch clears others, and another item clears scratch', () => {
    expect(toggleWardrobe(['black', 'boots'], 'scratch')).toEqual(['scratch'])
    expect(toggleWardrobe(['scratch'], 'boots')).toEqual(['boots'])
    expect(toggleWardrobe(['boots'], 'boots')).toEqual([])
  })
})

describe('currency (R3.6)', () => {
  it('labels change with currency while tier ids stay fixed', () => {
    expect(budgetLabel('lt20', 'USD')).toBe('Under $20')
    expect(budgetLabel('20to50', 'NGN')).toBe('₦30,000 to ₦75,000')
    expect(budgetLabel('gt100', 'GBP')).toBe('Over £80')
  })
})

describe('saved data', () => {
  it('discards corrupt or out of range data', () => {
    expect(validateState(null)).toBeNull()
    expect(validateState({ answers: 5, step: 0 })).toBeNull()
    expect(validateState({ answers: {}, step: 99 })).toBeNull()
  })
  it('drops unknown values and never resumes past a gap', () => {
    const s = validateState({ answers: { q1: 'A', q2: 'Z', wardrobe: ['boots', 'bogus'] }, step: 8 })
    expect(s?.answers.q1).toBe('A')
    expect(s?.answers.q2).toBeUndefined()
    expect(s?.answers.wardrobe).toEqual(['boots'])
    expect(s?.step).toBe(1)
  })
})

describe('quiz page', () => {
  it('disables Next with a reason until answered, then Previous keeps the answer', async () => {
    renderAt('/quiz')
    await screen.findByRole('radiogroup')
    expect(screen.getByText('1 of 12')).toBeInTheDocument()
    expect(screen.getByText(/Section A/)).toBeInTheDocument()
    expect(next()).toBeDisabled()
    expect(screen.getByText('Choose an answer to continue.')).toBeInTheDocument()
    await pick(/quiet confidence/)
    expect(next()).toBeEnabled()
    await userEvent.click(next())
    expect(await screen.findByText('2 of 12')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(await screen.findByRole('radio', { name: /quiet confidence/ })).toBeChecked()
    // Changing an answer is allowed.
    await pick(/strange symbols/)
    expect(screen.getByRole('radio', { name: /strange symbols/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /quiet confidence/ })).not.toBeChecked()
  })

  it('persists progress across a refresh and ignores corrupt storage', async () => {
    const first = renderAt('/quiz')
    await pick(/quiet confidence/)
    await userEvent.click(next())
    await screen.findByText('2 of 12')
    first.unmount()
    renderAt('/quiz')
    expect(await screen.findByText('2 of 12')).toBeInTheDocument()
    window.localStorage.setItem(QUIZ_KEY, '{not json')
    document.body.innerHTML = ''
    renderAt('/quiz')
    expect(await screen.findByText('1 of 12')).toBeInTheDocument()
  })

  it('Q10 multi-select with exclusive scratch, and the last button reads Awaken', async () => {
    window.localStorage.setItem(
      QUIZ_KEY,
      JSON.stringify({
        answers: { currency: 'USD', q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', budget: 'lt20', time: 'lt30m', comfort: 'simple', wardrobe: [] },
        step: 9,
      }),
    )
    renderAt('/quiz')
    const boots = await screen.findByRole('checkbox', { name: 'Boots' })
    const black = screen.getByRole('checkbox', { name: 'Black clothing' })
    const scratch = screen.getByRole('checkbox', { name: /Start from scratch/ })
    expect(next()).toBeDisabled()
    await userEvent.click(boots)
    await userEvent.click(black)
    expect(boots).toBeChecked()
    expect(black).toBeChecked()
    await userEvent.click(scratch)
    expect(scratch).toBeChecked()
    expect(boots).not.toBeChecked()
    await userEvent.click(boots)
    expect(scratch).not.toBeChecked()
    await userEvent.click(next())
    await pick(/Halloween party/)
    await userEvent.click(next())
    expect(await screen.findByText('12 of 12')).toBeInTheDocument()
    expect(next()).toHaveTextContent('Awaken')
    expect(next()).toBeDisabled()
  })

  it('Q7 shows currency labels and stores the tier', async () => {
    window.localStorage.setItem(
      QUIZ_KEY,
      JSON.stringify({ answers: { currency: 'NGN', q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', wardrobe: [] }, step: 6 }),
    )
    renderAt('/quiz')
    await pick('Under ₦30,000')
    await userEvent.click(screen.getByRole('radio', { name: 'USD' }))
    expect(screen.getByRole('radio', { name: 'Under $20' })).toBeChecked()
    expect(JSON.parse(window.localStorage.getItem(QUIZ_KEY)!).answers.budget).toBe('lt20')
  })
})
