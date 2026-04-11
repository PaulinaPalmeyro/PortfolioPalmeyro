import type { RefObject } from 'react'
import { MINI_PLAYER_STEP, type MiniPlayerHandle } from './MiniPlayer'
import { RetroDpad } from './RetroDpad'

type Props = {
  playerRef: RefObject<MiniPlayerHandle | null>
}

/** D-pad debajo del mapa, alineado a la izquierda (tocar / ratón). */
export function MiniGameDpadBar({ playerRef }: Props) {
  return (
    <div className="mini-game-touch-row">
      <RetroDpad
        step={MINI_PLAYER_STEP}
        onMove={(dx, dy) => {
          playerRef.current?.move(dx, dy)
        }}
      />
    </div>
  )
}
