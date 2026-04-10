import { useCallback } from 'react'
import { ContactameIcon } from '../components/ContactameIcon'
import { CONTACTAME_LINKS } from '../content/contactame'
import { usePageTransition } from '../context/PageTransitionContext'

function iconVariant(id: string): 'linkedin' | 'instagram' | 'github' | 'email' {
  if (id === 'linkedin') return 'linkedin'
  if (id === 'instagram') return 'instagram'
  if (id === 'github') return 'github'
  return 'email'
}

export function ContactameSection() {
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

      <div className="section-perfil-inner section-perfil-inner--contactame">
        <header className="section-perfil-header">
          <h1 className="section-perfil-title">Contáctame</h1>
        </header>

        <article className="section-perfil-article section-perfil-article--contactame retro-panel">
          <p className="section-perfil-p section-perfil-p--contactame-lead">
            Elegí un canal: los enlaces web se abren en una pestaña nueva.
          </p>
          <div className="contactame-grid" role="list">
            {CONTACTAME_LINKS.map((link, index) => {
              const external = link.href.startsWith('http')
              return (
                <a
                  key={link.id}
                  className="contactame-card float-y"
                  style={{ animationDelay: `${index * 0.12}s` }}
                  href={link.href}
                  {...(external
                    ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
                    : {})}
                  role="listitem"
                >
                  <span className="contactame-icon-ring">
                    <ContactameIcon variant={iconVariant(link.id)} />
                  </span>
                  <span className="contactame-card-label">{link.label}</span>
                </a>
              )
            })}
          </div>
        </article>
      </div>
    </div>
  )
}
