import type { ReactNode } from 'react'
import type { Path } from '../content/empfehlungen'
import EmpfehlungsLabel from './EmpfehlungsLabel'

/** Branch lines from the measurement to three equal outputs (desktop). */
function Weiche() {
  return (
    <svg viewBox="0 0 80 300" preserveAspectRatio="none" className="hidden h-full w-20 lg:block" aria-hidden="true">
      <g fill="none" stroke="var(--text-muted)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
        <path d="M0 150H30" />
        <path d="M30 150C46 150 46 50 62 50H80" />
        <path d="M30 150H80" />
        <path d="M30 150C46 150 46 250 62 250H80" />
      </g>
      <circle cx="30" cy="150" r="3.5" fill="var(--text)" />
    </svg>
  )
}

/**
 * Decision path (DESIGN_BRIEF §2 and §4): one measurement branches into three
 * outputs of equal size and weight. Large variant for the start page; on
 * mobile the outputs stack below the measurement.
 */
export default function Entscheidungsweg({
  messung,
  wege,
}: {
  /** Content of the measurement node */
  messung: ReactNode
  wege: { path: Path; text: string }[]
}) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,4fr)_auto_minmax(0,7fr)] lg:gap-0">
      <div className="flex flex-col justify-center rounded-card border border-line bg-page p-6">{messung}</div>

      <Weiche />
      <div className="flex justify-center lg:hidden" aria-hidden="true">
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 1v25M2 20l6 6 6-6" />
        </svg>
      </div>

      <ul className="grid gap-4 lg:grid-rows-3">
        {wege.map((weg) => (
          <li key={weg.path} className="flex flex-col justify-center gap-3 rounded-card border border-line bg-page p-6">
            <span className="text-ink">
              <EmpfehlungsLabel path={weg.path} size="lg" />
            </span>
            <p className="t-body text-ink-muted">{weg.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
