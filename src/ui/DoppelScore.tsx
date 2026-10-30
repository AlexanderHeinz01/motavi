import { doppelScoreText } from '../content/komponenten'
import { empfehlungAus, STANDARD_SCHWELLEN, type Schwellen } from '../lib/empfehlung'
import EmpfehlungsLabel from './EmpfehlungsLabel'

function Balken({ label, wert, schwelle, farbe }: { label: string; wert: number; schwelle: number; farbe: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-body text-[15px] text-ink">{label}</span>
        <span className="font-mono text-[15px] font-medium text-ink">
          {wert} <span className="text-ink-muted">/ 100</span>
        </span>
      </div>
      <div
        className="relative mt-2 h-3 rounded-full bg-page-subtle"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={wert}
      >
        <div className="h-full rounded-full" style={{ width: `${wert}%`, background: `var(${farbe})` }} />
        {/* Threshold as a dimension mark */}
        <div className="absolute -bottom-1 -top-1 w-0.5 bg-ink" style={{ left: `${schwelle}%` }} aria-hidden="true" />
      </div>
      <p className="mt-1 font-mono text-[12px] text-ink-muted" style={{ paddingLeft: `calc(${schwelle}% - 1.5em)` }}>
        {doppelScoreText.schwelle} {schwelle}
      </p>
    </div>
  )
}

/**
 * Double score (DESIGN_BRIEF §4): improvement and automation score with
 * threshold line, below the derived recommendation (STECKBRIEF_MODUL §5.3).
 */
export default function DoppelScore({
  verbesserung,
  automatisierung,
  schwellen = STANDARD_SCHWELLEN,
  mitEmpfehlung = true,
}: {
  verbesserung: number
  automatisierung: number
  schwellen?: Schwellen
  mitEmpfehlung?: boolean
}) {
  return (
    <div className="space-y-4">
      <Balken label={doppelScoreText.verbesserung} wert={verbesserung} schwelle={schwellen.verbesserung} farbe="--path-improve" />
      <Balken
        label={doppelScoreText.automatisierung}
        wert={automatisierung}
        schwelle={schwellen.automatisierung}
        farbe="--path-automate"
      />
      {mitEmpfehlung && (
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <span className="t-label text-ink-muted">{doppelScoreText.empfehlung}</span>
          <span className="text-ink">
            <EmpfehlungsLabel path={empfehlungAus(verbesserung, automatisierung, schwellen)} />
          </span>
        </div>
      )}
    </div>
  )
}
