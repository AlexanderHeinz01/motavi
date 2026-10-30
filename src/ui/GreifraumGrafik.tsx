import { greifraumText, steckbriefText } from '../content/komponenten'
import type { Steckbrief } from '../content/demo/steckbriefe'
import { prozent } from '../lib/format'

type Zone = keyof Steckbrief['hoehenzonen']

/** Height bands in the 360 x 260 drawing (top to bottom). */
const BAENDER: { zone: Zone; y1: number; y2: number }[] = [
  { zone: 'ueber_schulter', y1: 20, y2: 78 },
  { zone: 'huefte_schulter', y1: 78, y2: 140 },
  { zone: 'knie_huefte', y1: 140, y2: 196 },
  { zone: 'unter_knie', y1: 196, y2: 248 },
]

/** Deterministic pseudo random numbers, so server and browser render the same dots. */
function zufall(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/**
 * Reach and working heights (DESIGN_BRIEF §4): side view with height zones
 * and the density of hand positions in --data-ink. Relative values (2D).
 */
export default function GreifraumGrafik({
  hoehenzonen,
  ausserhalb,
  punkte = 90,
}: {
  hoehenzonen: Steckbrief['hoehenzonen']
  ausserhalb: number
  punkte?: number
}) {
  const r = zufall(7)
  const dots = BAENDER.flatMap(({ zone, y1, y2 }) =>
    Array.from({ length: Math.round(hoehenzonen[zone] * punkte) }, () => ({
      x: 128 + r() * 150,
      y: y1 + 4 + r() * (y2 - y1 - 8),
    })),
  )
  return (
    <figure>
      <svg viewBox="0 0 360 260" className="h-auto w-full" role="img" aria-label={greifraumText.grafikLabel}>
        {/* favourable reach: hip to shoulder, close to the body */}
        <rect
          x="104"
          y="78"
          width="132"
          height="62"
          style={{ fill: 'color-mix(in srgb, var(--data-ink) 8%, transparent)' }}
          stroke="var(--data-ink)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text x="108" y="74" fill="var(--text)" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          {greifraumText.guenstig}
        </text>
        {/* zone borders */}
        <g stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="2 4">
          {[78, 140, 196].map((y) => (
            <line key={y} x1="20" y1={y} x2="340" y2={y} />
          ))}
        </g>
        <line x1="20" y1="248" x2="340" y2="248" stroke="var(--text-muted)" strokeWidth="1.5" />
        {/* side silhouette */}
        <g fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="86" cy="40" r="12" />
          <path d="M86 52V60M86 60L84 140M84 140L90 196L86 248M86 66L98 104L116 124" />
        </g>
        {/* hand positions */}
        <g fill="var(--data-ink)">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r="2.2" opacity="0.75" />
          ))}
        </g>
        {/* zone labels */}
        {BAENDER.map(({ zone, y1, y2 }) => (
          <text key={zone} x="340" y={(y1 + y2) / 2 + 4} textAnchor="end" fill="var(--text)" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {prozent(hoehenzonen[zone])}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 space-y-1 font-body text-[14px]">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-ink-muted">
          {BAENDER.map(({ zone }) => (
            <li key={zone} className="flex justify-between gap-2">
              <span>{greifraumText.zonen[zone]}</span>
              <span className="font-mono text-ink">{prozent(hoehenzonen[zone])}</span>
            </li>
          ))}
        </ul>
        <p className="text-ink">
          {steckbriefText.ausserhalb}: <span className="font-mono font-medium">{prozent(ausserhalb)}</span>
        </p>
        <p className="text-[13px] text-ink-muted">{greifraumText.hinweis}</p>
      </figcaption>
    </figure>
  )
}
