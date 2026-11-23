import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { COSTUMES } from '../data/costumes'
import { GRIMOIRE_KEY, validateGrimoire } from '../state/grimoireLogic'
import { QUIZ_KEY } from '../state/quizLogic'
import { renderAt } from '../test-utils'

beforeAll(async () => {
  await Promise.all([import('./Atelier'), import('./Grimoire')])
  window.scrollTo = () => {}
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
})
beforeEach(() => window.localStorage.clear())
afterEach(() => vi.restoreAllMocks())

const first = COSTUMES[0]
const stored = () => JSON.parse(window.localStorage.getItem(GRIMOIRE_KEY) ?? 'null')

describe('Atelier page (R8)', () => {
  it('shows every costume and combines filters; Clear filters resets (AC18)', async () => {
    const user = userEvent.setup()
    renderAt('/atelier')
    expect(await screen.findAllByTestId('costume-card')).toHaveLength(COSTUMES.length)
    await user.selectOptions(screen.getByLabelText('Aesthetic'), 'neon')
    await user.selectOptions(screen.getByLabelText('Difficulty'), 'hard')
    await user.selectOptions(screen.getByLabelText('Budget'), 'lt20')
    await user.selectOptions(screen.getByLabelText('Prep time'), 'lt30m')
    expect(screen.queryAllByTestId('costume-card')).toHaveLength(0)
    expect(screen.getByRole('heading', { name: 'No costumes match these filters' })).toBeInTheDocument()
    const empty = screen.getByRole('heading', { name: 'No costumes match these filters' }).parentElement!
    await user.click(within(empty).getByRole('button', { name: 'Clear filters' }))
    expect(screen.getAllByTestId('costume-card')).toHaveLength(COSTUMES.length)
  })

  it('reads ?aesthetic= from the address and ignores bad values', async () => {
    renderAt('/atelier?aesthetic=crimson')
    await screen.findAllByTestId('costume-card')
    expect(screen.getByLabelText('Aesthetic')).toHaveValue('crimson')
  })

  it('ignores an unknown aesthetic', async () => {
    renderAt('/atelier?aesthetic=purple')
    expect(await screen.findAllByTestId('costume-card')).toHaveLength(COSTUMES.length)
    expect(screen.getByLabelText('Aesthetic')).toHaveValue('')
  })

  it('uses placeholders when no image is set', async () => {
    renderAt('/atelier')
    await screen.findAllByTestId('costume-card')
    expect(screen.getAllByTestId('costume-placeholder').length).toBeGreaterThan(0)
  })

  it('detail dialog opens, closes with Escape, close button and outside click, and returns focus', async () => {
    const user = userEvent.setup()
    renderAt('/atelier')
    const opener = await screen.findByRole('button', { name: `View details: ${first.name}` })
    await user.click(opener)
    const dialog = screen.getByRole('dialog', { name: first.name })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('heading', { name: 'Make it yourself' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()

    await user.click(opener)
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()

    await user.click(opener)
    await user.click(screen.getByTestId('modal-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Tab stays inside the dialog', async () => {
    const user = userEvent.setup()
    renderAt('/atelier')
    await user.click(await screen.findByRole('button', { name: `View details: ${first.name}` }))
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await user.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    }
    await user.tab({ shift: true })
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('Alchemist uses the wardrobe and budget from the quiz and never exceeds the budget', async () => {
    window.localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers: { currency: 'USD', budget: 'lt20', wardrobe: ['black', 'boots'] }, step: 3 }))
    renderAt('/atelier')
    const cards = await screen.findAllByTestId('alchemist-card')
    expect(cards.length).toBeGreaterThan(0)
    expect(screen.getByText(/build mostly from what you already own|cheapest complete looks/)).toBeInTheDocument()
    for (const c of cards) expect(c).toHaveTextContent(/Extra cost about \$\d+ to \$([0-9]|1[0-9]|20)\./)
  })

  it('Alchemist works with no quiz and explains it', async () => {
    renderAt('/atelier')
    expect(await screen.findByText(/Take the quiz and tell us what you own/)).toBeInTheDocument()
    expect((await screen.findAllByTestId('alchemist-card')).length).toBeGreaterThan(0)
  })
})

describe('Grimoire (R10, AC13, AC14)', () => {
  it('shows an empty state with a link to the Atelier', async () => {
    renderAt('/grimoire')
    expect(await screen.findByRole('heading', { name: 'Your Grimoire is empty' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse the Atelier' })).toHaveAttribute('href', '/atelier')
  })

  it('saves from the Atelier, persists, shows in the Grimoire and removes', async () => {
    const user = userEvent.setup()
    const { unmount } = renderAt('/atelier')
    const save = (await screen.findAllByRole('button', { name: `Save: ${first.name}` }))[0]
    await user.click(save)
    expect(screen.getAllByRole('button', { name: `Saved: ${first.name}`, pressed: true })[0]).toBeInTheDocument()
    expect(stored()).toMatchObject({ version: 1, costumes: [first.id] })
    unmount()

    renderAt('/grimoire') // a fresh mount reads storage, like a refresh
    expect(await screen.findAllByTestId('saved-card')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: `Remove: ${first.name}` }))
    expect(screen.queryByTestId('saved-card')).not.toBeInTheDocument()
    expect(stored().costumes).toEqual([])
  })

  it('Save in the dialog and on the card show the same state', async () => {
    const user = userEvent.setup()
    renderAt('/atelier')
    await user.click(await screen.findByRole('button', { name: `View details: ${first.name}` }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: `Save: ${first.name}` }))
    expect(within(dialog).getByRole('button', { name: `Saved: ${first.name}` })).toBeInTheDocument()
    // The card behind the dialog (and any Alchemist card for the same look) show the same state.
    expect(screen.queryByRole('button', { name: `Save: ${first.name}`, hidden: true })).not.toBeInTheDocument()
  })

  it('malformed JSON loads as an empty Grimoire', async () => {
    window.localStorage.setItem(GRIMOIRE_KEY, '{not json')
    renderAt('/grimoire')
    expect(await screen.findByRole('heading', { name: 'Your Grimoire is empty' })).toBeInTheDocument()
  })

  it('wrong shapes and unknown ids are ignored safely', async () => {
    expect(validateGrimoire([1, 2])).toBeNull()
    expect(validateGrimoire('x')).toBeNull()
    expect(validateGrimoire({ version: 99, costumes: [first.id] })).toBeNull()
    expect(validateGrimoire({ costumes: [first.id, 'ghost-id', 7, first.id] })?.costumes).toEqual([first.id])
    window.localStorage.setItem(GRIMOIRE_KEY, JSON.stringify({ version: 1, identity: { name: 5 }, costumes: ['nope'] }))
    renderAt('/grimoire')
    expect(await screen.findByRole('heading', { name: 'Your Grimoire is empty' })).toBeInTheDocument()
  })

  it('migrates the early unversioned shape and keeps the identity', async () => {
    window.localStorage.setItem(GRIMOIRE_KEY, JSON.stringify({ identity: 'Velvet Phantom', costumes: [first.id] }))
    renderAt('/grimoire')
    expect(await screen.findByText('Velvet Phantom')).toBeInTheDocument()
    expect(screen.getAllByTestId('saved-card')).toHaveLength(1)
    expect(validateGrimoire({ identity: 'The Velvet Enigma', costumes: [] })?.identity).toMatchObject({ primary: 'velvet', secondary: 'velvet' })
  })

  it('links back to the recommendations when a quiz result exists', async () => {
    const answers = { currency: 'USD', q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', budget: '20to50', time: '30m2h', comfort: 'stylish', wardrobe: ['black'], event: 'party', playMode: 'solo' }
    window.localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers, step: 11 }))
    window.localStorage.setItem(GRIMOIRE_KEY, JSON.stringify({ version: 1, identity: { name: 'The Velvet Enigma', primary: 'velvet', secondary: 'velvet' }, costumes: [] }))
    renderAt('/grimoire')
    expect(await screen.findByRole('link', { name: 'Back to my recommendations' })).toHaveAttribute('href', '/results')
  })

  it('keeps working in memory and shows a notice when storage is blocked', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError') })
    const { unmount } = renderAt('/atelier')
    await user.click((await screen.findAllByRole('button', { name: `Save: ${first.name}` }))[0])
    expect(screen.getAllByRole('button', { name: `Saved: ${first.name}` })[0]).toBeInTheDocument()
    unmount()
    renderAt('/grimoire')
    expect(await screen.findByText(/Your browser is blocking storage/)).toBeInTheDocument()
    expect(await screen.findAllByTestId('saved-card')).toHaveLength(1)
  })
})

describe('About (R11)', () => {
  it('covers the concept, engine, the not-psychology note and the repository link', async () => {
    renderAt('/about')
    expect(await screen.findByRole('heading', { name: 'About HAUNTED' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'How the engine works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A styling profile, not psychology' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Credits' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View the repository' })).toHaveAttribute('href', expect.stringContaining('github.com'))
  })
})
