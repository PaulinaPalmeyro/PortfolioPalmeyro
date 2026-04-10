import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MiniPlayer } from '../components/MiniPlayer'
import { PROYECTOS_DESTACADOS } from '../content/proyectos'
import { usePageTransition } from '../context/PageTransitionContext'

const PROYECTOS_EXIT_ZONE = { cx: 0.5, cy: 0.1, rw: 0.12, rh: 0.095 } as const

export function ProyectosSection() {
  const fieldRef = useRef<HTMLDivElement>(null)
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
          <h1 className="section-perfil-title">Proyectos destacados</h1>
        </header>

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
            key={location.key}
            fieldRef={fieldRef}
            arena="open"
            spawn="center"
            exitZone={PROYECTOS_EXIT_ZONE}
            onExit={goHome}
          />
        </div>

        <div className="section-proyectos-scroll">
          {PROYECTOS_DESTACADOS.map((proyecto) => (
            <article key={proyecto.title} className="section-project-card retro-panel">
              <h2 className="section-project-title">{proyecto.title}</h2>
              {proyecto.paragraphs.map((p, i) => (
                <p key={`${proyecto.title}-${i}`} className="section-project-p">
                  {p}
                </p>
              ))}
              {proyecto.metaLines?.map((line) => (
                <p key={line} className="section-project-meta">
                  {line}
                </p>
              ))}
              {proyecto.dirigidoLabel ? (
                <p className="section-project-meta">
                  <span className="section-project-meta-label">Dirigido a: </span>
                  {proyecto.dirigidoLabel}
                </p>
              ) : null}
              {proyecto.confidentialNote ? (
                <p className="section-project-confidential">{proyecto.confidentialNote}</p>
              ) : null}
              {proyecto.links && proyecto.links.length > 0 ? (
                <div className="section-project-links">
                  {proyecto.links.map((link) => (
                    <a
                      key={link.href}
                      className="retro-repo-btn"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
