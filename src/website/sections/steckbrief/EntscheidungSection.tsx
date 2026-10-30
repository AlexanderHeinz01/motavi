/**
 * Decision rule as a 2 x 2 matrix: improvement score against automation
 * score (DESIGN_BRIEF §5). Thresholds and the decision table come from the
 * shared configuration; all four cells have the same size and weight.
 */
import type { Path } from '../../../content/empfehlungen'
import { steckbrief } from '../../../content/steckbrief'
import { zahl } from '../../../lib/format'
import { config } from '../../../lib/scoring'
import EmpfehlungsLabel from '../../../ui/EmpfehlungsLabel'
import KategorieLabel from '../../../ui/KategorieLabel'
import { PilotMarke } from './AufbauSection'

const t = steckbrief.entscheidung
const e = config.empfehlung

function pfad(v: 'hoch' | 'niedrig', a: 'hoch' | 'niedrig'): Path {
  const r = e.regeln.find((x) => x.verbesserung === v && x.automatisierung === a)
  if (!r) throw new Error(`Keine Regel für ${v}/${a}`)
  return r.empfehlung
}

function Zelle({ v, a }: { v: 'hoch' | 'niedrig'; a: 'hoch' | 'niedrig' }) {
  const p = pfad(v, a)
  const bedingung = `${t.achseVerbesserung} ${v === 'hoch' ? t.ab(e.schwelle_verbesserung) : t.unter(e.schwelle_verbesserung)}, ${t.achseAutomatisierung} ${a === 'hoch' ? t.ab(e.schwelle_automatisierung) : t.unter(e.schwelle_automatisierung)}`
  return (
    <div role="cell" className="flex flex-col gap-3 rounded-card border border-line bg-page p-5">
      <span className="text-ink">
        <EmpfehlungsLabel path={p} size="lg" />
      </span>
      <p className="font-mono text-[12px] text-ink-muted">{bedingung}</p>
      <p className="t-body text-ink">{e.erklaerung[p]}</p>
      <p className="t-body text-ink-muted">{t.typisch[p]}</p>
    </div>
  )
}

export default function EntscheidungSection() {
  return (
    <section id={t.id} className="scroll-mt-20 bg-page-subtle">
      <div className="site-container site-section">
        <div className="max-w-[800px]">
          <div className="flex flex-wrap items-center gap-3">
            <KategorieLabel>{t.label}</KategorieLabel>
            <PilotMarke />
          </div>
          <h2 className="t-h2 mt-4 text-ink">{t.title}</h2>
          <p className="t-body-lg mt-4 text-ink-muted">{t.intro}</p>
        </div>

        {/* columns: improvement score low | high; rows: automation score high | low */}
        <div role="table" aria-label={t.matrixLabel} className="mt-12 grid gap-3 lg:grid-cols-[auto_1fr_1fr]">
          <div role="row" className="hidden lg:contents">
            {/* corner cell: occupies its grid cell, the text is for screen readers only */}
            <span role="columnheader">
              <span className="sr-only">{t.achseAutomatisierung}</span>
            </span>
            <span role="columnheader" className="t-label self-end pb-1 text-ink-muted">
              {t.achseVerbesserung} {t.unter(e.schwelle_verbesserung)}
            </span>
            <span role="columnheader" className="t-label self-end pb-1 text-ink-muted">
              {t.achseVerbesserung} {t.ab(e.schwelle_verbesserung)}
            </span>
          </div>
          {(['hoch', 'niedrig'] as const).map((a) => (
            <div key={a} role="row" className="contents">
              <span role="rowheader" className="t-label hidden w-48 self-center pr-3 text-ink-muted [hyphens:manual] lg:block">
                {t.achseAutomatisierung} {a === 'hoch' ? t.ab(e.schwelle_automatisierung) : t.unter(e.schwelle_automatisierung)}
              </span>
              <Zelle v="niedrig" a={a} />
              <Zelle v="hoch" a={a} />
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-[800px]">
          <h3 className="t-h3 text-ink">{t.regeln.titel}</h3>
          <ul className="mt-4 space-y-3">
            {[
              t.regeln.vorrang(zahl(config.vorrang.reba_mittel_ab)),
              t.regeln.keinZyklus,
              t.regeln.reihenfolge,
              t.regeln.experte,
              t.regeln.schwellen,
            ].map((r) => (
              <li key={r} className="t-body border-l-2 border-ink pl-4 text-ink">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
