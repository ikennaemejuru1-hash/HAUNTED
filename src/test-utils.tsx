import { render } from '@testing-library/react'
import { Suspense, type ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'

// Renders the whole app at a chosen address, without needing a real browser.
export function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </MemoryRouter>,
  )
}

export function renderInRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}
