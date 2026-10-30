import { steckbrief } from '../../content/steckbrief'
import BetriebsratHinweis from '../layout/BetriebsratHinweis'
import PageHeader from '../layout/PageHeader'
import AufbauSection from '../sections/steckbrief/AufbauSection'
import CheckSection from '../sections/steckbrief/CheckSection'
import EntscheidungSection from '../sections/steckbrief/EntscheidungSection'

/**
 * /arbeitsplatz-steckbrief (WEBSITE_PLAN Phase 3, DESIGN_BRIEF §5): the
 * Steckbrief with every metric explained, the decision rule as a matrix,
 * then the Arbeitsplatz-Check.
 */
export default function SteckbriefPage() {
  return (
    <>
      <div className="site-container site-section">
        <PageHeader label={steckbrief.label} accent={steckbrief.accent} title={steckbrief.title} intro={steckbrief.intro} pilot />
        <nav aria-label={steckbrief.sprungmarkenLabel} className="mt-8 flex flex-wrap gap-2">
          {steckbrief.sprungmarken.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex min-h-[44px] items-center rounded-btn border border-line px-4 font-body text-[15px] text-ink transition-colors duration-150 ease-out is-hover:border-ink-muted"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
      <AufbauSection />
      <EntscheidungSection />
      <CheckSection />
      <div className="site-container pb-16">
        <BetriebsratHinweis />
      </div>
    </>
  )
}
