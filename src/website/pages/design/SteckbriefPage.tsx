import { steckbriefEntwurf } from '../../../content/heroEntwuerfe'
import { demoSteckbriefe } from '../../../content/demo/steckbriefe'
import DashboardVorschau from '../../../ui/DashboardVorschau'
import EmpfehlungsLabel from '../../../ui/EmpfehlungsLabel'
import KategorieLabel from '../../../ui/KategorieLabel'
import SteckbriefVorschau, { SteckbriefUmschalter } from '../../../ui/SteckbriefVorschau'
import { EntwurfHinweis } from '../../design/heroParts'

const s = steckbriefEntwurf

/** D2b review page: Steckbrief preview light and dark, four recommendations side by side. */
export default function SteckbriefPage() {
  return (
    <>
      <EntwurfHinweis name={s.name} note={s.note} />
      <div className="site-container site-section space-y-16">
        <section data-shot="hell">
          <KategorieLabel accent="data-ink">{s.hell}</KategorieLabel>
          <div className="mt-6">
            <SteckbriefUmschalter />
          </div>
        </section>

        <section data-shot="dunkel">
          <KategorieLabel accent="data-ink">{s.dunkel}</KategorieLabel>
          <div className="mt-6">
            <DashboardVorschau>
              <SteckbriefUmschalter theme="dunkel" />
            </DashboardVorschau>
          </div>
        </section>

        <section data-shot="labels">
          <KategorieLabel accent="data-ink">{s.labels}</KategorieLabel>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {(['hell', 'dunkel'] as const).map((theme) => (
              <div
                key={theme}
                className={`space-y-4 rounded-card border border-line bg-page p-6 ${theme === 'dunkel' ? 'surface-inverse' : ''}`}
              >
                {(['kraeftig', 'ruhig'] as const).map((v) => (
                  <div key={v} className="flex flex-wrap items-center gap-3">
                    {demoSteckbriefe.map((d) => (
                      <EmpfehlungsLabel key={d.path} path={d.path} variant={v} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {(['hell', 'dunkel'] as const).map((theme) => (
          <section key={theme} data-shot={`vergleich-${theme}`}>
            <KategorieLabel accent="data-ink">{theme === 'hell' ? s.vergleich : s.vergleichDunkel}</KategorieLabel>
            <div className={`mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4 ${theme === 'dunkel' ? 'surface-inverse rounded-card bg-page p-4' : ''}`}>
              {demoSteckbriefe.map((d) => (
                <SteckbriefVorschau key={d.path} data={d.data} path={d.path} variante="kompakt" theme={theme} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
