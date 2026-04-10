import { Navigate, useParams } from 'react-router-dom'
import { usePageTransition } from '../context/PageTransitionContext'
import { DatosPersonalesSection } from './DatosPersonalesSection'
import { PerfilProfesionalSection } from './PerfilProfesionalSection'
import { ProyectosSection } from './ProyectosSection'
import { TecnologiasSection } from './TecnologiasSection'
import { CvSection } from './CvSection'
import { VideoPresentacionSection } from './VideoPresentacionSection'

const SECTION_TITLES: Record<string, string> = {
  proyectos: 'Proyectos',
  cv: 'CV',
  'perfil-profesional': 'Perfil profesional',
  'datos-personales': 'Datos personales',
  'tecnologias-herramientas': 'Tecnologías y herramientas',
  'video-presentacion': 'Video de presentación',
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

  if (decoded === 'proyectos') {
    return <ProyectosSection />
  }

  if (decoded === 'tecnologias-herramientas') {
    return <TecnologiasSection />
  }

  if (decoded === 'cv') {
    return <CvSection />
  }

  if (decoded === 'video-presentacion') {
    return <VideoPresentacionSection />
  }

  if (decoded === 'portfolio-top-3') {
    return <Navigate to="/seccion/video-presentacion" replace />
  }

  if (decoded === 'contacto') {
    return <Navigate to="/seccion/cv" replace />
  }

  if (decoded === 'skills') {
    return <Navigate to="/seccion/tecnologias-herramientas" replace />
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
