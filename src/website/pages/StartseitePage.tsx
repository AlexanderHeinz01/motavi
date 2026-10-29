import { site } from '../../content/site'
import { startseite } from '../../content/startseite'
import ButtonLink from '../../ui/ButtonLink'
import BetriebsratHinweis from '../layout/BetriebsratHinweis'
import PlaceholderBlock from '../layout/PlaceholderBlock'

export default function StartseitePage() {
  return (
    <>
      <section className="site-container site-section">
        <div className="max-w-[900px]">
          <h1 className="t-display text-ink">{startseite.headline}</h1>
          <p className="t-body-lg mt-6 max-w-[760px] text-ink-muted">{startseite.subline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={startseite.primaryCta.to}>{startseite.primaryCta.label}</ButtonLink>
            <ButtonLink to={startseite.secondaryCta.to} variant="secondary">
              {startseite.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="bg-page-subtle">
        <div className="site-container site-section">
          <p className="t-h2 text-ink">{site.leitsatz}</p>
          <div className="mt-10 max-w-[800px]">
            <PlaceholderBlock planned={startseite.planned} phase={startseite.phase} />
          </div>
          <div className="mt-8 max-w-[800px]">
            <BetriebsratHinweis />
          </div>
        </div>
      </section>
    </>
  )
}
