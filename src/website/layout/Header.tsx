import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { mainNav, navCta, navText } from '../../content/site'
import ButtonLink from '../../ui/ButtonLink'

const MENU_ID = 'mobile-menu'

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

/** Site header: wordmark, main navigation, CTA "Pilot anfragen" (always visible). */
export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname])

  // Mobile menu: Escape closes it, the page behind does not scroll
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const previousOverflow = document.body.style.overflow
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          aria-label={navText.homeLabel}
          className="font-headline text-[22px] font-semibold tracking-tight text-ink"
        >
          motavi
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `font-body text-[15px] transition-colors duration-150 ease-out hover:text-ink ${
                      isActive ? 'text-ink underline decoration-primary decoration-2 underline-offset-8' : 'text-ink-muted'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ButtonLink to={navCta.to} className="!px-4 text-[14px] sm:!px-5 sm:text-[15px]">
            {navCta.label}
          </ButtonLink>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-btn text-ink lg:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? navText.closeMenu : navText.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div id={MENU_ID} className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-page lg:hidden">
          <nav aria-label="Hauptnavigation" className="site-container py-6">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.to} className="border-b border-line">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `t-h3 flex min-h-[56px] items-center ${isActive ? 'text-primary' : 'text-ink'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
