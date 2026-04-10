import { useEffect, useState } from 'react'

type Props = {
  text: string
  msPerChar?: number
  className?: string
}

export function Typewriter({ text, msPerChar = 28, className }: Props) {
  const [len, setLen] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setLen(0)
    setDone(false)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setLen(i)
      if (i >= text.length) {
        window.clearInterval(id)
        setDone(true)
      }
    }, msPerChar)
    return () => window.clearInterval(id)
  }, [text, msPerChar])

  return (
    <span className={className}>
      {text.slice(0, len)}
      {!done && <span className="typewriter-cursor" aria-hidden="true" />}
    </span>
  )
}
