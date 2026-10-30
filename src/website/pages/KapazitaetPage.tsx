import { kapazitaet as k } from '../../content/kapazitaet'
import Hinweisbox from '../../ui/Hinweisbox'
import KapazitaetsRechner from '../../ui/KapazitaetsRechner'
import KpiKachel from '../../ui/KpiKachel'
import PageHeader from '../layout/PageHeader'
import { Abschnitt, PerspektivAbschluss, Punkte } from '../sections/perspektive/Perspektive'

/** /kapazitaet (WEBSITE_PLAN Phase 4): the calculator over the full width as the main element. */
export default function KapazitaetPage() {
  const r = k.rechner
  return (
    <>
      <div className="site-container site-section pb-0">
        <PageHeader label={k.label} accent={k.accent} title={k.title} intro={k.intro} />
      </div>
      <section id={r.id} className="scroll-mt-20">
        <div className="site-container site-section">
          <h2 className="t-h2 text-ink">{r.titel}</h2>
          <p className="t-body-lg mt-4 max-w-[800px] text-ink-muted">{r.intro}</p>
          <div className="mt-10">
            <KapazitaetsRechner variante="voll" />
          </div>
          <div className="mt-8 max-w-[720px]">
            <Hinweisbox title={r.formel.titel}>
              <ul className="space-y-1">
                {r.formel.zeilen.map((z) => (
                  <li key={z}>{z}</li>
                ))}
              </ul>
            </Hinweisbox>
          </div>
        </div>
      </section>
      <Abschnitt label={k.wo.label} accent={k.accent} titel={k.wo.titel} intro={k.wo.intro} hintergrund="subtil">
        <Punkte punkte={k.wo.punkte} />
      </Abschnitt>
      <Abschnitt label={k.gestaltung.label} accent="path-improve" titel={k.gestaltung.titel} intro={k.gestaltung.intro}>
        <Punkte punkte={k.gestaltung.punkte} />
        <div className="mt-10 max-w-[520px]">
          <KpiKachel
            label={k.beispiel.label}
            accent="gain-ink"
            value={k.beispiel.wert}
            unit={k.beispiel.einheit}
            description={`${k.beispiel.titel}: ${k.beispiel.text}`}
            source={k.beispiel.quelle}
          />
        </div>
      </Abschnitt>
      <PerspektivAbschluss aktuell="kapazitaet" />
    </>
  )
}
