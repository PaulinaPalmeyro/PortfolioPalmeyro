import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MiniGameDpadBar } from '../components/MiniGameDpadBar'
import { MiniPlayer, type MiniPlayerHandle } from '../components/MiniPlayer'
import { VIDEO_PRESENTACION_INTRO, VIDEO_PRESENTACION_SRC } from '../content/videoPresentacion'
import { usePageTransition } from '../context/PageTransitionContext'

const VIDEO_EXIT_ZONE = { cx: 0.5, cy: 0.1, rw: 0.12, rh: 0.095 } as const

export function VideoPresentacionSection() {
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

      <div className="section-perfil-inner section-perfil-inner--video">
        <header className="section-perfil-header">
          <h1 className="section-perfil-title">Video de presentación</h1>
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
              exitZone={VIDEO_EXIT_ZONE}
              onExit={goHome}
            />
          </div>
          <MiniGameDpadBar playerRef={playerRef} />
        </div>

        <article className="section-perfil-article section-perfil-article--centered retro-panel section-video-article">
          <p className="section-perfil-p">{VIDEO_PRESENTACION_INTRO}</p>
          <div className="section-video-frame">
            <video
              className="section-video-player"
              controls
              playsInline
              preload="metadata"
              aria-label="Video de presentación personal"
            >
              <source src={VIDEO_PRESENTACION_SRC} type="video/mp4" />
              <p className="section-video-fallback">
                Tu navegador no puede reproducir este formato. Podés{' '}
                <a href={VIDEO_PRESENTACION_SRC} download>
                  descargar el video
                </a>
                .
              </p>
            </video>
          </div>
        </article>
      </div>
    </div>
  )
}
