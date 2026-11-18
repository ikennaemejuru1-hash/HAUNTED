import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'

interface MobileMenuProps {
  id: string
  onClose: () => void
}

// A dropdown panel for screens under 768px. Escape closes it (the parent returns focus
// to the menu button) and choosing a link closes it.
export function MobileMenu({ id, onClose }: MobileMenuProps) {
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Move focus into the panel when it opens so keyboard users land inside it.
  useEffect(() => {
    firstLink.current?.focus()
  }, [])

  return (
    <nav
      id={id}
      aria-label="Mobile"
      className="border-t border-gold/25 bg-obsidian md:hidden"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <ul className="flex flex-col p-2">
        {navItems.map((item, i) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              ref={i === 0 ? firstLink : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-sm px-4 font-tech text-sm uppercase tracking-[0.14em] ${
                  isActive ? 'bg-burgundy/60 text-gold' : 'text-silver hover:bg-charcoal hover:text-gold'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
