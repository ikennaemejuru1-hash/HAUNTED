import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LoadingState } from '../ui'
import { Footer } from './Footer'
import { Navigation } from './Navigation'

// The frame around every page: skip link, header, page content and footer.
export function AppShell() {
  const { pathname } = useLocation()

  // Each new page starts at the top, like a normal website.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Lets keyboard users jump past the menu. Hidden until focused. */}
      <a
        href="#main"
        onClick={(e) => {
          // HashRouter uses the URL hash for routes, so we move focus ourselves.
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
