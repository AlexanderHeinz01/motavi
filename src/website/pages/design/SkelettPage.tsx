import { skelettEntwurf } from '../../../content/heroEntwuerfe'
import KategorieLabel from '../../../ui/KategorieLabel'
import SkelettAnimation from '../../../visuals/skeleton/SkelettAnimation'
import SkelettTrenner from '../../../visuals/skeleton/SkelettTrenner'
import { EntwurfHinweis } from '../../design/heroParts'

const s = skelettEntwurf

/** D2 review page: both movements live, three fixed points in time each, static divider. */
export default function SkelettPage() {
  return (
    <>
      <EntwurfHinweis name={s.name} note={s.note} />
      <div className="site-container site-section space-y-16">
        {(['greifen', 'buecken'] as const).map((szene) => (
          <section key={szene}>
            <KategorieLabel accent="data-ink">{s.szenen[szene]}</KategorieLabel>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <figure>
                <div className="overflow-hidden rounded-card border border-line">
                  <SkelettAnimation szene={szene} />
                </div>
                <figcaption className="t-label mt-2 text-ink-muted">{s.live}</figcaption>
              </figure>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {s.zeitpunkte.map((z) => (
                <figure key={z.sekunden} data-zeitpunkt={`${szene}-${z.sekunden}`}>
                  <div className="overflow-hidden rounded-card border border-line">
                    <SkelettAnimation szene={szene} fixeZeit={z.sekunden} />
                  </div>
                  <figcaption className="mt-2 font-body text-[14px] text-ink-muted">{z.text}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
        <section>
          <KategorieLabel accent="data-ink">{s.trenner}</KategorieLabel>
          <div className="mt-6">
            <SkelettTrenner />
          </div>
        </section>
      </div>
    </>
  )
}
