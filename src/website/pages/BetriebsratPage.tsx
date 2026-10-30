import { betriebsrat as b } from '../../content/betriebsrat'
import Hinweisbox from '../../ui/Hinweisbox'
import PageHeader from '../layout/PageHeader'
import { TextLink } from '../sections/perspektive/Perspektive'

/**
 * /betriebsrat (WEBSITE_PLAN Phase 5, DESIGN_BRIEF §5): narrow reading
 * column (max. 720 px) and a page navigation on desktop.
 */
export default function BetriebsratPage() {
  return (
    <div className="site-container site-section">
      <PageHeader label={b.label} accent={b.accent} title={b.title} intro={b.intro} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,720px)]">
        <nav aria-label={b.navLabel} className="lg:sticky lg:top-24 lg:self-start">
          <p className="t-label text-ink-muted">{b.navLabel}</p>
          <ul className="mt-3 space-y-1">
            {b.abschnitte.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`} className="inline-flex min-h-[40px] items-center font-body text-[15px] text-ink underline-offset-4 is-hover:underline">
                  {a.titel}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-[720px]">
          {b.abschnitte.map((a) => (
            <section key={a.id} id={a.id} aria-labelledby={`${a.id}-titel`} className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0">
              <h2 id={`${a.id}-titel`} className="t-h2 text-ink">
                {a.titel}
              </h2>
              {a.absaetze.map((p) => (
                <p key={p} className="t-body-lg mt-4 text-ink">
                  {p}
                </p>
              ))}
              {a.punkte.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {a.punkte.map((p) => (
                    <li key={p} className="t-body-lg border-l-2 border-ink pl-4 text-ink">
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <div className="mt-4">
            <Hinweisbox>{b.hinweis}</Hinweisbox>
          </div>
          <div className="mt-4">
            <TextLink to={b.datenschutzLink.to}>{b.datenschutzLink.label}</TextLink>
          </div>
        </article>
      </div>
    </div>
  )
}
