import { platzhalterText, type Rechtsseite } from '../../content/rechtliches'
import PageHeader from '../layout/PageHeader'

/** Legal page with marked placeholders per section (WEBSITE_PLAN Phase 6). */
export default function RechtsSeite({ inhalt }: { inhalt: Rechtsseite }) {
  return (
    <div className="site-container site-section">
      <PageHeader label={inhalt.label} accent={inhalt.accent} title={inhalt.title} intro={inhalt.intro} />
      <div className="mt-12 max-w-[720px] space-y-6">
        {inhalt.abschnitte.map((a) => (
          <section key={a} aria-label={`${a} (${platzhalterText.marke})`}>
            <h2 className="t-h3 text-ink">{a}</h2>
            <p className="mt-2 rounded-card border border-dashed border-line-strong bg-page-subtle px-4 py-3 font-body text-[15px] text-ink-muted">
              <span className="t-label mr-2 text-ink">{platzhalterText.marke}</span>
              {platzhalterText.text}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
