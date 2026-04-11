import { PROFILE } from './content/bio'
import { usePageTransition } from './context/PageTransitionContext'
import { Playfield } from './components/Playfield'
import { Typewriter } from './components/Typewriter'

export function App() {
  const { navigateWithFade } = usePageTransition()

  return (
    <div className="app">
      <div className="scanlines" aria-hidden="true" />

      <main className="main-grid">
        <section className="column column-left">
          <div className="dialog-stack">
            <div className="speech-float-group float-y">
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
                <div className="speech-bubble">
                  <p className="speech-text">
                    <Typewriter text={PROFILE.welcomeLine} msPerChar={32} />
                  </p>
                </div>
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
              <p className="profile-about">{PROFILE.sobreMi}</p>
              <div className="profile-contact-wrap">
                <button
                  type="button"
                  className="profile-contact-btn"
                  onClick={() => navigateWithFade('/seccion/contactame')}
                >
                  Contáctame
                </button>
              </div>
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
              Usá las flechas del teclado o los botones debajo del mapa, en el centro, para moverte y descubrir mi
              portfolio.
            </p>
            <Playfield />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Abril del {new Date().getFullYear()} · Paulina Palmeyro Beltramo
        </p>
      </footer>
    </div>
  )
}
