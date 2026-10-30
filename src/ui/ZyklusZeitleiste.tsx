import type { CSSProperties } from 'react'
import type { Klasse } from '../content/demo/steckbriefe'
import { steckbriefText, zeitleisteText } from '../content/komponenten'
import { prozent, zahl } from '../lib/format'

/** Segment look per class: strong, medium, hatched (never colour alone). */
export const segmentStil: Record<Klasse, CSSProperties> = {
  wertschoepfend: { background: 'var(--data-ink)' },
  notwendig: {
    background: 'color-mix(in srgb, var(--data-ink) 28%, var(--bg))',
    boxShadow: 'inset 0 0 0 1.5px var(--data-ink)',
  },
  verschwendung: {
    background: 'repeating-linear-gradient(45deg, var(--data-ink) 0 1.5px, var(--bg) 1.5px 6px)',
    boxShadow: 'inset 0 0 0 1.5px var(--data-ink)',
  },
}

/** Dimension line like in a technical drawing, label centered above. */
function Masslinie({ label, breite = '100%' }: { label: string; breite?: string }) {
  return (
    <div className="relative mb-1 h-6" style={{ width: breite }} aria-hidden="true">
      <span className="absolute inset-x-0 top-0 text-center font-mono text-[12px] font-medium text-ink">{label}</span>
      <span className="absolute inset-x-0 bottom-1.5 h-px bg-ink" />
      <span className="absolute bottom-0 left-0 h-3 w-px bg-ink" />
      <span className="absolute bottom-0 right-0 h-3 w-px bg-ink" />
    </div>
  )
}

function Balken({ schritte, hoehe = 'h-8' }: { schritte: { typ: string; anteil: number; klasse: Klasse }[]; hoehe?: string }) {
  return (
    <div className={`flex w-full gap-0.5 ${hoehe}`}>
      {schritte.map((s, i) => (
        <div key={`${s.typ}-${i}`} className="rounded-[3px]" style={{ width: `${s.anteil * 100}%`, ...segmentStil[s.klasse] }} title={s.typ} />
      ))}
    </div>
  )
}

export function Legende() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 font-body text-[13px] text-ink-muted">
      {(['wertschoepfend', 'notwendig', 'verschwendung'] as const).map((k) => (
        <li key={k} className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-5 rounded-[2px]" style={segmentStil[k]} aria-hidden="true" />
          {zeitleisteText[k]}
        </li>
      ))}
    </ul>
  )
}

/** Fixed variation of cycle lengths for the sequence view (illustration). */
const FOLGE = [1, 0.94, 1.07, 0.97, 1.03, 0.99]

/**
 * Cycle timeline (DESIGN_BRIEF §4): single cycle or a sequence of cycles.
 * Segments by class; cycle time as a dimension line.
 */
export default function ZyklusZeitleiste({
  schritte,
  zykluszeit,
  variante = 'einzeln',
  anzahl = 5,
}: {
  schritte: { typ: string; anteil: number; klasse: Klasse }[]
  /** null: no recurring cycle detected */
  zykluszeit: number | null
  variante?: 'einzeln' | 'folge'
  anzahl?: number
}) {
  const label = zykluszeit !== null ? `${zahl(zykluszeit, 1)} s` : ''
  // without a recurring cycle there are no process steps (they are confirmed per cycle)
  if (zykluszeit === null && schritte.length === 0) {
    return <p className="font-body text-[14px] text-ink-muted">{steckbriefText.keinZyklus}</p>
  }
  return (
    <div>
      {zykluszeit === null ? (
        <p className="mb-2 font-body text-[14px] text-ink-muted">{steckbriefText.keinZyklus}</p>
      ) : variante === 'einzeln' ? (
        <Masslinie label={label} />
      ) : (
        <Masslinie label={label} breite={`calc((100% - ${(anzahl - 1) * 6}px) * ${FOLGE[0] / FOLGE.slice(0, anzahl).reduce((a, b) => a + b, 0)})`} />
      )}

      {variante === 'einzeln' || zykluszeit === null ? (
        <Balken schritte={schritte} />
      ) : (
        <div className="flex gap-1.5">
          {FOLGE.slice(0, anzahl).map((f, i) => (
            <div key={i} style={{ flex: f }}>
              <Balken schritte={schritte} hoehe="h-6" />
            </div>
          ))}
        </div>
      )}

      {variante === 'einzeln' && (
        <ol className="mt-3 grid gap-x-6 gap-y-1 font-body text-[14px] sm:grid-cols-2">
          {schritte.map((s, i) => (
            <li key={`${s.typ}-${i}`} className="flex items-center gap-2">
              <span className="inline-block h-3 w-4 shrink-0 rounded-[2px]" style={segmentStil[s.klasse]} aria-hidden="true" />
              <span className="text-ink">{s.typ}</span>
              <span className="ml-auto font-mono text-[13px] text-ink-muted">
                {zykluszeit !== null && `${zahl(s.anteil * zykluszeit, 1)} s · `}
                {prozent(s.anteil)}
              </span>
              <span className="sr-only">({zeitleisteText[s.klasse]})</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-3">
        <Legende />
      </div>
    </div>
  )
}
