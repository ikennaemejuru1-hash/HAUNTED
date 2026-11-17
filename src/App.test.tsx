import { render, screen } from '@testing-library/react'
import App from './App'

// Smoke test: proves React, TypeScript and the test tools work together.
it('renders the app without crashing', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
