import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { navItems } from './navItems'

const MENU_ID = 'mobile-menu'

export function Navigation() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  // Closing always sends focus back to the button that opened the menu.
  const close = () => {
    setOpen(false)
    toggle.current?.focus()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-obsidian/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-xl tracking-[0.2em] text-gold" aria-label="HAUNTED home">
          HAUNTED
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center border-b-2 px-3 font-tech text-sm uppercase tracking-[0.14em] ${
                      isActive
                        ? 'border-ember text-gold'
                        : 'border-transparent text-silver hover:text-gold'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggle}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-sm text-gold hover:bg-charcoal md:hidden"
          aria-expanded={open}
          aria-controls={MENU_ID}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => (open ? close() : setOpen(true))}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && <MobileMenu id={MENU_ID} onClose={close} />}
    </header>
  )
}
