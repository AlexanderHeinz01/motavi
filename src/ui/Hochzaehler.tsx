import { useEffect, useRef, useState } from 'react'

const DAUER = 1200 // ms, DESIGN_BRIEF §7: at most 1.2 s

/**
 * Number that counts up once when it first becomes visible (DESIGN_BRIEF §7).
 * Server, no JavaScript and prefers-reduced-motion: the final value at once.
 * Numbers already visible on load do not count, so nothing jumps.
 */
export default function Hochzaehler({ wert, format }: { wert: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [anzeige, setAnzeige] = useState(wert)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) return
    setAnzeige(0)
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DAUER)
        setAnzeige(wert * (1 - (1 - t) ** 3))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [wert])

  return (
    <span ref={ref}>
      <span aria-hidden="true">{format(anzeige)}</span>
      <span className="sr-only">{format(wert)}</span>
    </span>
  )
}
