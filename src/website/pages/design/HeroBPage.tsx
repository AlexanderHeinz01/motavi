import { entscheidung, entwuerfe } from '../../../content/heroEntwuerfe'
import { site } from '../../../content/site'
import EmpfehlungsLabel from '../../../ui/EmpfehlungsLabel'
import { EntwurfHinweis, HeroText, MessZeichnung, WerteListe } from '../../design/heroParts'

/** Branch lines from the measurement to the three equal outputs (desktop). */
function Weiche() {
  return (
    <svg viewBox="0 0 80 300" preserveAspectRatio="none" className="hidden h-full w-20 lg:block" aria-hidden="true">
      <g fill="none" stroke="var(--text-muted)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
        <path d="M0 150H30" />
        <path d="M30 150C46 150 46 50 62 50H80" />
        <path d="M30 150H80" />
        <path d="M30 150C46 150 46 250 62 250H80" />
      </g>
      <circle cx="30" cy="150" r="3.5" fill="var(--text)" />
    </svg>
  )
}

/** D0 draft B "Entscheidungsweg": one measurement splits into three equal paths. */
export default function HeroBPage() {
  return (
    <>
      <EntwurfHinweis name={entwuerfe.b.name} note={entwuerfe.b.note} />
      <section className="site-container site-section">
        <HeroText align="center" />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_auto_minmax(0,6fr)] lg:gap-0">
          {/* The measurement */}
          <div className="rounded-card border border-line p-5">
            <p className="t-label text-ink">{entscheidung.messung}</p>
            <p className="font-body text-[14px] text-ink-muted">{entscheidung.messungText}</p>
            <div className="mx-auto mt-3 max-w-[340px]">
              <MessZeichnung annotated={false} />
            </div>
            <div className="mt-3">
              <WerteListe />
            </div>
          </div>

          {/* Branch: lines on desktop, arrow on mobile */}
          <Weiche />
          <div className="flex justify-center lg:hidden" aria-hidden="true">
            <svg width="16" height="28" viewBox="0 0 16 28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1v25M2 20l6 6 6-6" />
            </svg>
          </div>

          {/* Three equal outputs */}
          <ul className="grid gap-4 lg:grid-rows-3">
            {entscheidung.wege.map((weg) => (
              <li key={weg.path} className="flex flex-col justify-center gap-3 rounded-card border border-line p-5">
                <span className="text-ink">
                  <EmpfehlungsLabel path={weg.path} size="lg" />
                </span>
                <p className="t-body text-ink-muted">{weg.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="t-h3 mt-12 text-center text-ink">{site.leitsatz}</p>
      </section>
    </>
  )
}
