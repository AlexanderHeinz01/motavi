import { automatisierung as a } from '../../content/automatisierung'
import { config } from '../../lib/scoring'
import { prozent } from '../../lib/format'
import Hinweisbox from '../../ui/Hinweisbox'
import Partnerhinweis from '../../ui/Partnerhinweis'
import PageHeader from '../layout/PageHeader'
import { Absaetze, Abschnitt, PerspektivAbschluss, Punkte, TextLink } from '../sections/perspektive/Perspektive'

/** /automatisierung (WEBSITE_PLAN Phase 4). Criteria, weights, threshold and types from the shared configuration. */
export default function AutomatisierungPage() {
  const kriterien = Object.entries(config.automatisierungs_score.kriterien)
  return (
    <>
      <div className="site-container site-section pb-0">
        <PageHeader label={a.label} accent={a.accent} title={a.title} intro={a.intro} />
      </div>
      <Abschnitt label={a.kontext.label} accent={a.accent} titel={a.kontext.titel}>
        <Absaetze absaetze={a.kontext.absaetze} />
      </Abschnitt>
      <Abschnitt label={a.grundsatz.label} titel={a.grundsatz.titel} hintergrund="subtil">
        <Punkte punkte={a.grundsatz.punkte} />
      </Abschnitt>
      <Abschnitt label={a.kriterien.label} accent={a.accent} titel={a.kriterien.titel} intro={a.kriterien.intro}>
        <ul className="grid max-w-[800px] gap-x-8 sm:grid-cols-2">
          {kriterien.map(([id, k]) => (
            <li key={id} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5">
              <span className="font-body text-[16px] text-ink">{k.text}</span>
              <span className="whitespace-nowrap font-mono text-[16px] font-medium text-ink">{prozent(k.gewicht)}</span>
            </li>
          ))}
        </ul>
        <p className="t-body mt-6 max-w-[720px] text-ink-muted">{a.kriterien.schwelle(config.empfehlung.schwelle_automatisierung)}</p>
        <div className="mt-2">
          <TextLink to={a.kriterien.link.to}>{a.kriterien.link.label}</TextLink>
        </div>
      </Abschnitt>
      <Abschnitt label={a.typen.label} accent={a.accent} titel={a.typen.titel} intro={a.typen.intro} hintergrund="subtil">
        <Punkte punkte={config.automatisierungstypen.regeln.map((r) => ({ titel: r.name, text: a.typen.beschreibung[r.id] }))} />
        <div className="mt-8">
          <Partnerhinweis />
        </div>
      </Abschnitt>
      <Abschnitt label={a.wirtschaft.label} accent="gain-ink" titel={a.wirtschaft.titel}>
        <Punkte punkte={a.wirtschaft.punkte} />
        <div className="mt-8 max-w-[640px]">
          <Hinweisbox>{a.wirtschaft.pflicht}</Hinweisbox>
        </div>
      </Abschnitt>
      <Abschnitt label={a.beschaeftigung.label} titel={a.beschaeftigung.titel} hintergrund="subtil">
        <Absaetze absaetze={[a.beschaeftigung.text]} />
      </Abschnitt>
      <PerspektivAbschluss aktuell="automatisierung" />
    </>
  )
}
