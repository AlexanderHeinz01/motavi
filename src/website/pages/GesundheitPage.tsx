import { gesundheit as g } from '../../content/gesundheit'
import { platzhalterText } from '../../content/rechtliches'
import { steckbrief } from '../../content/steckbrief'
import { zahl } from '../../lib/format'
import { config } from '../../lib/scoring'
import Hinweisbox from '../../ui/Hinweisbox'
import KategorieLabel from '../../ui/KategorieLabel'
import KpiKachel from '../../ui/KpiKachel'
import PageHeader from '../layout/PageHeader'
import { Absaetze, Abschnitt, PerspektivAbschluss, Punkte } from '../sections/perspektive/Perspektive'

/** /gesundheit (WEBSITE_PLAN Phase 4). */
export default function GesundheitPage() {
  return (
    <>
      <div className="site-container site-section pb-0">
        <PageHeader label={g.label} accent={g.accent} title={g.title} intro={g.intro} />
      </div>
      <Abschnitt label={g.reba.label} accent={g.accent} titel={g.reba.titel}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Absaetze absaetze={g.reba.absaetze} />
            <div className="mt-4 max-w-[720px]">
              <KategorieLabel accent="warn-ink">{steckbrief.pilotLabel}</KategorieLabel>
              <p className="t-body mt-1 text-ink-muted">{g.reba.pilotHinweis}</p>
              <p className="t-body mt-3 text-ink-muted">{g.reba.drehung}</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <table className="w-full border-collapse font-body text-[15px] text-ink">
              <caption className="t-label pb-2 text-left text-ink-muted">{g.reba.stufenTitel}</caption>
              <tbody>
                {g.reba.stufen.map((s) => (
                  <tr key={s.bereich} className="border-b border-line">
                    <td className="py-2.5 font-mono">{s.bereich}</td>
                    <td className="py-2.5 text-right">{s.stufe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-body mt-4 text-ink-muted">{g.reba.vorrang(zahl(config.vorrang.reba_mittel_ab))}</p>
          </div>
        </div>
      </Abschnitt>
      <Abschnitt label={g.lmm.label} accent={g.accent} titel={g.lmm.titel} hintergrund="subtil">
        <Absaetze absaetze={g.lmm.absaetze} />
      </Abschnitt>
      <Abschnitt label={g.csrd.label} titel={g.csrd.titel}>
        <Absaetze absaetze={g.csrd.absaetze} />
        <div className="mt-8 max-w-[640px]">
          <Hinweisbox>{g.csrd.hinweis}</Hinweisbox>
        </div>
      </Abschnitt>
      <Abschnitt label={g.fehltage.label} accent={g.accent} titel={g.fehltage.titel} hintergrund="subtil">
        <Absaetze absaetze={[g.fehltage.text]} />
        <div className="mt-8 max-w-[520px]">
          {g.fehltage.kennzahl.wert ? (
            <KpiKachel value={g.fehltage.kennzahl.wert} description={g.fehltage.kennzahl.beschreibung} source={g.fehltage.kennzahl.quelle} accent="risk-ink" />
          ) : (
            <p className="rounded-card border border-dashed border-line-strong bg-page px-4 py-3 font-body text-[15px] text-ink-muted">
              <span className="t-label mr-2 text-ink">{platzhalterText.marke}</span>
              {g.fehltage.kennzahl.beschreibung}. {g.fehltage.kennzahl.platzhalter} {g.fehltage.kennzahl.quelle}
            </p>
          )}
        </div>
      </Abschnitt>
      <Abschnitt label={g.massnahmen.label} accent="path-improve" titel={g.massnahmen.titel}>
        <Punkte punkte={g.massnahmen.punkte} />
      </Abschnitt>
      <PerspektivAbschluss aktuell="gesundheit" />
    </>
  )
}
