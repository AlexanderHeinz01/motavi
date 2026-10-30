import { ArrowDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { empfehlungen, type Path } from '../content/empfehlungen'
import { entscheidungswegText } from '../content/komponenten'
import EmpfehlungsLabel, { PathIcon, TOKEN, type Single } from './EmpfehlungsLabel'
import Icon from './Icon'

const WEGE: Single[] = ['improve', 'automate', 'keep']

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
 * Decision path, large (DESIGN_BRIEF §2 and §4): one measurement branches
 * into three outputs of equal size and weight; stacked on mobile.
 */
export default function Entscheidungsweg({ messung, wege }: { messung: ReactNode; wege: { path: Path; text: string }[] }) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,4fr)_auto_minmax(0,7fr)] lg:gap-0">
      <div className="flex flex-col justify-center rounded-card border border-line bg-page p-6">{messung}</div>

      <Weiche />
      <div className="flex justify-center text-ink-muted lg:hidden">
        <Icon icon={ArrowDown} size={24} />
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

/**
 * Decision path, compact (head of the Steckbrief): the applicable path is
 * active, the others are muted. "Erst verbessern, dann automatisieren"
 * activates both, numbered in order.
 */
export function EntscheidungswegKompakt({ aktiv }: { aktiv?: Path }) {
  // without an active path all three are shown equally (perspective pages)
  if (!aktiv) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="t-label inline-flex items-center gap-2 text-ink">
          <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
          {entscheidungswegText.messung}
        </span>
        <span className="h-px w-5 bg-ink-muted" aria-hidden="true" />
        <ul className="flex flex-wrap items-center gap-2" aria-label={entscheidungswegText.liste}>
          {WEGE.map((p) => (
            <li key={p} className="text-ink">
              <EmpfehlungsLabel path={p} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
  const aktive: Single[] = aktiv === 'improve-then-automate' ? ['improve', 'automate'] : [aktiv]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="t-label inline-flex items-center gap-2 text-ink">
        <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
        {entscheidungswegText.messung}
      </span>
      <span className="h-px w-5 bg-ink-muted" aria-hidden="true" />
      <ul className="flex flex-wrap items-center gap-2" aria-label={entscheidungswegText.liste}>
        {WEGE.map((p) => {
          const index = aktive.indexOf(p)
          if (index === -1) {
            return (
              <li
                key={p}
                className="inline-flex items-center gap-1.5 rounded-btn border border-dashed border-line px-3 py-1.5 font-body text-[14px] text-ink-muted"
              >
                <span className="inline-flex opacity-60" style={{ color: `var(${TOKEN[p]})` }}>
                  <PathIcon path={p} />
                </span>
                {empfehlungen[p]}
                <span className="sr-only">({entscheidungswegText.nichtZutreffend})</span>
              </li>
            )
          }
          return (
            <li key={p} className="inline-flex items-center gap-1.5 text-ink">
              {aktive.length > 1 && <span className="font-mono text-[13px] font-medium">{index + 1}.</span>}
              <EmpfehlungsLabel path={p} />
              <span className="sr-only">({entscheidungswegText.zutreffend})</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
