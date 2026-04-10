import { useParams } from 'react-router-dom'
import { usePageTransition } from '../context/PageTransitionContext'
import { DatosPersonalesSection } from './DatosPersonalesSection'
import { PerfilProfesionalSection } from './PerfilProfesionalSection'

const SECTION_TITLES: Record<string, string> = {
  skills: 'Skills',
  proyectos: 'Proyectos',
  contacto: 'Contacto',
  'perfil-profesional': 'Perfil profesional',
  'datos-personales': 'Datos personales',
  'portfolio-top-3': 'Sección 3',
}

export function SectionView() {
  const { slug } = useParams<{ slug: string }>()
  const { navigateWithFade } = usePageTransition()
  const decoded = slug ? decodeURIComponent(slug) : ''

  if (decoded === 'perfil-profesional') {
    return <PerfilProfesionalSection />
  }

  if (decoded === 'datos-personales') {
    return <DatosPersonalesSection />
  }

  const title = SECTION_TITLES[decoded] ?? decoded.replace(/-/g, ' ')

  return (
    <div className="app section-page">
      <div className="scanlines" aria-hidden="true" />
      <main className="section-page-inner retro-panel">
        <h1 className="panel-title section-page-title">{title}</h1>
        <p className="section-page-lead">
          Acá irá el contenido de esta parte del portfolio. Volvé al mapa cuando quieras.
        </p>
        <button type="button" className="section-back-link" onClick={() => navigateWithFade('/')}>
          ← Volver al mapa
        </button>
      </main>
    </div>
  )
}
