import { entwuerfe } from '../../../content/heroEntwuerfe'
import { EntwurfHinweis, HeroText, MessZeichnung, WerteListe } from '../../design/heroParts'

/** D0 draft A "Datenblatt": text left, technical drawing right, values as a spec table. */
export default function HeroAPage() {
  return (
    <>
      <EntwurfHinweis name={entwuerfe.a.name} note={entwuerfe.a.note} />
      <section className="site-container site-section">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <HeroText headlineClass="t-h1" />
          </div>
          <figure className="lg:col-span-6">
            <div className="overflow-hidden rounded-card border border-line">
              <MessZeichnung />
            </div>
            <figcaption className="mt-4">
              <WerteListe />
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
