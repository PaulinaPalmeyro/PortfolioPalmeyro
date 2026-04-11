import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MiniGameDpadBar } from '../components/MiniGameDpadBar'
import { MiniPlayer, type MiniPlayerHandle } from '../components/MiniPlayer'
import { CV_DRIVE_URL, CV_INTRO } from '../content/cv'
import { usePageTransition } from '../context/PageTransitionContext'

const CV_EXIT_ZONE = { cx: 0.5, cy: 0.1, rw: 0.12, rh: 0.095 } as const

export function CvSection() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<MiniPlayerHandle>(null)
  const location = useLocation()
  const { navigateWithFade } = usePageTransition()
  const goHome = useCallback(() => navigateWithFade('/'), [navigateWithFade])

  return (
    <div className="section-perfil-page">
      <div className="section-perfil-bg" aria-hidden="true" />
      <div className="scanlines section-perfil-scanlines" aria-hidden="true" />

      <button
        type="button"
        className="section-perfil-arrow"
        onClick={goHome}
        aria-label="Volver al mapa principal"
      >
        <span className="section-perfil-arrow-glyph" aria-hidden="true">
          ◀
        </span>
      </button>

      <div className="section-perfil-inner">
        <header className="section-perfil-header">
          <h1 className="section-perfil-title">CV</h1>
        </header>

        <div className="mini-game-stack">
          <div
            ref={fieldRef}
            className="section-perfil-roam"
            tabIndex={0}
            role="application"
            aria-label="Zona para mover al personaje. Pará un momento en la cueva de arriba para volver al inicio."
          >
            <div className="section-perfil-cave-stack" aria-hidden="true">
              <img className="section-perfil-cave-img" src="/cave-top.png" alt="" />
              <p className="section-perfil-cave-hint">
                Entrá a la cueva para volver al mapa principal
              </p>
            </div>
            <MiniPlayer
              ref={playerRef}
              key={location.key}
              fieldRef={fieldRef}
              arena="open"
              spawn="center"
              exitZone={CV_EXIT_ZONE}
              onExit={goHome}
            />
          </div>
          <MiniGameDpadBar playerRef={playerRef} />
        </div>

        <article className="section-perfil-article section-perfil-article--centered retro-panel">
          <p className="section-perfil-p">{CV_INTRO}</p>
          <div className="section-project-links">
            <a
              className="retro-repo-btn retro-repo-btn--large"
              href={CV_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir CV en Google Drive
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
