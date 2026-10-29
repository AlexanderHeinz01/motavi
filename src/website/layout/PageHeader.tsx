import type { Accent } from '../../content/types'
import { placeholderText } from '../../content/site'
import KategorieLabel from '../../ui/KategorieLabel'

/** Shared page head: category label, H1, introduction (max. 8 of 12 columns). */
export default function PageHeader({
  label,
  accent,
  title,
  intro,
  pilot = false,
}: {
  label: string
  accent: Accent
  title: string
  intro: string
  pilot?: boolean
}) {
  return (
    <div className="max-w-[800px]">
      <div className="flex flex-wrap items-center gap-3">
        <KategorieLabel accent={accent}>{label}</KategorieLabel>
        {pilot && (
          <span className="t-label rounded-full border border-line px-2.5 py-0.5 text-ink-muted">
            {placeholderText.pilotLabel}
          </span>
        )}
      </div>
      <h1 className="t-h1 mt-4 text-ink">{title}</h1>
      <p className="t-body-lg mt-5 text-ink-muted">{intro}</p>
    </div>
  )
}
