import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from './test-utils'

// jsdom has no matchMedia, which Framer Motion and our scroll helper look for.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
  window.scrollTo = () => {}
})

describe('routes (R1, R2)', () => {
  it('home shows the fixed hero copy and the primary button', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'YOUR ALTER EGO IS WAITING.' })).toBeInTheDocument()
    expect(screen.getByText(/Discover the Halloween look that matches/)).toBeInTheDocument()
    // One button in the hero and one closing the Explore Styles section.
    const ctas = screen.getAllByRole('link', { name: 'DISCOVER YOUR DARK SIDE' })
    expect(ctas).toHaveLength(2)
    ctas.forEach((cta) => expect(cta).toHaveAttribute('href', '/discover'))
  })

  it('home runs the lite tier without WebGL: no canvas, poster backdrop and a working effects switch', async () => {
    renderAt('/')
    await screen.findByRole('heading', { level: 1, name: 'YOUR ALTER EGO IS WAITING.' })
    expect(screen.queryByTestId('world')).not.toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()
    expect(screen.getByRole('button', { name: 'Lite' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Full' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('home has the four chapters and four identity controls', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'How It Works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Explore Styles' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Step through' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^The (Velvet|Arcane|Crimson|Neon)/ })).toHaveLength(4)
  })

  it('tapping an identity pins it and tapping again releases it', async () => {
    renderAt('/')
    const card = await screen.findByRole('button', { name: /The Velvet Enigma/ })
    await userEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'false')
  })

  it.each([
    ['/discover', 'Discover Your Dark Side'],
    ['/quiz', 'The HAUNTED quiz'],
    ['/atelier', 'The Costume Atelier'],
    ['/grimoire', 'Your Grimoire'],
    ['/about', 'About HAUNTED'],
  ])('%s renders', async (path, heading) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('unknown addresses show the lost-in-the-mist page with a way home', async () => {
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: 'You are lost in the mist' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/')
  })

  it('Discover explains the quiz and Start opens it', async () => {
    renderAt('/discover')
    await userEvent.click(await screen.findByRole('link', { name: 'Start the quiz' }))
    expect(await screen.findByRole('heading', { name: 'The HAUNTED quiz' })).toBeInTheDocument()
  })
})

describe('mobile menu (R1.2)', () => {
  it('opens with the keyboard, closes with Escape and returns focus to the button', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const button = await screen.findByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    button.focus()
    await user.keyboard('{Enter}')
    const menu = screen.getByRole('navigation', { name: 'Mobile' })
    expect(menu).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(within(menu).getByRole('link', { name: 'Home' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('choosing a link closes the menu', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(await screen.findByRole('button', { name: 'Open menu' }))
    await user.click(within(screen.getByRole('navigation', { name: 'Mobile' })).getByRole('link', { name: 'Atelier' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'The Costume Atelier' })).toBeInTheDocument()
  })
})
