import { startseite } from '../../content/startseite'
import BetriebsratHinweis from '../layout/BetriebsratHinweis'
import PlaceholderBlock from '../layout/PlaceholderBlock'
import EntscheidungSection from '../sections/startseite/EntscheidungSection'
import StartHero from '../sections/startseite/StartHero'

export default function StartseitePage() {
  return (
    <>
      <StartHero />
      <EntscheidungSection />
      <section className="bg-page-subtle">
        <div className="site-container site-section">
          <div className="max-w-[800px]">
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
