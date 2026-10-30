import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { annahmen, demoSteckbriefe, type Steckbrief } from '../content/demo/steckbriefe'
import { empfehlungen, type Path } from '../content/empfehlungen'
import { steckbriefText } from '../content/komponenten'
import { euro, prozent, zahl } from '../lib/format'
import DoppelScore from './DoppelScore'
import EmpfehlungsLabel from './EmpfehlungsLabel'
import { EntscheidungswegKompakt } from './Entscheidungsweg'
import GreifraumGrafik from './GreifraumGrafik'
import ZyklusZeitleiste from './ZyklusZeitleiste'

const nichtMessbar = steckbriefText.nichtMessbar

function Kennzahl({ label, wert }: { label: string; wert: string | null }) {
  return (
    <div className="border-t border-line py-2">
      <dt className="font-body text-[13px] text-ink-muted">{label}</dt>
      <dd className={wert === null ? 'font-body text-[14px] italic text-ink-muted' : 'font-mono text-[18px] font-medium text-ink'}>
        {wert ?? nichtMessbar}
      </dd>
    </div>
  )
}

function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="border-t border-line p-6">
      <h4 className="t-label text-ink-muted">{titel}</h4>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/**
 * Steckbrief preview (DESIGN_BRIEF §4): looks like a technical data sheet.
 * Head with workplace and recommendation, double score, key figures in mono,
 * cycle timeline, reach graphic, minutes and euros. Values that could not be
 * measured reliably show "nicht belastbar messbar" (STECKBRIEF_MODUL §2.3).
 */
export default function SteckbriefVorschau({
  data,
  path,
  variante = 'vollstaendig',
}: {
  data: Steckbrief
  path: Path
  variante?: 'kompakt' | 'vollstaendig'
}) {
  const s = data
  const zyklus = s.zykluszeit_median_s !== null ? `${zahl(s.zykluszeit_median_s, 1)} s` : null
  const euroVerbesserung =
    ((s.verbesserung_min_schicht * annahmen.schichtenProTag * annahmen.arbeitstage) / 60) * annahmen.stundensatz
  return (
    <article className="overflow-hidden rounded-card border border-line bg-page text-ink" aria-label={`${steckbriefText.titel}: ${s.arbeitsplatz}`}>
      <header className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="t-label text-ink">{steckbriefText.titel}</p>
          <span className="t-label rounded-full border border-line px-2 py-0.5 text-ink-muted">{steckbriefText.beispiel}</span>
          <span className="t-label rounded-full border border-line px-2 py-0.5 text-ink-muted">{steckbriefText.pilot}</span>
        </div>
        <h3 className="t-h3 mt-3">{s.arbeitsplatz}</h3>
        <div className="mt-4">
          <EmpfehlungsLabel path={path} variant="kraeftig" size="lg" vorrangig={s.vorrangig} />
        </div>
        <div className="mt-4">
          <EntscheidungswegKompakt aktiv={path} />
        </div>
      </header>

      <div className="grid gap-8 border-t border-line p-6 md:grid-cols-2">
        <DoppelScore verbesserung={s.verbesserungs_score} automatisierung={s.automatisierungs_score} mitEmpfehlung={false} />
        <div>
          <h4 className="t-label text-ink-muted">{steckbriefText.kennzahlen}</h4>
          <dl className="mt-2 grid grid-cols-2 gap-x-6">
            <Kennzahl label={steckbriefText.zykluszeit} wert={zyklus} />
            <Kennzahl label={steckbriefText.zyklen} wert={s.zyklen_pro_schicht !== null ? zahl(s.zyklen_pro_schicht) : null} />
            <Kennzahl label={steckbriefText.reba} wert={zahl(s.reba_mittel, 1)} />
            <Kennzahl label={steckbriefText.minutenVerbesserung} wert={`${zahl(s.verbesserung_min_schicht)} min`} />
            {variante === 'vollstaendig' && (
              <>
                <Kennzahl label={steckbriefText.schwankung} wert={s.zykluszeit_vk !== null ? prozent(s.zykluszeit_vk) : null} />
                <Kennzahl label={steckbriefText.zeitanteil} wert={prozent(s.zeitanteil_in_zyklen)} />
                <Kennzahl label={steckbriefText.drehungen} wert={s.drehungen_pro_zyklus !== null ? zahl(s.drehungen_pro_zyklus) : null} />
                <Kennzahl label={steckbriefText.ausserhalb} wert={prozent(s.griffe_ausserhalb_greifraum)} />
              </>
            )}
          </dl>
        </div>
      </div>

      {variante === 'vollstaendig' && (
        <>
          <Abschnitt titel={steckbriefText.ablauf}>
            <ZyklusZeitleiste schritte={s.ablaufschritte} zykluszeit={s.zykluszeit_median_s} />
          </Abschnitt>
          <div className="grid border-t border-line md:grid-cols-2">
            <section className="p-6">
              <h4 className="t-label text-ink-muted">{steckbriefText.greifraum}</h4>
              <div className="mt-4">
                <GreifraumGrafik hoehenzonen={s.hoehenzonen} ausserhalb={s.griffe_ausserhalb_greifraum} />
              </div>
            </section>
            <section className="border-t border-line p-6 md:border-l md:border-t-0">
              <h4 className="t-label text-ink-muted">{steckbriefText.wirtschaft}</h4>
              <dl className="mt-2">
                <Kennzahl label={steckbriefText.minutenVerbesserung} wert={`${zahl(s.verbesserung_min_schicht)} min`} />
                <Kennzahl label={steckbriefText.euroVerbesserung} wert={euro(euroVerbesserung)} />
                {s.stunden_auto_jahr_bandbreite && (
                  <Kennzahl
                    label={steckbriefText.stundenAuto}
                    wert={`${zahl(s.stunden_auto_jahr_bandbreite[0])} bis ${zahl(s.stunden_auto_jahr_bandbreite[1])} h`}
                  />
                )}
                {s.typ_vorschlag && <Kennzahl label={steckbriefText.typ} wert={s.typ_vorschlag} />}
              </dl>
              <p className="mt-4 font-body text-[13px] text-ink-muted">
                {steckbriefText.annahmen(annahmen.schichtenProTag, annahmen.arbeitstage, annahmen.stundensatz)}{' '}
                {steckbriefText.pflichthinweis}
              </p>
            </section>
          </div>
        </>
      )}
    </article>
  )
}

/** Switcher between the four demo examples (tabs, arrow keys). */
export function SteckbriefUmschalter({ variante = 'vollstaendig' }: { variante?: 'kompakt' | 'vollstaendig' }) {
  const [aktiv, setAktiv] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (aktiv + step + demoSteckbriefe.length) % demoSteckbriefe.length
    setAktiv(next)
    tabs.current[next]?.focus()
  }
  const { data, path } = demoSteckbriefe[aktiv]
  return (
    <div>
      <div role="tablist" aria-label={steckbriefText.umschalter} className="mb-4 flex flex-wrap gap-2" onKeyDown={onKey}>
        {demoSteckbriefe.map((d, i) => (
          <button
            key={d.path}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            id={`steckbrief-tab-${d.path}`}
            aria-selected={i === aktiv}
            aria-controls="steckbrief-panel"
            tabIndex={i === aktiv ? 0 : -1}
            onClick={() => setAktiv(i)}
            className={`min-h-[44px] rounded-btn border px-4 font-body text-[14px] transition-colors duration-150 ease-out ${
              i === aktiv ? 'border-ink bg-page text-ink' : 'border-line bg-page text-ink-muted is-hover:border-ink-muted'
            }`}
          >
            {empfehlungen[d.path]}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="steckbrief-panel" aria-labelledby={`steckbrief-tab-${path}`}>
        <SteckbriefVorschau data={data} path={path} variante={variante} />
      </div>
    </div>
  )
}
