import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MiniPlayer } from '../components/MiniPlayer'
import { TechLogoCard } from '../components/TechLogoCard'
import { TECNOLOGIAS_SUBSECTIONS } from '../content/tecnologias'
import { usePageTransition } from '../context/PageTransitionContext'

const TECNOLOGIAS_EXIT_ZONE = { cx: 0.5, cy: 0.1, rw: 0.12, rh: 0.095 } as const

export function TecnologiasSection() {
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

      <div className="section-perfil-inner section-perfil-inner--tecnologias">
        <header className="section-perfil-header">
          <h1 className="section-perfil-title">Tecnologías y herramientas</h1>
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
            exitZone={TECNOLOGIAS_EXIT_ZONE}
            onExit={goHome}
          />
        </div>

        <div className="section-tecnologias-scroll">
          {TECNOLOGIAS_SUBSECTIONS.map((subsection) => (
            <section key={subsection.id} className="tech-subsection retro-panel" aria-labelledby={`tech-${subsection.id}`}>
              <h2 id={`tech-${subsection.id}`} className="tech-subsection-title">
                {subsection.title}
              </h2>
              <div className="tech-logo-grid">
                {subsection.items.map((item, index) => (
                  <TechLogoCard
                    key={item.id}
                    name={item.name}
                    imageSrc={item.imageSrc}
                    alt={item.alt}
                    bobDelaySec={index * 0.14}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
