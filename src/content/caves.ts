/**
 * Cuevas del playfield: 3 arriba / 3 abajo.
 * `xPct` = centro horizontal (0–1). Zonas de entrada en fracciones del área de juego.
 */
export type CaveRow = 'top' | 'bottom'

export type CaveDef = {
  slug: string
  label: string
  row: CaveRow
  xPct: number
  zone: { cx: number; cy: number; rw: number; rh: number }
}

/** Tiempo que el personaje debe permanecer en la zona de la cueva para entrar (ms). */
export const CAVE_DWELL_MS = 500

export const CAVES: readonly CaveDef[] = [
  {
    slug: 'datos-personales',
    label: 'Datos pers.',
    row: 'top',
    xPct: 0.265,
    zone: { cx: 0.265, cy: 0.11, rw: 0.1, rh: 0.1 },
  },
  {
    slug: 'perfil-profesional',
    label: 'Perfil prof.',
    row: 'top',
    xPct: 0.5,
    zone: { cx: 0.5, cy: 0.11, rw: 0.1, rh: 0.1 },
  },
  {
    slug: 'video-presentacion',
    label: 'Video',
    row: 'top',
    xPct: 0.735,
    zone: { cx: 0.735, cy: 0.11, rw: 0.1, rh: 0.1 },
  },
  {
    slug: 'tecnologias-herramientas',
    label: 'Tecnologías',
    row: 'bottom',
    xPct: 0.265,
    zone: { cx: 0.265, cy: 0.9, rw: 0.14, rh: 0.13 },
  },
  {
    slug: 'proyectos',
    label: 'Proyectos',
    row: 'bottom',
    xPct: 0.5,
    zone: { cx: 0.5, cy: 0.9, rw: 0.14, rh: 0.13 },
  },
  {
    slug: 'cv',
    label: 'CV',
    row: 'bottom',
    xPct: 0.735,
    zone: { cx: 0.735, cy: 0.9, rw: 0.14, rh: 0.13 },
  },
] as const

export function findCaveAtSprite(
  px: number,
  py: number,
  spriteSize: number,
  fw: number,
  fh: number,
): string | null {
  for (const c of CAVES) {
    const zw = c.zone.rw * fw
    const zh = c.zone.rh * fh
    const zx = c.zone.cx * fw - zw / 2
    const zy = c.zone.cy * fh - zh / 2
    if (
      px < zx + zw &&
      px + spriteSize > zx &&
      py < zy + zh &&
      py + spriteSize > zy
    ) {
      return c.slug
    }
  }
  return null
}
