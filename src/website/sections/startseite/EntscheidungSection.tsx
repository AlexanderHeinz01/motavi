import { site } from '../../../content/site'
import { startseite } from '../../../content/startseite'
import Entscheidungsweg from '../../../ui/Entscheidungsweg'
import KategorieLabel from '../../../ui/KategorieLabel'
import MessZeichnung from '../../../visuals/MessZeichnung'

const { entscheidung, hero } = startseite

/** Section 3 "Eine Messung, drei Empfehlungen" with the large decision path (WEBSITE_PLAN §3, DESIGN_BRIEF §5). */
export default function EntscheidungSection() {
  return (
    <section id={entscheidung.id} className="scroll-mt-20 border-t border-line">
      <div className="site-container site-section">
        <div className="max-w-[800px]">
          <KategorieLabel accent="data-ink">{entscheidung.label}</KategorieLabel>
          <h2 className="t-h2 mt-4 text-ink">{entscheidung.title}</h2>
          <p className="t-body-lg mt-4 text-ink-muted">{entscheidung.intro}</p>
        </div>

        <div className="mt-12">
          <Entscheidungsweg
            wege={entscheidung.wege}
            messung={
              <>
                <p className="t-label text-ink">{entscheidung.messung}</p>
                <p className="mt-1 font-body text-[14px] text-ink-muted">{entscheidung.messungText}</p>
                <div className="mx-auto mt-4 w-full max-w-[320px]">
                  <MessZeichnung ariaLabel={hero.zeichnungLabel} cycleLabel={hero.zykluszeit} annotated={false} />
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {entscheidung.groessen.map((g) => (
                    <li key={g.label}>
                      <KategorieLabel accent={g.accent}>{g.label}</KategorieLabel>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </div>

        <p className="t-h3 mt-12 text-ink">{site.leitsatz}</p>
      </div>
    </section>
  )
}
