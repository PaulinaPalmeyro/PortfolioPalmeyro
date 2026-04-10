export type NavMenuItem = {
  path: string
  label: string
}

/** Orden del menú lateral (misma lista en toda la app). */
export const NAV_MENU_ITEMS: readonly NavMenuItem[] = [
  { path: '/', label: 'Inicio' },
  { path: '/seccion/datos-personales', label: 'Datos personales' },
  { path: '/seccion/perfil-profesional', label: 'Perfil profesional' },
  { path: '/seccion/tecnologias-herramientas', label: 'Tecnologías' },
  { path: '/seccion/proyectos', label: 'Proyectos' },
  { path: '/seccion/video-presentacion', label: 'Video' },
  { path: '/seccion/cv', label: 'CV' },
  { path: '/seccion/contactame', label: 'Contáctame' },
] as const
