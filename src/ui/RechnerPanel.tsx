import type { ReactNode } from 'react'
import { rechnerText } from '../content/komponenten'
import type { Accent } from '../content/types'
import KategorieLabel from './KategorieLabel'

export interface RechnerErgebnis {
  label: string
  value: string
  unit?: string
  accent?: Accent
}

/**
 * Calculator panel (DESIGN_BRIEF §4): inputs left, result right. On mobile
 * the result sticks to the bottom of the screen as a bar while the inputs scroll.
 */
export default function RechnerPanel({
  eingaben,
  ergebnisse,
  titel = rechnerText.ergebnis,
  hinweis = rechnerText.pflichthinweis,
  klebend = true,
}: {
  eingaben: ReactNode
  ergebnisse: RechnerErgebnis[]
  titel?: string
  hinweis?: string
  /** Mobile: result sticks to the bottom; off for fixed example values */
  klebend?: boolean
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start">
      <div className="space-y-5">{eingaben}</div>
      <aside
        aria-live="polite"
        className={`${klebend ? 'max-lg:sticky max-lg:bottom-0 max-lg:z-10' : ''} max-lg:-mx-6 max-lg:border-t max-lg:border-line max-lg:bg-page max-lg:px-6 max-lg:py-3 lg:rounded-card lg:border lg:border-line lg:bg-page-subtle lg:p-6`}
      >
        <p className="t-label text-ink-muted max-lg:hidden">{titel}</p>
        <dl className="grid grid-cols-3 gap-3 lg:mt-4 lg:grid-cols-1 lg:gap-5">
          {ergebnisse.map((e) => (
            <div key={e.label}>
              <dt className="max-lg:hidden">
                <KategorieLabel accent={e.accent ?? 'data-ink'}>{e.label}</KategorieLabel>
              </dt>
              <dt className="font-body text-[12px] leading-tight text-ink-muted lg:hidden">{e.label}</dt>
              <dd className="font-mono font-medium text-ink max-lg:text-[18px] lg:mt-1 lg:text-[40px] lg:leading-none">
                <span className="whitespace-nowrap">{e.value}</span>
                {e.unit && <span className="block font-body text-[13px] font-normal text-ink-muted lg:ml-1 lg:inline lg:text-[15px]">{e.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-body text-[13px] text-ink-muted max-lg:hidden">{hinweis}</p>
      </aside>
      <p className="font-body text-[13px] text-ink-muted lg:hidden">{hinweis}</p>
    </div>
  )
}
