import type { RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CAVE_DWELL_MS, findCaveAtSprite } from '../content/caves'

const STEP = 12
export const MINI_PLAYER_SIZE = 28
const SIZE = MINI_PLAYER_SIZE

/** Qué tan hacia el centro llega cada masa de árboles (menor = zona sólida más chica, pasillo más ancho). */
const TREE_INSET_X = 0.22

/** Franja superior e inferior sin colisión (fracción de la altura; más alto = más caminable arriba/abajo). */
const TREE_MARGIN_Y = 0.16

const EXIT_SLUG = '__EXIT__'

export type ExitZoneDef = { cx: number; cy: number; rw: number; rh: number }

type Props = {
  fieldRef: RefObject<HTMLDivElement | null>
  onEnterCave?: (slug: string) => void
  className?: string
  /** `forest`: colisión con árboles del mapa principal. `open`: área libre. */
  arena?: 'forest' | 'open'
  /** Primera posición del sprite (esquina superior izquierda). Por defecto centro del campo. */
  spawn?: 'center' | ((fw: number, fh: number) => { x: number; y: number })
  /** Zona de la cueva de salida (mismas fracciones que en el mapa). Requiere `onExit`. */
  exitZone?: ExitZoneDef
  onExit?: () => void
}

function pointInTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const sign = (p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) =>
    (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y)
  const d1 = sign(px, py, ax, ay, bx, by)
  const d2 = sign(px, py, bx, by, cx, cy)
  const d3 = sign(px, py, cx, cy, ax, ay)
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNeg && hasPos)
}

function spriteHitsTrees(px: number, py: number, fw: number, fh: number): boolean {
  const tipL = TREE_INSET_X * fw
  const tipR = (1 - TREE_INSET_X) * fw
  const yTop = TREE_MARGIN_Y * fh
  const yBot = fh - TREE_MARGIN_Y * fh
  const midY = fh / 2

  const corners: [number, number][] = [
    [px, py],
    [px + SIZE, py],
    [px, py + SIZE],
    [px + SIZE, py + SIZE],
  ]

  for (const [x, y] of corners) {
    if (pointInTriangle(x, y, 0, yTop, 0, yBot, tipL, midY)) return true
    if (pointInTriangle(x, y, fw, yTop, fw, yBot, tipR, midY)) return true
  }
  return false
}

function clampToField(px: number, py: number, fw: number, fh: number) {
  return {
    x: Math.min(Math.max(0, px), Math.max(0, fw - SIZE)),
    y: Math.min(Math.max(0, py), Math.max(0, fh - SIZE)),
  }
}

function centerSpawn(fw: number, fh: number) {
  const x = Math.round(fw / 2 - SIZE / 2)
  const y = Math.round(fh / 2 - SIZE / 2)
  return clampToField(x, y, fw, fh)
}

function spriteInExitZone(
  px: number,
  py: number,
  spriteSize: number,
  fw: number,
  fh: number,
  zone: ExitZoneDef,
): boolean {
  const zw = zone.rw * fw
  const zh = zone.rh * fh
  const zx = zone.cx * fw - zw / 2
  const zy = zone.cy * fh - zh / 2
  return (
    px < zx + zw &&
    px + spriteSize > zx &&
    py < zy + zh &&
    py + spriteSize > zy
  )
}

function findDwellSlug(
  px: number,
  py: number,
  fw: number,
  fh: number,
  exitZone: ExitZoneDef | undefined,
): string | null {
  if (exitZone && spriteInExitZone(px, py, SIZE, fw, fh, exitZone)) return EXIT_SLUG
  return findCaveAtSprite(px, py, SIZE, fw, fh)
}

export function MiniPlayer({
  fieldRef,
  onEnterCave,
  className,
  arena = 'forest',
  spawn = 'center',
  exitZone,
  onExit,
}: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const placedRef = useRef(false)
  const posRef = useRef(pos)
  posRef.current = pos
  const measureRafRef = useRef(0)
  const measureAttemptsRef = useRef(0)
  /** Último tamaño del campo con el que sincronizamos (para detectar salto de layout tras carga). */
  const lastSyncedSizeRef = useRef({ fw: 0, fh: 0 })
  /** Un solo recentrado automático cuando el área pasa de muy chica a su tamaño real (evita quedar en 0,0). */
  const didRecenterForGrowthRef = useRef(false)
  const dwellRef = useRef<{ slug: string; since: number } | null>(null)
  const caveFiringRef = useRef(false)

  const firstSpawn = useCallback(
    (fw: number, fh: number) => {
      if (spawn === 'center') return centerSpawn(fw, fh)
      const p = spawn(fw, fh)
      return clampToField(p.x, p.y, fw, fh)
    },
    [spawn],
  )

  const syncPositionToField = useCallback(() => {
    const el = fieldRef.current
    if (!el) return
    const fw = el.clientWidth
    const fh = el.clientHeight
    if (fw < SIZE || fh < SIZE) {
      if (measureAttemptsRef.current > 120) return
      measureAttemptsRef.current += 1
      measureRafRef.current = requestAnimationFrame(() => {
        measureRafRef.current = 0
        syncPositionToField()
      })
      return
    }
    measureAttemptsRef.current = 0

    const prev = lastSyncedSizeRef.current
    const prevTooSmall = prev.fw > 0 && (prev.fw < 160 || prev.fh < 160)
    const grewSubstantially =
      prev.fw > 0 &&
      (fw > prev.fw * 1.12 ||
        fh > prev.fh * 1.12 ||
        fw > prev.fw + 72 ||
        fh > prev.fh + 56)

    if (!placedRef.current) {
      placedRef.current = true
      let c = firstSpawn(fw, fh)
      if (arena === 'forest' && spriteHitsTrees(c.x, c.y, fw, fh)) {
        c = centerSpawn(fw, fh)
      }
      posRef.current = c
      setPos(c)
      lastSyncedSizeRef.current = { fw, fh }
      return
    }

    if (!didRecenterForGrowthRef.current && prevTooSmall && grewSubstantially) {
      didRecenterForGrowthRef.current = true
      let c = firstSpawn(fw, fh)
      if (arena === 'forest' && spriteHitsTrees(c.x, c.y, fw, fh)) {
        c = centerSpawn(fw, fh)
      }
      posRef.current = c
      setPos(c)
      lastSyncedSizeRef.current = { fw, fh }
      return
    }

    const { x: px, y: py } = posRef.current
    let { x, y } = clampToField(px, py, fw, fh)
    if (arena === 'forest' && spriteHitsTrees(x, y, fw, fh)) {
      const c = centerSpawn(fw, fh)
      posRef.current = c
      setPos(c)
      lastSyncedSizeRef.current = { fw, fh }
      return
    }
    if (x !== px || y !== py) {
      const next = { x, y }
      posRef.current = next
      setPos(next)
    }
    lastSyncedSizeRef.current = { fw, fh }
  }, [arena, fieldRef, firstSpawn])

  useLayoutEffect(() => {
    const el = fieldRef.current
    if (!el) return

    const kickPlacement = () => {
      placedRef.current = false
      measureAttemptsRef.current = 0
      lastSyncedSizeRef.current = { fw: 0, fh: 0 }
      didRecenterForGrowthRef.current = false
      syncPositionToField()
    }

    kickPlacement()
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      kickPlacement()
      raf2 = requestAnimationFrame(kickPlacement)
    })

    const ro = new ResizeObserver(() => syncPositionToField())
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (measureRafRef.current) cancelAnimationFrame(measureRafRef.current)
      ro.disconnect()
    }
  }, [fieldRef, syncPositionToField])

  const move = useCallback(
    (dx: number, dy: number) => {
      const el = fieldRef.current
      if (!el) return
      const fw = el.clientWidth
      const fh = el.clientHeight
      if (fw < SIZE || fh < SIZE) return

      setPos((p) => {
        let nx = p.x + dx
        let ny = p.y + dy
        ;({ x: nx, y: ny } = clampToField(nx, ny, fw, fh))
        if (arena === 'forest' && spriteHitsTrees(nx, ny, fw, fh)) return p
        return { x: nx, y: ny }
      })
    },
    [arena, fieldRef],
  )

  useEffect(() => {
    if (!onEnterCave && !onExit) return
    let raf = 0
    const tick = () => {
      const el = fieldRef.current
      if (el) {
        const fw = el.clientWidth
        const fh = el.clientHeight
        const { x, y } = posRef.current
        const slug = findDwellSlug(x, y, fw, fh, exitZone)
        const now = performance.now()

        if (!slug) {
          dwellRef.current = null
          caveFiringRef.current = false
        } else if (!dwellRef.current || dwellRef.current.slug !== slug) {
          dwellRef.current = { slug, since: now }
          caveFiringRef.current = false
        } else if (now - dwellRef.current.since >= CAVE_DWELL_MS && !caveFiringRef.current) {
          caveFiringRef.current = true
          if (slug === EXIT_SLUG) onExit?.()
          else onEnterCave?.(slug)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [exitZone, fieldRef, onEnterCave, onExit])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        move(0, -STEP)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        move(0, STEP)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        move(-STEP, 0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        move(STEP, 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  return (
    <div
      className={`mini-player-sprite ${className ?? ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden="true"
    >
      <MiniSpriteSvg />
    </div>
  )
}

function MiniSpriteSvg() {
  return (
    <svg width="28" height="28" viewBox="0 0 8 8" className="mini-sprite-svg">
      <rect fill="#2f3322" x="2" y="0" width="4" height="1" />
      <rect fill="#2f3322" x="1" y="1" width="6" height="1" />
      <rect fill="#2f3322" x="1" y="2" width="2" height="1" />
      <rect fill="#2f3322" x="5" y="2" width="2" height="1" />
      <rect fill="#2f3322" x="2" y="3" width="1" height="1" />
      <rect fill="#2f3322" x="5" y="3" width="1" height="1" />
      <rect fill="#2f3322" x="1" y="4" width="6" height="2" />
      <rect fill="#2f3322" x="0" y="5" width="1" height="2" />
      <rect fill="#2f3322" x="7" y="5" width="1" height="2" />
      <rect fill="#2f3322" x="2" y="6" width="1" height="2" />
      <rect fill="#2f3322" x="5" y="6" width="1" height="2" />
    </svg>
  )
}
