/**
 * Start page sections 2 and 4 to 12 (WEBSITE_PLAN §3, DESIGN_BRIEF §5); section 3 in EntscheidungSection.tsx.
 * Texts in src/content/startseite.ts.
 */
import { ArrowRight, CalendarX, Cog, Gauge, Hourglass, Timer, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { startseite } from '../../../content/startseite'
import type { Accent } from '../../../content/types'
import { zahl } from '../../../lib/format'
import ButtonLink from '../../../ui/ButtonLink'
import EmpfehlungsLabel from '../../../ui/EmpfehlungsLabel'
import Hinweisbox from '../../../ui/Hinweisbox'
import Hochzaehler from '../../../ui/Hochzaehler'
import Icon from '../../../ui/Icon'
import KategorieLabel from '../../../ui/KategorieLabel'
import NutzenKarte, { NutzenKarten } from '../../../ui/NutzenKarte'
import PaketKarte from '../../../ui/PaketKarte'
import Partnerhinweis from '../../../ui/Partnerhinweis'
import KapazitaetsRechner from '../../../ui/KapazitaetsRechner'
import { SteckbriefUmschalter } from '../../../ui/SteckbriefVorschau'

const ICONS: Record<string, LucideIcon> = { hourglass: Hourglass, cog: Cog, calendar: CalendarX, timer: Timer, gauge: Gauge }

/** Category label, H2 and optional introduction, max. 8 columns wide. */
function Kopf({ label, accent = 'data-ink', title, intro }: { label: string; accent?: Accent; title: string; intro?: string }) {
  return (
    <div className="max-w-[800px]">
      <KategorieLabel accent={accent}>{label}</KategorieLabel>
      <h2 className="t-h2 mt-4 text-ink">{title}</h2>
      {intro && <p className="t-body-lg mt-4 text-ink-muted">{intro}</p>}
    </div>
  )
}

function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex min-h-[44px] items-center gap-1.5 font-body text-[15px] font-medium text-primary underline-offset-4 is-hover:underline">
      {children}
      <Icon icon={ArrowRight} size={16} />
    </Link>
  )
}

export function ProblemSection() {
  const p = startseite.problem
  return (
    <section className="bg-page-subtle">
      <div className="site-container site-section">
        <Kopf label={p.label} accent="warn-ink" title={p.title} />
        <div className="mt-12">
          <NutzenKarten>
            {p.karten.map((k) => (
              <NutzenKarte key={k.title} icon={ICONS[k.icon]} title={k.title} text={k.text} />
            ))}
          </NutzenKarten>
        </div>
      </div>
    </section>
  )
}

/** The visual high point: dark, full width, switcher between the four examples. */
export function BeispielSteckbriefSection() {
  const b = startseite.beispiel
  return (
    <section id={b.id} className="surface-inverse scroll-mt-20 bg-page text-ink">
      <div className="site-container site-section">
        <Kopf label={b.label} title={b.title} intro={b.intro} />
        <div className="mt-12">
          <SteckbriefUmschalter theme="dunkel" />
        </div>
        <div className="mt-6">
          <Link
            to={b.link.to}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-body text-[15px] font-medium text-ink underline underline-offset-4 is-hover:text-ink-muted"
          >
            {b.link.label}
            <Icon icon={ArrowRight} size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Proof: a case where the answer was "Verbessern"; very large numbers. */
export function BeweisSection() {
  const b = startseite.beweis
  return (
    <section>
      <div className="site-container site-section">
        <Kopf label={b.label} accent="path-improve" title={b.title} intro={b.intro} />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="t-label text-ink-muted">{b.empfehlung}</span>
          <EmpfehlungsLabel path={b.path} variant="kraeftig" size="lg" />
        </div>
        <dl className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
          {b.zahlen.map((z) => (
            <div key={z.einheit}>
              <dt className="sr-only">{z.einheit}</dt>
              <dd>
                <p className="flex flex-wrap items-baseline gap-x-4">
                  <span className="font-mono text-[64px] font-medium leading-none text-ink md:text-[96px]">
                    <Hochzaehler wert={z.wert} format={(v) => zahl(Math.round(v))} />
                  </span>
                  <span className="t-h3" style={{ color: `var(--${z.accent})` }}>
                    {z.einheit}
                  </span>
                </p>
                <p className="t-body-lg mt-3 max-w-[420px] text-ink">{z.text}</p>
              </dd>
            </div>
          ))}
        </dl>
        <p className="t-h3 mt-10 text-ink">{b.botschaft}</p>
        <div className="mt-6 max-w-[640px]">
          <Hinweisbox title={b.methodeTitel}>{b.methode}</Hinweisbox>
        </div>
      </div>
    </section>
  )
}

export function PerspektivenSection() {
  const p = startseite.perspektiven
  const accents: Accent[] = ['gain-ink', 'path-automate', 'risk-ink']
  return (
    <section className="bg-page-subtle">
      <div className="site-container site-section">
        <Kopf label={p.label} title={p.title} />
        <div className="mt-12">
          <NutzenKarten>
            {p.karten.map((k, i) => (
              <NutzenKarte key={k.title} icon={ICONS[k.icon]} title={k.title} text={k.text} link={k.link} accent={accents[i]} />
            ))}
          </NutzenKarten>
        </div>
      </div>
    </section>
  )
}

/** Mini version of the calculator (WEBSITE_PLAN §4.1): three sliders, the rest fixed. */
export function RechnerTeaser() {
  const r = startseite.rechner
  return (
    <section>
      <div className="site-container site-section">
        <Kopf label={r.label} accent="gain-ink" title={r.title} intro={r.intro} />
        <div className="mt-12">
          <KapazitaetsRechner variante="mini" />
        </div>
      </div>
    </section>
  )
}

/** Four steps; step 03 "Experte bewertet" is emphasised. */
export function AblaufSection() {
  const a = startseite.ablauf
  return (
    <section className="border-t border-line">
      <div className="site-container site-section">
        <Kopf label={a.label} title={a.title} />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {a.schritte.map((s) => (
            <li
              key={s.nr}
              className={`flex flex-col rounded-card p-6 ${s.betont ? 'border-2 border-ink bg-page-subtle' : 'border border-line bg-page'}`}
            >
              <span className={`font-mono text-[32px] font-medium leading-none ${s.betont ? 'text-ink' : 'text-ink-muted'}`}>{s.nr}</span>
              <h3 className="t-h3 mt-4 text-ink">{s.title}</h3>
              <p className="t-body mt-2 text-ink-muted">{s.text}</p>
              {'pilot' in s && s.pilot && (
                <div className="mt-auto pt-4">
                  <KategorieLabel accent="warn-ink">{a.pilotLabel}</KategorieLabel>
                </div>
              )}
              {s.betont && <p className="t-label mt-auto pt-4 text-ink">{a.betontHinweis}</p>}
            </li>
          ))}
        </ol>
        <p className="t-body mt-6 max-w-[720px] text-ink-muted">
          <span className="font-medium text-ink">{a.pilotLabel}:</span> {a.pilotHinweis}
        </p>
        <div className="mt-4">
          <TextLink to={a.link.to}>{a.link.label}</TextLink>
        </div>
      </div>
    </section>
  )
}

/**
 * Vendor neutral. The small link to /fuer-robotik-anbieter stays out until
 * providers confirm interest (WEBSITE_PLAN §7.1).
 */
export function NeutralSection() {
  const n = startseite.neutral
  return (
    <section className="bg-primary-soft">
      <div className="site-container site-section">
        <p className="t-h1 max-w-[900px] text-ink">{n.satz}</p>
        <div className="mt-8">
          <Partnerhinweis />
        </div>
      </div>
    </section>
  )
}

/** Works council: promise left, proof right. */
export function BetriebsratSection() {
  const b = startseite.betriebsrat
  return (
    <section className="bg-page-subtle">
      <div className="site-container site-section">
        <Kopf label={b.label} title={b.title} />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="t-label text-ink-muted">{b.versprechenTitel}</h3>
            <ul className="mt-4 space-y-4">
              {b.versprechen.map((v) => (
                <li key={v} className="t-body-lg border-l-2 border-ink pl-4 text-ink">
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="t-label text-ink-muted">{b.nachweisTitel}</h3>
            <dl className="mt-4">
              {b.nachweis.map((n) => (
                <div key={n.title} className="border-b border-line py-3 first:pt-0">
                  <dt className="font-body text-[16px] font-medium text-ink">{n.title}</dt>
                  <dd className="t-body mt-1 text-ink-muted">{n.text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <TextLink to={b.link.to}>{b.link.label}</TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PaketeSection() {
  const p = startseite.pakete
  return (
    <section>
      <div className="site-container site-section">
        <Kopf label={p.label} title={p.title} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
          {p.karten.map((k) => (
            <PaketKarte key={k.name} {...k} />
          ))}
        </div>
        <div className="mt-6">
          <TextLink to={p.link.to}>{p.link.label}</TextLink>
        </div>
      </div>
    </section>
  )
}

export function AbschlussSection() {
  const a = startseite.abschluss
  return (
    <section className="surface-inverse border-b border-line bg-page text-ink">
      <div className="site-container site-section text-center">
        <p className="t-h2 mx-auto max-w-[760px]">{a.satz}</p>
        <div className="mt-8">
          <ButtonLink to={a.cta.to}>{a.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  )
}
