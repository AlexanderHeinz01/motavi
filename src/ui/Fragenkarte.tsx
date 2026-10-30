import { useId } from 'react'
import { fragenText } from '../content/komponenten'
import type { Path } from '../content/empfehlungen'
import Button, { type Force } from './Button'
import DoppelScore from './DoppelScore'
import EmpfehlungsLabel from './EmpfehlungsLabel'
import { FieldError } from './form/Formular'

function Fortschritt({ nummer, gesamt }: { nummer: number; gesamt: number }) {
  return (
    <div>
      <p className="t-label text-ink-muted">{fragenText.fortschritt(nummer, gesamt)}</p>
      <div
        className="mt-2 h-1.5 rounded-full bg-page-subtle"
        role="progressbar"
        aria-label={fragenText.fortschritt(nummer, gesamt)}
        aria-valuemin={1}
        aria-valuemax={gesamt}
        aria-valuenow={nummer}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${(nummer / gesamt) * 100}%` }} />
      </div>
    </div>
  )
}

/**
 * Question card of the Arbeitsplatz-Check (DESIGN_BRIEF §4): one question per
 * view, progress bar, answers as radio cards, back and next.
 */
export default function Fragenkarte({
  nummer,
  gesamt,
  frage,
  optionen,
  value,
  onChange,
  onZurueck,
  onWeiter,
  fehler,
  disabled,
  force,
}: {
  nummer: number
  gesamt: number
  frage: string
  optionen: string[]
  value?: number
  onChange?: (index: number) => void
  onZurueck?: () => void
  onWeiter?: () => void
  fehler?: string
  disabled?: boolean
  /** Styleguide: force a state on the first option */
  force?: Force
}) {
  const name = useId()
  const fehlerId = `${name}-fehler`
  const letzte = nummer === gesamt
  return (
    <div className="rounded-card border border-line bg-page p-6">
      <Fortschritt nummer={nummer} gesamt={gesamt} />
      <fieldset className="mt-6" aria-describedby={fehler ? fehlerId : undefined} disabled={disabled}>
        <legend className="t-h3 text-ink">{frage}</legend>
        <div className="mt-4 grid gap-2">
          {optionen.map((o, i) => {
            const selected = value === i
            return (
              <label
                key={o}
                data-force={i === 0 ? force : undefined}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-btn border bg-page px-4 py-2.5 font-body text-[15px] text-ink transition-colors duration-150 ease-out has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 is-focus-within:outline is-focus-within:outline-2 is-focus-within:outline-offset-2 is-focus-within:outline-primary ${
                  fehler
                    ? 'border-error-ink shadow-[inset_0_0_0_1px_var(--error-ink)]'
                    : selected
                      ? 'border-primary shadow-[inset_0_0_0_1px_var(--primary)]'
                      : 'border-line-strong is-hover:border-ink-muted'
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  checked={selected}
                  onChange={() => onChange?.(i)}
                  className="h-4 w-4 shrink-0 accent-[var(--primary)] focus-visible:outline-none"
                />
                {o}
              </label>
            )
          })}
        </div>
        {fehler && <FieldError id={fehlerId}>{fehler}</FieldError>}
      </fieldset>
      <div className="mt-6 flex justify-between gap-3">
        <Button variant="secondary" onClick={onZurueck} disabled={nummer === 1 || disabled}>
          {fragenText.zurueck}
        </Button>
        <Button onClick={onWeiter} disabled={disabled}>
          {letzte ? fragenText.auswerten : fragenText.weiter}
        </Button>
      </div>
    </div>
  )
}

/** Result view: recommendation label (full) with double score. */
export function FragenErgebnis({ path, verbesserung, automatisierung }: { path: Path; verbesserung: number; automatisierung: number }) {
  return (
    <div className="rounded-card border border-line bg-page p-6">
      <p className="t-label text-ink-muted">{fragenText.ergebnis}</p>
      <div className="mt-3">
        <EmpfehlungsLabel path={path} variant="kraeftig" size="lg" />
      </div>
      <div className="mt-6">
        <DoppelScore verbesserung={verbesserung} automatisierung={automatisierung} mitEmpfehlung={false} />
      </div>
      <p className="t-body mt-4 text-ink-muted">{fragenText.ergebnisHinweis}</p>
    </div>
  )
}
