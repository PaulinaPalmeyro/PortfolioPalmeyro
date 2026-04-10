import { useCallback, useEffect, useId, useState } from 'react'
import { PROFILE } from './content/bio'
import { Playfield } from './components/Playfield'
import { Typewriter } from './components/Typewriter'
import { usePageTransition } from './context/PageTransitionContext'

export function App() {
  const { navigateWithFade } = usePageTransition()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuPanelId = useId()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  return (
    <div className="app">
      <div className="scanlines" aria-hidden="true" />

      {menuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      ) : null}

      <main className="main-grid">
        <section className="column column-left">
          <div className="dialog-stack">
            <div className="sprite-on-bubble" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 6 6" className="tiny-face">
                <rect fill="#2f3322" x="2" y="0" width="2" height="1" />
                <rect fill="#2f3322" x="1" y="1" width="4" height="1" />
                <rect fill="#2f3322" x="1" y="2" width="1" height="1" />
                <rect fill="#2f3322" x="4" y="2" width="1" height="1" />
                <rect fill="#2f3322" x="1" y="3" width="4" height="2" />
              </svg>
            </div>
            <div className="welcome-speech-row">
              <div className="top-bar-wrap">
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
                  id={menuPanelId}
                  className={`retro-menu-dropdown${menuOpen ? ' retro-menu-dropdown--open' : ''}`}
                  aria-hidden={!menuOpen}
                >
                  <nav
                    className="panel-tabs panel-tabs--menu"
                    aria-label="Secciones del portfolio"
                    inert={!menuOpen ? true : undefined}
                  >
                    <button
                      type="button"
                      className="tab tab--nav tab--menu"
                      onClick={() => {
                        navigateWithFade('/seccion/datos-personales')
                        closeMenu()
                      }}
                    >
                      Datos personales
                    </button>
                    <button
                      type="button"
                      className="tab tab--nav tab--menu"
                      onClick={() => {
                        navigateWithFade('/seccion/perfil-profesional')
                        closeMenu()
                      }}
                    >
                      Perfil profesional
                    </button>
                    <span className="tab tab-soon tab--menu">Skills</span>
                    <span className="tab tab-soon tab--menu">Proyectos</span>
                    <span className="tab tab-soon tab--menu">Contacto</span>
                  </nav>
                </div>
              </div>
              <div className="speech-bubble float-y">
                <p className="speech-text">
                  <Typewriter text={PROFILE.welcomeLine} msPerChar={32} />
                </p>
              </div>
            </div>
          </div>

          <div className="retro-panel profile-panel">
            <div className="panel-inner">
              <div className="avatar-frame shimmer-edge">
                <div className="avatar-placeholder">
                  <span className="avatar-initials" aria-hidden="true">
                    PP
                  </span>
                  <span className="sr-only">Retrato: próximamente imagen</span>
                </div>
              </div>
              <h1 className="profile-name">{PROFILE.name}</h1>
              <p className="profile-role">{PROFILE.role}</p>
              <p className="profile-about">{PROFILE.sobreMi}</p>
            </div>
          </div>
        </section>

        <section className="column column-right">
          <div className="retro-panel info-panel">
            <h2 className="panel-title">Tutorial</h2>
            <p className="info-lead pulse-hint">
              Entrá a las cuevas de arriba o abajo para abrir cada sección del portfolio. 
            </p>
            <h3 className="panel-subtitle">Movimiento</h3>
            <p className="info-text">
              ¡Usa las flechas para moverte y descubrir mi portfolio! 
            </p>
            <Playfield />
            <div className="dpad-decor" aria-hidden="true">
              <span className="dpad" />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} · Paulina Palmeyro
        </p>
      </footer>
    </div>
  )
}
