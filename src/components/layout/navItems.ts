// One list feeds both the desktop bar and the mobile menu, so they never disagree.
export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/atelier', label: 'Atelier' },
  { to: '/grimoire', label: 'Grimoire' },
  { to: '/about', label: 'About' },
] as const
