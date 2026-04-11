import { useCallback, useEffect, useRef } from 'react'

type Props = {
  /** Desplazamiento por pulsación (mismo STEP que el teclado). */
  step: number
  onMove: (dx: number, dy: number) => void
}

const REPEAT_MS = 110
const REPEAT_DELAY_MS = 350

const JOYSTICK_SRC = '/Joystick.png'

/**
 * D-pad con arte pixel (`/Joystick.png`): cuatro zonas invisibles sobre cada brazo de la cruz.
 */
export function RetroDpad({ step, onMove }: Props) {
  const repeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef<{ dx: number; dy: number } | null>(null)

  const clearTimers = useCallback(() => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current)
      repeatTimerRef.current = null
    }
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current)
      delayTimerRef.current = null
    }
    activeRef.current = null
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const startPress = useCallback(
    (dx: number, dy: number) => (e: { preventDefault(): void; pointerId: number; target: EventTarget }) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      clearTimers()
      activeRef.current = { dx, dy }
      onMove(dx, dy)
      delayTimerRef.current = setTimeout(() => {
        repeatTimerRef.current = setInterval(() => {
          const a = activeRef.current
          if (a) onMove(a.dx, a.dy)
        }, REPEAT_MS)
      }, REPEAT_DELAY_MS)
    },
    [clearTimers, onMove],
  )

  const endPress = useCallback(() => {
    clearTimers()
  }, [clearTimers])

  return (
    <div className="retro-dpad" role="group" aria-label="Controles direccionales">
      <div
        className="retro-dpad__sprite-wrap"
        onPointerLeave={endPress}
        onPointerUp={endPress}
        onPointerCancel={endPress}
      >
        <img className="retro-dpad__img" src={JOYSTICK_SRC} alt="" draggable={false} decoding="async" />
        <button
          type="button"
          className="retro-dpad__hit retro-dpad__hit--up"
          aria-label="Mover arriba"
          tabIndex={0}
          onPointerDown={startPress(0, -step)}
        />
        <button
          type="button"
          className="retro-dpad__hit retro-dpad__hit--down"
          aria-label="Mover abajo"
          tabIndex={0}
          onPointerDown={startPress(0, step)}
        />
        <button
          type="button"
          className="retro-dpad__hit retro-dpad__hit--left"
          aria-label="Mover a la izquierda"
          tabIndex={0}
          onPointerDown={startPress(-step, 0)}
        />
        <button
          type="button"
          className="retro-dpad__hit retro-dpad__hit--right"
          aria-label="Mover a la derecha"
          tabIndex={0}
          onPointerDown={startPress(step, 0)}
        />
      </div>
    </div>
  )
}
