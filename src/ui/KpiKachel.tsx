import type { Accent } from '../content/types'
import KategorieLabel from './KategorieLabel'

/** KPI tile (DESIGN_BRIEF §4): number in mono, unit, description, source below. */
export default function KpiKachel({
  label,
  accent = 'data-ink',
  value,
  unit,
  description,
  source,
}: {
  label?: string
  accent?: Accent
  value: string
  unit?: string
  description: string
  source?: string
}) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-page p-6">
      {label && <KategorieLabel accent={accent}>{label}</KategorieLabel>}
      <p className={`t-kpi text-ink ${label ? 'mt-3' : ''}`}>
        {value}
        {unit && <span className="ml-2 font-body text-[17px] font-normal text-ink-muted">{unit}</span>}
      </p>
      <p className="t-body mt-2 text-ink">{description}</p>
      {source && <p className="mt-auto pt-4 font-body text-[13px] text-ink-muted">{source}</p>}
    </div>
  )
}
