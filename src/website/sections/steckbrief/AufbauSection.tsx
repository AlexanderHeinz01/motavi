/**
 * "Jede Kennzahl erklärt": the example Steckbrief with a numbered legend next
 * to it, like a labelled technical drawing (DESIGN_BRIEF §5). Weights,
 * thresholds, step types, avoidable shares and automation types are read
 * from the shared configuration.
 */
import type { ReactNode } from 'react'
import { demoSteckbriefe } from '../../../content/demo/steckbriefe'
import { steckbrief, type Kennzahl } from '../../../content/steckbrief'
import { zeitleisteText } from '../../../content/komponenten'
import { prozent } from '../../../lib/format'
import { config } from '../../../lib/scoring'
import KategorieLabel from '../../../ui/KategorieLabel'
import SteckbriefVorschau from '../../../ui/SteckbriefVorschau'

const a = steckbrief.aufbau
const KLASSEN = ['wertschoepfend', 'notwendig', 'verschwendung'] as const

export function PilotMarke() {
  return <KategorieLabel accent="warn-ink">{steckbrief.pilotLabel}</KategorieLabel>
}

function Eintrag({ k, children }: { k: Kennzahl; children?: ReactNode }) {
  return (
    // one list per metric, so that the notes between them stay valid HTML
    <dl className="border-b border-line py-4 last:border-b-0">
      <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-body text-[16px] font-medium text-ink">{k.name}</span>
        <span className="font-mono text-[12px] uppercase tracking-wide text-ink-muted">{steckbrief.quelle[k.quelle]}</span>
        {k.pilot && <PilotMarke />}
      </dt>
      <dd className="t-body mt-1.5 text-ink-muted">
        {k.text}
        {children}
      </dd>
    </dl>
  )
}

/** Weights of a score, in the order of the configuration. */
function Gewichte({ kriterien }: { kriterien: Record<string, { text: string; gewicht: number }> }) {
  return (
    <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
      {Object.entries(kriterien).map(([id, k]) => (
        <li key={id} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line py-1 text-ink">
          <span className="font-body text-[14px]">{k.text}</span>
          <span className="whitespace-nowrap font-mono text-[14px]">{prozent(k.gewicht)}</span>
        </li>
      ))}
    </ul>
  )
}

function Gruppe({ nr, titel, children }: { nr: string; titel: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`aufbau-${nr}`} className="rounded-card border border-line bg-page p-5">
      <h3 id={`aufbau-${nr}`} className="flex items-baseline gap-3">
        <span className="font-mono text-[14px] font-medium text-ink">{nr}</span>
        <span className="t-label text-ink">{titel}</span>
      </h3>
      <div className="mt-1">{children}</div>
    </section>
  )
}

export default function AufbauSection() {
  const beispiel = demoSteckbriefe[0]
  const typen = Object.entries(config.schritt_typen)
  const e = config.empfehlung
  return (
    <section id={a.id} className="scroll-mt-20 border-t border-line">
      <div className="site-container site-section">
        <div className="max-w-[800px]">
          <KategorieLabel>{a.label}</KategorieLabel>
          <h2 className="t-h2 mt-4 text-ink">{a.title}</h2>
          <p className="t-body-lg mt-4 text-ink-muted">{a.intro}</p>
          <p className="t-body mt-3 text-ink-muted">{steckbrief.pilotErklaerung}</p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SteckbriefVorschau data={beispiel.data} path={beispiel.path} />
          </div>

          <div className="space-y-4 lg:col-span-6">
            <Gruppe nr={a.kopf.nr} titel={a.kopf.titel}>
              {a.kopf.eintraege.map((k) => (
                <Eintrag key={k.name} k={k} />
              ))}
            </Gruppe>

            <Gruppe nr={a.bewertung.nr} titel={a.bewertung.titel}>
              <Eintrag k={{ ...a.bewertung.verbesserung, text: a.bewertung.verbesserung.text(e.schwelle_verbesserung) }}>
                <Gewichte kriterien={config.verbesserungs_score.kriterien} />
              </Eintrag>
              <Eintrag k={{ ...a.bewertung.automatisierung, text: a.bewertung.automatisierung.text(e.schwelle_automatisierung) }}>
                <Gewichte kriterien={config.automatisierungs_score.kriterien} />
              </Eintrag>
              <p className="t-body py-3 text-ink-muted">{a.bewertung.fehlend}</p>
            </Gruppe>

            <Gruppe nr={a.kennzahlen.nr} titel={a.kennzahlen.titel}>
              {a.kennzahlen.eintraege.map((k) => (
                <Eintrag key={k.name} k={k} />
              ))}
              <p className="t-body py-3 text-ink-muted">{a.kennzahlen.nichtMessbar}</p>
            </Gruppe>

            <Gruppe nr={a.ablauf.nr} titel={a.ablauf.titel}>
              {a.ablauf.eintraege.map((k) => (
                <Eintrag key={k.name} k={k}>
                  <span className="mt-2 block">{a.ablauf.einstufung}</span>
                  <ul className="mt-2 space-y-1">
                    {KLASSEN.map((kl) => (
                      <li key={kl} className="font-body text-[14px] text-ink">
                        <span className="font-medium">{zeitleisteText[kl]}:</span>{' '}
                        {typen.filter(([, klasse]) => klasse === kl).map(([t]) => t).join(', ')}
                      </li>
                    ))}
                  </ul>
                </Eintrag>
              ))}
              <p className="t-body py-3 text-ink-muted">{a.ablauf.ohneZyklus}</p>
            </Gruppe>

            <Gruppe nr={a.greifraum.nr} titel={a.greifraum.titel}>
              {a.greifraum.eintraege.map((k) => (
                <Eintrag key={k.name} k={k} />
              ))}
              <p className="t-body py-3 text-ink-muted">{a.greifraum.hinweis}</p>
            </Gruppe>

            <Gruppe nr={a.wirtschaft.nr} titel={a.wirtschaft.titel}>
              <Eintrag k={a.wirtschaft.gestaltung}>
                {' '}
                {Object.entries(config.vermeidbarer_anteil)
                  .map(([typ, anteil]) => `${typ} ${prozent(anteil)}`)
                  .join(', ')}
                .
              </Eintrag>
              <Eintrag k={a.wirtschaft.potenzial} />
              <Eintrag k={a.wirtschaft.euro} />
              <Eintrag k={a.wirtschaft.typ}>
                {' '}
                {config.automatisierungstypen.regeln.map((r) => r.name).join(', ')}.
              </Eintrag>
              <Eintrag k={a.wirtschaft.kunde} />
              <p className="t-body py-3 font-medium text-ink">{a.wirtschaft.pflicht}</p>
            </Gruppe>

            <p className="t-body-lg text-ink">{a.person}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
