import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { CAVES } from '../content/caves'
import { usePageTransition } from '../context/PageTransitionContext'
import { MiniPlayer } from './MiniPlayer'

export function Playfield() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { navigateWithFade } = usePageTransition()

  return (
    <div
      ref={fieldRef}
      className="mini-player-field"
      tabIndex={0}
      role="application"
      aria-label="Área de juego: flechas para moverte. Los árboles bloquean. Quedate medio segundo sobre una cueva para entrar."
    >
      <div className="playfield-caves" aria-hidden="true">
        {CAVES.map((cave) => (
          <div
            key={cave.slug}
            className={`cave-slot cave-slot--${cave.row}`}
            style={{ left: `${cave.xPct * 100}%` }}
          >
            {cave.row === 'bottom' ? (
              <>
                {cave.label ? <span className="cave-label">{cave.label}</span> : null}
                <img className="cave-img cave-img--bottom" src="/cave-mound.png" alt="" />
              </>
            ) : (
              <>
                <img className="cave-img cave-img--entrance" src="/cave-top.png" alt="" />
                {cave.label ? <span className="cave-label cave-label--top">{cave.label}</span> : null}
              </>
            )}
          </div>
        ))}
      </div>
      <MiniPlayer
        key={location.key}
        fieldRef={fieldRef}
        onEnterCave={(slug) => {
          navigateWithFade(`/seccion/${encodeURIComponent(slug)}`)
        }}
      />
    </div>
  )
}
