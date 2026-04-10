import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

/** Fundido a negro antes de cambiar de ruta (ms). */
export const PAGE_FADE_TO_BLACK_MS = 700

/** Fundido desde negro al mostrar la nueva pantalla (ms). */
export const PAGE_FADE_FROM_BLACK_MS = 700

type PageTransitionContextValue = {
  navigateWithFade: (to: string) => void
  isTransitioning: boolean
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [blocking, setBlocking] = useState(false)
  const busyRef = useRef(false)

  const navigateWithFade = useCallback(
    (to: string) => {
      if (busyRef.current) return
      busyRef.current = true
      setBlocking(true)
      setOverlayVisible(true)

      window.setTimeout(() => {
        navigate(to)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOverlayVisible(false)
            window.setTimeout(() => {
              busyRef.current = false
              setBlocking(false)
            }, PAGE_FADE_FROM_BLACK_MS)
          })
        })
      }, PAGE_FADE_TO_BLACK_MS)
    },
    [navigate],
  )

  const value: PageTransitionContextValue = {
    navigateWithFade,
    isTransitioning: blocking,
  }

  return (
    <PageTransitionContext.Provider value={value}>
      <div
        className={`page-transition-overlay${overlayVisible ? ' page-transition-overlay--visible' : ''}${blocking ? ' page-transition-overlay--blocking' : ''}`}
        aria-hidden="true"
      />
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) {
    throw new Error('usePageTransition debe usarse dentro de PageTransitionProvider')
  }
  return ctx
}
