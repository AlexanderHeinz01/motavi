import type { ReactNode } from 'react'
import { dashboardText } from '../content/komponenten'

/**
 * Dashboard preview (DESIGN_BRIEF §4): dark frame around UI built from real
 * components with invented demo data, never a screenshot. .surface-inverse
 * switches the data colours to their bright dashboard values.
 */
export default function DashboardVorschau({ children }: { children: ReactNode }) {
  return (
    <div className="surface-inverse overflow-hidden rounded-card border border-white/10 bg-page-inverse text-ink-inverse">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/25" />
          ))}
        </span>
        <span className="t-label text-white/80">{dashboardText.titel}</span>
        <span className="t-label ml-auto text-white/70">{dashboardText.demo}</span>
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </div>
  )
}
