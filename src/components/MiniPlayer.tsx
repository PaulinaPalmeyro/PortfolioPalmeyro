import type { RefObject } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { CAVE_DWELL_MS, findCaveAtSprite } from '../content/caves'

export const MINI_PLAYER_STEP = 12
const STEP = MINI_PLAYER_STEP
export const MINI_PLAYER_SIZE = 28
const SIZE = MINI_PLAYER_SIZE

/** Qué tan hacia el centro llega cada masa de árboles (menor = zona sólida más chica, pasillo más ancho). */
const TREE_INSET_X = 0.22

/** Franja superior e inferior sin colisión (fracción de la altura; más alto = más caminable arriba/abajo). */
const TREE_MARGIN_Y = 0.16

const EXIT_SLUG = '__EXIT__'

export type ExitZoneDef = { cx: number; cy: number; rw: number; rh: number }

type Offset = { ox: number; oy: number }

type Props = {
  fieldRef: RefObject<HTMLDivElement | null>
  onEnterCave?: (slug: string) => void
  className?: string
  /** `forest`: colisión con árboles del mapa principal. `open`: área libre. */
  arena?: 'forest' | 'open'
  /**
   * Punto de aparición en coords de esquina superior izquierda del sprite (como antes).
   * `'center'` = centro geométrico del campo (no la cueva).
   */
  spawn?: 'center' | ((fw: number, fh: number) => { x: number; y: number })
  /** Zona de la cueva de salida (mismas fracciones que en el mapa). Requiere `onExit`. */
  exitZone?: ExitZoneDef
  onExit?: () => void
}

export type MiniPlayerHandle = {
  move: (dx: number, dy: number) => void
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

function centerTopLeft(fw: number, fh: number) {
  const x = Math.round(fw / 2 - SIZE / 2)
  const y = Math.round(fh / 2 - SIZE / 2)
  return clampToField(x, y, fw, fh)
}

/** Origen del sistema de offset: esquina sup.-izq. del sprite si estuviera exactamente centrado. */
function centerOrigin(fw: number, fh: number) {
  return { cx: fw / 2 - SIZE / 2, cy: fh / 2 - SIZE / 2 }
}

function offsetToTopLeft(ox: number, oy: number, fw: number, fh: number) {
  const { cx, cy } = centerOrigin(fw, fh)
  return { x: cx + ox, y: cy + oy }
}

function clampOffset(ox: number, oy: number, fw: number, fh: number): Offset {
  const maxX = Math.max(0, fw / 2 - SIZE / 2)
  const maxY = Math.max(0, fh / 2 - SIZE / 2)
  return {
    ox: Math.min(Math.max(ox, -maxX), maxX),
    oy: Math.min(Math.max(oy, -maxY), maxY),
  }
}

function topLeftToOffset(px: number, py: number, fw: number, fh: number): Offset {
  const { cx, cy } = centerOrigin(fw, fh)
  return clampOffset(px - cx, py - cy, fw, fh)
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

function readPlayAreaSize(
  surface: HTMLDivElement | null,
  field: HTMLDivElement | null,
): { fw: number; fh: number } | null {
  const tryEl = (el: HTMLDivElement | null) => {
    if (!el) return null
    const fw = el.clientWidth
    const fh = el.clientHeight
    if (fw >= SIZE && fh >= SIZE) return { fw, fh }
    return null
  }
  return tryEl(surface) ?? tryEl(field)
}

export const MiniPlayer = forwardRef<MiniPlayerHandle, Props>(function MiniPlayer(
  { fieldRef, onEnterCave, className, arena = 'forest', spawn = 'center', exitZone, onExit },
  ref,
) {
  /** Desde el centro del campo: (0,0) = siempre en el medio visual (CSS 50% + translate). */
  const [pos, setPos] = useState<Offset>({ ox: 0, oy: 0 })
  const posRef = useRef(pos)
  posRef.current = pos

  const measureSurfaceRef = useRef<HTMLDivElement>(null)
  const userMovedRef = useRef(false)
  const measureRafRef = useRef(0)
  const measureAttemptsRef = useRef(0)
  const dwellRef = useRef<{ slug: string; since: number } | null>(null)
  const caveFiringRef = useRef(false)

  const firstSpawnTopLeft = useCallback(
    (fw: number, fh: number) => {
      if (spawn === 'center') return centerTopLeft(fw, fh)
      const p = spawn(fw, fh)
      return clampToField(p.x, p.y, fw, fh)
    },
    [spawn],
  )

  const applySpawn = useCallback(
    (fw: number, fh: number) => {
      let tl = firstSpawnTopLeft(fw, fh)
      let o = topLeftToOffset(tl.x, tl.y, fw, fh)
      tl = offsetToTopLeft(o.ox, o.oy, fw, fh)
      if (arena === 'forest' && spriteHitsTrees(tl.x, tl.y, fw, fh)) {
        const c = centerTopLeft(fw, fh)
        o = topLeftToOffset(c.x, c.y, fw, fh)
      }
      posRef.current = o
      flushSync(() => {
        setPos(o)
      })
    },
    [arena, firstSpawnTopLeft],
  )

  const syncPositionToField = useCallback(() => {
    const dims = readPlayAreaSize(measureSurfaceRef.current, fieldRef.current)
    if (!dims) {
      if (measureAttemptsRef.current > 120) return
      measureAttemptsRef.current += 1
      measureRafRef.current = requestAnimationFrame(() => {
        measureRafRef.current = 0
        syncPositionToField()
      })
      return
    }
    measureAttemptsRef.current = 0
    const { fw, fh } = dims

    if (!userMovedRef.current) {
      applySpawn(fw, fh)
      return
    }

    const { ox, oy } = posRef.current
    let o = clampOffset(ox, oy, fw, fh)
    let tl = offsetToTopLeft(o.ox, o.oy, fw, fh)
    if (arena === 'forest' && spriteHitsTrees(tl.x, tl.y, fw, fh)) {
      const c = centerTopLeft(fw, fh)
      o = topLeftToOffset(c.x, c.y, fw, fh)
    }
    if (o.ox !== ox || o.oy !== oy) {
      posRef.current = o
      setPos(o)
    }
  }, [applySpawn, arena, fieldRef])

  useLayoutEffect(() => {
    const surface = measureSurfaceRef.current
    const field = fieldRef.current
    if (!surface || !field) return

    measureAttemptsRef.current = 0
    const ro = new ResizeObserver(() => syncPositionToField())
    ro.observe(surface)

    syncPositionToField()
    let rafInner = 0
    const rafOuter = requestAnimationFrame(() => {
      syncPositionToField()
      rafInner = requestAnimationFrame(() => syncPositionToField())
    })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafOuter)
      if (rafInner) cancelAnimationFrame(rafInner)
      if (measureRafRef.current) cancelAnimationFrame(measureRafRef.current)
    }
  }, [fieldRef, syncPositionToField])

  const move = useCallback(
    (dx: number, dy: number) => {
      userMovedRef.current = true
      const dims = readPlayAreaSize(measureSurfaceRef.current, fieldRef.current)
      if (!dims) return
      const { fw, fh } = dims

      setPos((p) => {
        let ox = p.ox + dx
        let oy = p.oy + dy
        ;({ ox, oy } = clampOffset(ox, oy, fw, fh))
        const tl = offsetToTopLeft(ox, oy, fw, fh)
        if (arena === 'forest' && spriteHitsTrees(tl.x, tl.y, fw, fh)) return p
        const next = { ox, oy }
        posRef.current = next
        return next
      })
    },
    [arena, fieldRef],
  )

  useImperativeHandle(ref, () => ({ move }), [move])

  useEffect(() => {
    if (!onEnterCave && !onExit) return
    let raf = 0
    const tick = () => {
      const dims = readPlayAreaSize(measureSurfaceRef.current, fieldRef.current)
      if (dims) {
        const { fw, fh } = dims
        const { ox, oy } = posRef.current
        const { x, y } = offsetToTopLeft(ox, oy, fw, fh)
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
  }, [exitZone, onEnterCave, onExit])

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
    <>
      <div ref={measureSurfaceRef} className="mini-player-measure-surface" aria-hidden />
      <div
        className={`mini-player-sprite ${className ?? ''}`}
        style={{ transform: `translate(-50%, -50%) translate(${pos.ox}px, ${pos.oy}px)` }}
        aria-hidden="true"
      >
        <MiniSpriteSvg />
      </div>
    </>
  )
})

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
