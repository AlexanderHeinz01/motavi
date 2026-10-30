import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { annahmen, demoSteckbriefe, type Steckbrief } from '../content/demo/steckbriefe'
import { empfehlungen, type Path } from '../content/empfehlungen'
import { steckbriefText as t } from '../content/komponenten'
import { prozent, zahl } from '../lib/format'
import { begruendung, euroGerundet, wirtschaft } from '../lib/steckbrief'
import DoppelScore from './DoppelScore'
import EmpfehlungsLabel from './EmpfehlungsLabel'
import { EntscheidungswegKompakt } from './Entscheidungsweg'
import GreifraumGrafik from './GreifraumGrafik'
import ZyklusZeitleiste from './ZyklusZeitleiste'

/** hell: website; dunkel: dashboard tab (same structure, .surface-inverse switches the tokens) */
export type SteckbriefTheme = 'hell' | 'dunkel'
type Variante = 'kompakt' | 'vollstaendig'

/** Numbered section like in a technical data sheet. */
function Abschnitt({ nr, titel, children, className = '' }: { nr: string; titel: string; children: ReactNode; className?: string }) {
  return (
    <section className={`border-t border-line p-5 md:p-6 ${className}`}>
      <h4 className="t-label flex gap-3 text-ink-muted">
        <span className="text-ink">{nr}</span>
        {titel}
      </h4>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** One row of the spec table: label left, value in mono right. */
function Zeile({ label, wert, einheit, text = false }: { label: string; wert: string | null; einheit?: string; text?: boolean }) {
  return (
    // the value moves below the label when both do not fit (long labels on phones)
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-line py-2 last:border-b-0">
      <dt className="min-w-[9rem] flex-1 font-body text-[14px] text-ink-muted">{label}</dt>
      {wert === null ? (
        <dd className="ml-auto text-right font-body text-[14px] text-ink-muted">{t.nichtMessbar}</dd>
      ) : (
        <dd className={`ml-auto text-right font-mono text-[16px] font-medium text-ink ${text ? '' : 'whitespace-nowrap'}`}>
          {wert}
          {einheit && <span className="ml-1 font-body text-[13px] font-normal text-ink-muted">{einheit}</span>}
        </dd>
      )}
    </div>
  )
}

/** Headline figure of the economics section (savings in --gain-ink). */
function Kernzahl({ label, wert, zusatz }: { label: string; wert: string; zusatz?: string }) {
  return (
    <div>
      <p className="font-body text-[14px] text-ink-muted">{label}</p>
      <p className="mt-1 font-mono text-[24px] font-medium leading-tight text-gain-ink">{wert}</p>
      {zusatz && <p className="mt-0.5 font-body text-[13px] text-ink-muted">{zusatz}</p>}
    </div>
  )
}

function Kennzahlen({ s, variante }: { s: Steckbrief; variante: Variante }) {
  const zyklus = s.zykluszeit_median_s !== null ? zahl(s.zykluszeit_median_s, 1) : null
  const voll = variante === 'vollstaendig'
  return (
    <dl>
      <Zeile label={t.zykluszeit} wert={zyklus} einheit="s" />
      {voll && <Zeile label={t.schwankung} wert={s.zykluszeit_vk !== null ? prozent(s.zykluszeit_vk) : null} />}
      <Zeile label={t.zyklen} wert={s.zyklen_pro_schicht !== null ? zahl(s.zyklen_pro_schicht) : null} />
      {voll && (
        <>
          <Zeile label={t.zeitanteil} wert={s.zeitanteil_in_zyklen !== null ? prozent(s.zeitanteil_in_zyklen) : null} />
          <Zeile label={t.drehungen} wert={s.drehungen_pro_zyklus !== null ? zahl(s.drehungen_pro_zyklus) : null} />
        </>
      )}
      <Zeile label={t.ausserhalb} wert={prozent(s.griffe_ausserhalb_greifraum)} />
      <Zeile label={t.reba} wert={zahl(s.reba_mittel, 1)} />
    </dl>
  )
}

/** What the recommendation brings: euros by design, by automation, or no investment; all equally prominent. */
function Wirtschaft({ s, path, variante }: { s: Steckbrief; path: Path; variante: Variante }) {
  const { euroVerbesserung, euroAuto } = wirtschaft(s, annahmen)
  const stunden = s.stunden_auto_jahr_bandbreite
  const verbessern = path === 'improve' || path === 'improve-then-automate'
  const automatisieren = path === 'automate' || path === 'improve-then-automate'
  const voll = variante === 'vollstaendig'
  return (
    <div className="space-y-5">
      {verbessern && euroVerbesserung !== null && s.verbesserung_min_schicht !== null && (
        <div>
          <Kernzahl label={t.euroVerbesserung} wert={euroGerundet(euroVerbesserung)} />
          {voll && (
            <dl className="mt-2">
              <Zeile label={t.minutenVerbesserung} wert={zahl(s.verbesserung_min_schicht)} einheit="min" />
            </dl>
          )}
        </div>
      )}
      {automatisieren && stunden && euroAuto && (
        <div>
          <Kernzahl label={t.euroAuto} wert={`${euroGerundet(euroAuto[0])} ${t.bis} ${euroGerundet(euroAuto[1])}`} zusatz={t.nachBetriebskosten} />
          {voll && (
            <dl className="mt-2">
              <Zeile label={t.stundenAuto} wert={`${zahl(stunden[0])} ${t.bis} ${zahl(stunden[1])}`} einheit={t.stundenAutoEinheit} />
              {s.typ_vorschlag && <Zeile label={t.typ} wert={s.typ_vorschlag} text />}
            </dl>
          )}
          {voll && path === 'improve-then-automate' && <p className="mt-2 font-body text-[13px] text-ink-muted">{t.aufVerbessertemAblauf}</p>}
        </div>
      )}
      {path === 'keep' && (
        <div>
          {/* same slot and size as the figures of the other recommendations, a statement instead of a number */}
          <p className="font-body text-[14px] text-ink-muted">{t.ergebnis}</p>
          <p className="t-h3 mt-1 text-ink">{t.keineInvestition}</p>
          <p className="mt-2 font-body text-[14px] text-ink">{t.keineInvestitionText}</p>
          {voll && s.verbesserung_min_schicht !== null && (
            <dl className="mt-2">
              <Zeile label={t.gestaltungspotenzial} wert={zahl(s.verbesserung_min_schicht)} einheit="min" />
            </dl>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Steckbrief preview (DESIGN_BRIEF §4, STECKBRIEF_MODUL §6): a technical
 * data sheet in the order of the later dashboard tab: head with
 * recommendation and reasons, scores, key figures, cycle, reach, economics.
 * Values that could not be measured reliably show "nicht belastbar messbar".
 */
export default function SteckbriefVorschau({
  data: s,
  path,
  variante = 'vollstaendig',
  theme = 'hell',
}: {
  data: Steckbrief
  path: Path
  variante?: Variante
  theme?: SteckbriefTheme
}) {
  const voll = variante === 'vollstaendig'
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-card border border-line bg-page text-ink ${theme === 'dunkel' ? 'surface-inverse' : ''}`}
      aria-label={`${t.titel}: ${s.arbeitsplatz}`}
    >
      {/* document bar */}
      <div className="t-label flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-2.5 text-ink-muted md:px-6">
        <span className="text-ink">{t.titel}</span>
        <span>
          {t.beispiel} · {t.pilot}
        </span>
      </div>

      <header className="p-5 md:p-6">
        <h3 className="t-h3 [hyphens:auto]">{s.arbeitsplatz}</h3>
        <div className="mt-4">
          <EmpfehlungsLabel path={path} variant="kraeftig" size="lg" vorrangig={s.vorrangig} />
        </div>
        <div className="mt-4">
          <p className="t-label text-ink-muted">{t.begruendung}</p>
          <ul className="mt-2 space-y-1">
            {begruendung(s, path).map((g) => (
              <li key={g} className="flex gap-2.5 font-body text-[15px] text-ink">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-ink-muted" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </div>
        {voll && (
          <div className="mt-5">
            <EntscheidungswegKompakt aktiv={path} />
          </div>
        )}
      </header>

      <div className={`grid border-t border-line ${voll ? 'md:grid-cols-2' : ''}`}>
        <Abschnitt nr="01" titel={t.bewertung} className="border-t-0">
          <DoppelScore verbesserung={s.verbesserungs_score} automatisierung={s.automatisierungs_score} mitEmpfehlung={false} />
        </Abschnitt>
        <Abschnitt nr="02" titel={t.kennzahlen} className={voll ? 'md:border-l md:border-t-0' : ''}>
          <Kennzahlen s={s} variante={variante} />
        </Abschnitt>
      </div>

      {voll ? (
        <>
          <Abschnitt nr="03" titel={t.ablauf}>
            <ZyklusZeitleiste schritte={s.ablaufschritte} zykluszeit={s.zykluszeit_median_s} />
          </Abschnitt>
          <div className="grid border-t border-line md:grid-cols-2">
            <Abschnitt nr="04" titel={t.greifraum} className="border-t-0">
              <GreifraumGrafik hoehenzonen={s.hoehenzonen} ausserhalb={s.griffe_ausserhalb_greifraum} />
            </Abschnitt>
            <Abschnitt nr="05" titel={t.wirtschaft} className="md:border-l md:border-t-0">
              <Wirtschaft s={s} path={path} variante={variante} />
            </Abschnitt>
          </div>
        </>
      ) : (
        <Abschnitt nr="03" titel={t.wirtschaft}>
          <Wirtschaft s={s} path={path} variante={variante} />
        </Abschnitt>
      )}

      <footer className="mt-auto border-t border-line px-5 py-3 font-body text-[13px] text-ink-muted md:px-6">
        {t.annahmen(annahmen.schichtenProTag, annahmen.arbeitstage, annahmen.stundensatz)} {t.pflichthinweis} {t.taetigkeit}
      </footer>
    </article>
  )
}

/**
 * Switcher between the four demo examples (tabs, arrow keys). The tab bar
 * sticks below the site header while the Steckbrief is in view, so the
 * other examples are always reachable without scrolling back (compact
 * 2 x 2 grid on phones).
 */
export function SteckbriefUmschalter({ variante = 'vollstaendig', theme = 'hell' }: { variante?: Variante; theme?: SteckbriefTheme }) {
  const [aktiv, setAktiv] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const leiste = useRef<HTMLDivElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const waehlen = (i: number) => {
    setAktiv(i)
    // deep inside a long Steckbrief: show the new one from its start
    const l = leiste.current?.getBoundingClientRect()
    const top = panel.current?.getBoundingClientRect().top
    if (l && top !== undefined && top < l.bottom) {
      const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollBy({ top: top - l.bottom - 8, behavior: ruhig ? 'auto' : 'smooth' })
    }
  }
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (aktiv + step + demoSteckbriefe.length) % demoSteckbriefe.length
    waehlen(next)
    tabs.current[next]?.focus()
  }
  const { data, path } = demoSteckbriefe[aktiv]
  return (
    <div className={theme === 'dunkel' ? 'surface-inverse' : ''}>
      <div
        ref={leiste}
        role="tablist"
        aria-label={t.umschalter}
        className="sticky top-16 z-20 mb-4 grid grid-cols-2 gap-2 border-b border-line bg-page py-3 sm:flex sm:flex-wrap"
        onKeyDown={onKey}
      >
        {demoSteckbriefe.map((d, i) => (
          <button
            key={d.path}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            id={`steckbrief-tab-${theme}-${d.path}`}
            aria-selected={i === aktiv}
            aria-controls={`steckbrief-panel-${theme}`}
            tabIndex={i === aktiv ? 0 : -1}
            onClick={() => waehlen(i)}
            className={`min-h-[44px] rounded-btn border px-3 py-1 font-body text-[13px] leading-tight transition-colors duration-150 ease-out sm:px-4 sm:text-[14px] ${
              i === aktiv ? 'border-ink bg-page text-ink' : 'border-line bg-page text-ink-muted is-hover:border-ink-muted'
            }`}
          >
            {empfehlungen[d.path]}
          </button>
        ))}
      </div>
      <div ref={panel} role="tabpanel" id={`steckbrief-panel-${theme}`} aria-labelledby={`steckbrief-tab-${theme}-${path}`}>
        <SteckbriefVorschau data={data} path={path} variante={variante} theme={theme} />
      </div>
    </div>
  )
}
