import { soFunktionierts as s } from '../../content/soFunktionierts'
import KategorieLabel from '../../ui/KategorieLabel'
import PageHeader from '../layout/PageHeader'
import { Abschnitt, Punkte, TextLink } from '../sections/perspektive/Perspektive'

/** /so-funktionierts (WEBSITE_PLAN Phase 5): the four steps in detail, step 03 emphasised. */
export default function SoFunktioniertsPage() {
  return (
    <>
      <div className="site-container site-section">
        <PageHeader label={s.label} accent={s.accent} title={s.title} intro={s.intro} />
        <ol className="mt-12 space-y-6">
          {s.schritte.map((st) => (
            <li
              key={st.nr}
              className={`grid gap-6 rounded-card p-6 md:grid-cols-12 md:p-8 ${st.betont ? 'border-2 border-ink bg-page-subtle' : 'border border-line bg-page'}`}
            >
              <div className="md:col-span-5">
                <span className={`font-mono text-[40px] font-medium leading-none ${st.betont ? 'text-ink' : 'text-ink-muted'}`}>{st.nr}</span>
                <h2 className="t-h3 mt-4 text-ink">{st.titel}</h2>
                {st.paket && <p className="t-label mt-2 text-ink-muted">{st.paket}</p>}
                <p className="t-body mt-2 text-ink-muted">{st.text}</p>
                {st.pilot && (
                  <div className="mt-4">
                    <KategorieLabel accent="warn-ink">{s.pilotLabel}</KategorieLabel>
                    <p className="mt-1 font-body text-[14px] text-ink-muted">{s.pilotHinweis}</p>
                  </div>
                )}
                {st.betont && <p className="t-label mt-4 text-ink">{s.betontHinweis}</p>}
              </div>
              <ul className="space-y-2 md:col-span-7">
                {st.details.map((d) => (
                  <li key={d} className="t-body border-l-2 border-line pl-4 text-ink">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      <Abschnitt label={s.ihreAngaben.label} titel={s.ihreAngaben.titel} intro={s.ihreAngaben.intro} hintergrund="subtil">
        <Punkte punkte={s.ihreAngaben.punkte} />
        <div className="mt-8 flex flex-wrap gap-x-6">
          {s.links.map((l) => (
            <TextLink key={l.to} to={l.to}>
              {l.label}
            </TextLink>
          ))}
        </div>
      </Abschnitt>
    </>
  )
}
