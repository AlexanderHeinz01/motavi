import { beispielHinweis, heroWerte, zeichnung } from '../../content/heroEntwuerfe'
import { startseite } from '../../content/startseite'
import ButtonLink from '../../ui/ButtonLink'
import KategorieLabel from '../../ui/KategorieLabel'
import Zeichnung from '../../visuals/MessZeichnung'

/** Headline, subline and both CTAs of the start page (WEBSITE_PLAN §1). */
export function HeroText({
  headlineClass = 't-display',
  align = 'left',
}: {
  headlineClass?: string
  align?: 'left' | 'center'
}) {
  const center = align === 'center'
  return (
    <div className={center ? 'mx-auto max-w-[960px] text-center' : ''}>
      <h1 className={`${headlineClass} text-ink`}>{startseite.headline}</h1>
      <p className={`t-body-lg mt-6 text-ink-muted ${center ? 'mx-auto max-w-[720px]' : 'max-w-[620px]'}`}>
        {startseite.subline}
      </p>
      <div className={`mt-8 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>
        <ButtonLink to={startseite.primaryCta.to}>{startseite.primaryCta.label}</ButtonLink>
        <ButtonLink to={startseite.secondaryCta.to} variant="secondary">
          {startseite.secondaryCta.label}
        </ButtonLink>
      </div>
    </div>
  )
}

/** Technical drawing used by the drafts (see src/visuals/MessZeichnung.tsx). */
export function MessZeichnung({ annotated = true }: { annotated?: boolean }) {
  return <Zeichnung ariaLabel={zeichnung.ariaLabel} cycleLabel={zeichnung.zykluszeit} annotated={annotated} />
}

/** The three values like rows of a data sheet. */
export function WerteListe({ layout = 'row' }: { layout?: 'row' | 'stack' }) {
  return (
    <div>
      <dl className={`grid gap-px overflow-hidden rounded-card border border-line bg-line ${layout === 'row' ? 'sm:grid-cols-3' : ''}`}>
        {heroWerte.map((w) => (
          <div key={w.label} className="bg-page px-4 py-3">
            <dt>
              <KategorieLabel accent={w.accent}>{w.label}</KategorieLabel>
            </dt>
            <dd className="mt-1">
              <span className="block whitespace-nowrap font-mono text-[22px] font-medium leading-tight text-ink">{w.value}</span>
              <span className="block font-body text-[14px] text-ink-muted [hyphens:manual]">{w.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="t-label mt-2 text-ink-muted">{beispielHinweis}</p>
    </div>
  )
}

/** Small marker so reviewers know which draft they are looking at. */
export function EntwurfHinweis({ name, note }: { name: string; note: string }) {
  return (
    <div className="border-b border-dashed border-line bg-page-subtle">
      <div className="site-container flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
        <p className="t-label text-ink">{name}</p>
        <p className="font-body text-[14px] text-ink-muted">{note}</p>
      </div>
    </div>
  )
}
