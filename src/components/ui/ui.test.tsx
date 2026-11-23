import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderInRouter } from '../../test-utils'
import { Badge, Button, EmptyState, ErrorState, LoadingState } from '.'

describe('ui components', () => {
  it('Button renders a button that responds to clicks', async () => {
    const onClick = vi.fn()
    renderInRouter(<Button onClick={onClick}>Press</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Press' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('Button with `to` renders a link, and every button keeps the 44px minimum height', () => {
    renderInRouter(<Button to="/discover">Go</Button>)
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link).toHaveAttribute('href', '/discover')
    expect(link.className).toContain('min-h-11')
  })

  it('Badge shows its text', () => {
    renderInRouter(<Badge>Easy</Badge>)
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('EmptyState shows title, description and action', () => {
    renderInRouter(<EmptyState title="Nothing" description="Why" action={<button>Act</button>} />)
    expect(screen.getByRole('heading', { name: 'Nothing' })).toBeInTheDocument()
    expect(screen.getByText('Why')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument()
  })

  it('LoadingState is announced as a status', () => {
    renderInRouter(<LoadingState />)
    expect(screen.getByRole('status')).toHaveTextContent('Summoning')
  })

  it('ErrorState is announced as an alert and retry works', async () => {
    const retry = vi.fn()
    renderInRouter(<ErrorState message="Broke" onRetry={retry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Broke')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(retry).toHaveBeenCalledOnce()
  })
})
