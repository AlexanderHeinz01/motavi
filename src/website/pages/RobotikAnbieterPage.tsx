import { robotikAnbieter as r } from '../../content/robotikAnbieter'
import { demoSteckbriefe } from '../../content/demo/steckbriefe'
import ButtonLink from '../../ui/ButtonLink'
import SteckbriefVorschau from '../../ui/SteckbriefVorschau'
import PageHeader from '../layout/PageHeader'
import { Abschnitt, Punkte } from '../sections/perspektive/Perspektive'

const beispiel = demoSteckbriefe[0]

/** Excerpt of the export: the fields a provider plans with. */
function jsonAuszug(): string {
  const d = beispiel.data
  const auszug = {
    format: d.format,
    schema_version: d.schema_version,
    beispiel: d.beispiel,
    empfehlung: d.empfehlung,
    typ_vorschlag: d.typ_vorschlag,
    zykluszeit_median_s: d.zykluszeit_median_s,
    zykluszeit_vk: d.zykluszeit_vk,
    zyklen_pro_schicht: d.zyklen_pro_schicht,
    ablaufschritte: d.ablaufschritte.slice(0, 3),
    hoehenzonen: d.hoehenzonen,
    stunden_auto_jahr_bandbreite: d.stunden_auto_jahr_bandbreite,
  }
  return JSON.stringify(auszug, null, 2).replace(/\{\n\s+("typ": [^\n]+),\n\s+("anteil": [^\n]+),\n\s+("klasse": [^\n]+)\n\s+\}/g, '{ $1, $2, $3 }')
}

/** /fuer-robotik-anbieter (WEBSITE_PLAN Phase 5): data sheet rather than marketing (DESIGN_BRIEF §5). */
export default function RobotikAnbieterPage() {
  return (
    <>
      <div className="site-container site-section pb-0">
        <PageHeader label={r.label} accent={r.accent} title={r.title} intro={r.intro} />
      </div>
      <Abschnitt label={r.nutzen.label} titel={r.nutzen.titel}>
        <Punkte punkte={r.nutzen.punkte} />
      </Abschnitt>
      <Abschnitt label={r.daten.label} titel={r.daten.titel} intro={r.daten.intro} hintergrund="subtil">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <figure className="min-w-0">
            <figcaption className="t-label mb-3 text-ink-muted">{r.daten.jsonTitel}</figcaption>
            <pre
              tabIndex={0}
              aria-label={r.daten.jsonLabel}
              className="overflow-x-auto rounded-card border border-line bg-page p-5 font-mono text-[13px] leading-relaxed text-ink"
            >
              <code>{jsonAuszug()}</code>
            </pre>
            <p className="mt-3 font-body text-[14px] text-ink-muted">{r.daten.format}</p>
          </figure>
          <figure className="min-w-0">
            <figcaption className="t-label mb-3 text-ink-muted">{r.daten.pdfTitel}</figcaption>
            <SteckbriefVorschau data={beispiel.data} path={beispiel.path} variante="kompakt" />
          </figure>
        </div>
      </Abschnitt>
      <Abschnitt label={r.neutral.label} titel={r.neutral.titel}>
        <Punkte punkte={r.neutral.punkte} />
        <div className="mt-10">
          <p className="t-h3 text-ink">{r.cta.titel}</p>
          <div className="mt-4">
            <ButtonLink to={r.cta.to}>{r.cta.label}</ButtonLink>
          </div>
        </div>
      </Abschnitt>
    </>
  )
}
