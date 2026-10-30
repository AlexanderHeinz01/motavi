import { useId, type ReactNode } from 'react'
import { beispielHinweis, entwuerfe, heroWerte, zeichnung } from '../../../content/heroEntwuerfe'
import { startseite } from '../../../content/startseite'
import ButtonLink from '../../../ui/ButtonLink'
import KategorieLabel from '../../../ui/KategorieLabel'
import { AngleArc, DimensionLine, FloorBin, GridPaper } from '../../../visuals/drawing'
import Skeleton from '../../../visuals/skeleton/Skeleton'
import { bendPose } from '../../../visuals/skeleton/pose'
import { EntwurfHinweis } from '../../design/heroParts'

/** Zeit: the hand trajectory repeating, one cycle measured. */
function ZeitGlyph() {
  const loops = [0, 70, 140]
  return (
    <svg viewBox="0 0 240 110" className="h-auto w-full" aria-hidden="true">
      <line x1="10" y1="96" x2="230" y2="96" stroke="var(--text-muted)" strokeWidth="1" />
      {loops.map((dx, i) => (
        <path
          key={dx}
          d={`M${20 + dx} 90C${30 + dx} 48 ${70 + dx} 48 ${80 + dx} 90`}
          fill="none"
          stroke="var(--data-ink)"
          strokeWidth="1.5"
          strokeDasharray={i === 0 ? undefined : '1 5'}
          strokeLinecap="round"
        />
      ))}
      <DimensionLine x1={20} x2={80} y={30} label={zeichnung.zykluszeitKurz} />
    </svg>
  )
}

/** Kosten: share of the shift spent in non-value-adding movement. */
function KostenGlyph() {
  const hatch = `hatch-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 240 110" className="h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--gain-ink)" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect x="10" y="48" width="220" height="26" rx="2" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
      <rect x="10" y="48" width="168" height="26" rx="2" fill="var(--bg-subtle)" stroke="var(--text-muted)" strokeWidth="1" />
      <rect x="178" y="48" width="52" height="26" fill={`url(#${hatch})`} stroke="var(--gain-ink)" strokeWidth="1.5" />
      <DimensionLine x1={178} x2={230} y={30} label={zeichnung.potenzial} />
      <text
        x="10"
        y="94"
        fill="var(--text-muted)"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {zeichnung.schicht}
      </text>
    </svg>
  )
}

/** Belastung: bending to a low bin, trunk angle measured. */
function BelastungGlyph() {
  const grid = `grid-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="100 96 240 214" className="h-auto w-full" aria-hidden="true">
      <GridPaper id={grid} />
      <FloorBin />
      <Skeleton pose={bendPose} />
      <AngleArc cx={155} cy={179} r={42} from={-90} to={-39} label={zeichnung.rumpfwinkel} />
    </svg>
  )
}

function Messwert({ index, children }: { index: number; children: ReactNode }) {
  const w = heroWerte[index]
  return (
    <div className="flex flex-col rounded-card border border-line bg-page p-6">
      {/* Same height for all glyphs, so the three values line up */}
      <div className="mb-6 flex h-44 items-center justify-center [&>svg]:h-full [&>svg]:w-full">{children}</div>
      <KategorieLabel accent={w.accent}>{w.label}</KategorieLabel>
      <p className="t-kpi mt-2 text-ink">{w.value}</p>
      <p className="t-body mt-1 text-ink-muted">{w.unit}</p>
    </div>
  )
}

/** D0 draft C "Messwerte": short head, three large measured values as heroes. */
export default function HeroCPage() {
  return (
    <>
      <EntwurfHinweis name={entwuerfe.c.name} note={entwuerfe.c.note} />
      <section className="site-container pt-16 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="t-h1 text-ink lg:col-span-7">{startseite.headline}</h1>
          <div className="lg:col-span-5">
            <p className="t-body-lg text-ink-muted">{startseite.subline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to={startseite.primaryCta.to}>{startseite.primaryCta.label}</ButtonLink>
              <ButtonLink to={startseite.secondaryCta.to} variant="secondary">
                {startseite.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <section
        className="mt-12 border-y border-line bg-page-subtle py-12 md:mt-16 md:py-16"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="site-container">
          <div className="grid gap-6 md:grid-cols-3">
            <Messwert index={0}>
              <ZeitGlyph />
            </Messwert>
            <Messwert index={1}>
              <KostenGlyph />
            </Messwert>
            <Messwert index={2}>
              <BelastungGlyph />
            </Messwert>
          </div>
          <p className="t-label mt-4 text-ink-muted">{beispielHinweis}</p>
        </div>
      </section>
    </>
  )
}
