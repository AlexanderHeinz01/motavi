/**
 * Building blocks of the perspective pages /kapazitaet, /automatisierung,
 * /gesundheit (DESIGN_BRIEF §5): same structure, own colour in the label,
 * at the end the compact decision path with the note that all three
 * perspectives come from the same measurement.
 */
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { perspektiven } from '../../../content/perspektiven'
import type { Accent } from '../../../content/types'
import { EntscheidungswegKompakt } from '../../../ui/Entscheidungsweg'
import Icon from '../../../ui/Icon'
import KategorieLabel from '../../../ui/KategorieLabel'
import BetriebsratHinweis from '../../layout/BetriebsratHinweis'

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex min-h-[44px] items-center gap-1.5 font-body text-[15px] font-medium text-primary underline-offset-4 is-hover:underline">
      {children}
      <Icon icon={ArrowRight} size={16} />
    </Link>
  )
}

/** Section with category label, H2, optional introduction and content. */
export function Abschnitt({
  id,
  label,
  accent = 'data-ink',
  titel,
  intro,
  hintergrund = 'weiss',
  children,
  extra,
}: {
  id?: string
  label: string
  accent?: Accent
  titel: string
  intro?: string
  hintergrund?: 'weiss' | 'subtil'
  children?: ReactNode
  /** e.g. the label Pilotphase next to the category label */
  extra?: ReactNode
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${hintergrund === 'subtil' ? 'bg-page-subtle' : 'border-t border-line'}`}>
      <div className="site-container site-section">
        <div className="max-w-[800px]">
          <div className="flex flex-wrap items-center gap-3">
            <KategorieLabel accent={accent}>{label}</KategorieLabel>
            {extra}
          </div>
          <h2 className="t-h2 mt-4 text-ink">{titel}</h2>
          {intro && <p className="t-body-lg mt-4 text-ink-muted">{intro}</p>}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}

/** Paragraphs in a reading column. */
export function Absaetze({ absaetze }: { absaetze: string[] }) {
  return (
    <div className="max-w-[720px] space-y-4">
      {absaetze.map((a) => (
        <p key={a} className="t-body-lg text-ink">
          {a}
        </p>
      ))}
    </div>
  )
}

/** Points with a short title, two columns on desktop. */
export function Punkte({ punkte }: { punkte: { titel: string; text: string }[] }) {
  return (
    <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
      {punkte.map((p) => (
        <div key={p.titel} className="border-l-2 border-ink pl-4">
          <dt className="font-body text-[17px] font-medium text-ink">{p.titel}</dt>
          <dd className="t-body mt-1 text-ink-muted">{p.text}</dd>
        </div>
      ))}
    </dl>
  )
}

/** End of every perspective page. */
export function PerspektivAbschluss({ aktuell, betriebsrat = true }: { aktuell: string; betriebsrat?: boolean }) {
  const a = perspektiven.abschluss
  return (
    <section className="bg-page-subtle">
      <div className="site-container site-section">
        <div className="max-w-[800px]">
          <KategorieLabel>{a.label}</KategorieLabel>
          <h2 className="t-h2 mt-4 text-ink">{a.titel}</h2>
          <p className="t-body-lg mt-4 text-ink-muted">{a.text}</p>
        </div>
        <div className="mt-8">
          <EntscheidungswegKompakt />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <TextLink to={a.steckbrief.to}>{a.steckbrief.label}</TextLink>
          <span className="font-body text-[15px] text-ink-muted">{a.weitere}</span>
          {perspektiven.seiten
            .filter((s) => s.id !== aktuell)
            .map((s) => (
              <TextLink key={s.id} to={s.to}>
                {s.label}
              </TextLink>
            ))}
        </div>
        {betriebsrat && (
          <div className="mt-8 max-w-[800px]">
            <BetriebsratHinweis />
          </div>
        )}
      </div>
    </section>
  )
}
