import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_MENU_ITEMS } from '../content/navMenu'
import { usePageTransition } from '../context/PageTransitionContext'

export function PortfolioMenu() {
  const location = useLocation()
  const { navigateWithFade } = usePageTransition()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const menuAnchorRef = useRef<HTMLDivElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuPanelId = useId()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [])

  const isActivePath = useCallback(
    (path: string) => {
      if (path === '/') {
        return location.pathname === '/'
      }
      return location.pathname === path
    },
    [location.pathname],
  )

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  useLayoutEffect(() => {
    if (!menuOpen) return

    const placeMenu = () => {
      const anchor = menuAnchorRef.current
      const panel = menuPanelRef.current
      if (!anchor) return

      const margin = 12
      const r = anchor.getBoundingClientRect()
      const rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 18
      const maxW = Math.min(rootFs * 20, window.innerWidth - 2 * margin)
      const w =
        panel && panel.offsetWidth > 0
          ? Math.min(panel.offsetWidth, window.innerWidth - 2 * margin)
          : maxW

      let left = r.right - w
      left = Math.max(margin, Math.min(left, window.innerWidth - w - margin))

      setMenuPos({ top: r.bottom + 8, left })
    }

    placeMenu()
    const raf = requestAnimationFrame(placeMenu)

    window.addEventListener('resize', placeMenu)
    window.addEventListener('scroll', placeMenu, true)

    const ro = new ResizeObserver(placeMenu)
    if (menuPanelRef.current) ro.observe(menuPanelRef.current)
    if (menuAnchorRef.current) ro.observe(menuAnchorRef.current)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', placeMenu)
      window.removeEventListener('scroll', placeMenu, true)
      ro.disconnect()
    }
  }, [menuOpen])

  return (
    <>
      {menuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      ) : null}

      <div className="portfolio-menu-anchor" ref={menuAnchorRef}>
        <button
          type="button"
          className="pixel-icon-btn"
          aria-label={menuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
          aria-expanded={menuOpen}
          aria-controls={menuPanelId}
          onClick={toggleMenu}
        >
          <span className="pixel-glyph pixel-glyph-menu" />
        </button>

        <div
          ref={menuPanelRef}
          id={menuPanelId}
          className={`retro-menu-dropdown${menuOpen ? ' retro-menu-dropdown--open' : ''}`}
          aria-hidden={!menuOpen}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <nav
            className="panel-tabs panel-tabs--menu"
            aria-label="Secciones del portfolio"
            inert={!menuOpen ? true : undefined}
          >
            {NAV_MENU_ITEMS.map((item) => {
              const active = isActivePath(item.path)
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`tab tab--nav tab--menu${active ? ' tab--menu-current' : ''}`}
                  disabled={active}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    if (!active) {
                      navigateWithFade(item.path)
                      closeMenu()
                    }
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
