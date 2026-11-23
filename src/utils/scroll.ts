// Scrolls to a section by id. We cannot use "#id" links because the app uses the URL
// hash for its page routes (HashRouter). Reduced-motion visitors get an instant jump.
export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  el.focus({ preventScroll: true })
}
