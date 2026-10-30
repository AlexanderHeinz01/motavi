import { ArrowDown } from 'lucide-react'
import { empfehlungen } from '../../../content/empfehlungen'
import { startseite } from '../../../content/startseite'
import ButtonLink from '../../../ui/ButtonLink'
import { PathIcon, TOKEN } from '../../../ui/EmpfehlungsLabel'
import Icon from '../../../ui/Icon'
import KategorieLabel from '../../../ui/KategorieLabel'
import SkelettAnimation from '../../../visuals/skeleton/SkelettAnimation'

const { hero } = startseite

/** The three values with their movement detail, like rows of a data sheet. */
function Datenblatt() {
  return (
    <div>
      <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {hero.werte.map((w) => (
          <div key={w.label} className="bg-page px-4 py-3">
            <dt>
              <KategorieLabel accent={w.accent}>{w.label}</KategorieLabel>
            </dt>
            <dd className="mt-1">
              <span className="block whitespace-nowrap font-mono text-[22px] font-medium leading-tight text-ink">{w.value}</span>
              <span className="mt-1 block font-body text-[13px] leading-snug text-ink-muted [hyphens:manual]">{w.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="t-label mt-2 text-ink-muted">{hero.beispielHinweis}</p>
    </div>
  )
}

/**
 * Bridge to the decision section, in the style of the quiet recommendation
 * label: light tint, 1 px border, text in --text, path colours on the icons.
 */
function Bruecke() {
  return (
    <a
      href={`#${hero.bruecke.target}`}
      className="mt-4 flex min-h-[44px] flex-col gap-1 rounded-btn border border-[var(--text-muted)] bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] px-4 py-2.5 font-body text-[15px] text-ink transition-colors duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--text-muted)_16%,transparent)]"
    >
      <span className="font-medium">{hero.bruecke.lead}</span>
      <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
        {hero.bruecke.paths.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <span className="inline-flex" style={{ color: `var(${TOKEN[p]})` }}>
              <PathIcon path={p} />
            </span>
            {empfehlungen[p]}
          </span>
        ))}
        <Icon icon={ArrowDown} size={16} className="ml-auto" />
      </span>
    </a>
  )
}

/** Start page hero (decision D0: variant A "Datenblatt" with bridge). */
export default function StartHero() {
  return (
    <section className="site-container site-section">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="t-h1 text-ink">{startseite.headline}</h1>
          <p className="t-body-lg mt-6 max-w-[620px] text-ink-muted">{startseite.subline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={startseite.primaryCta.to}>{startseite.primaryCta.label}</ButtonLink>
            <ButtonLink to={startseite.secondaryCta.to} variant="secondary">
              {startseite.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        <figure className="lg:col-span-6">
          <div className="overflow-hidden rounded-card border border-line">
            <SkelettAnimation szene="greifen" />
          </div>
          <figcaption className="mt-4">
            <Datenblatt />
            <Bruecke />
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
