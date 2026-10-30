import { useState } from 'react'
import { kapazitaet as text } from '../content/kapazitaet'
import { euro, zahl } from '../lib/format'
import { kapazitaet, STANDARD_EINGABEN, STUNDEN_JE_VOLLZEITSTELLE, type KapazitaetEingaben } from '../lib/kapazitaet'
import ButtonLink from './ButtonLink'
import Schieberegler from './form/Schieberegler'
import RechnerPanel from './RechnerPanel'

const t = text.rechner

type Feld = keyof KapazitaetEingaben
const BEREICH: Record<Feld, { min: number; max: number; step: number }> = {
  arbeitsplaetze: { min: 1, max: 100, step: 1 },
  nwsMinuten: { min: 0, max: 240, step: 5 },
  vermeidbarProzent: { min: 0, max: 100, step: 5 },
  schichtenProTag: { min: 1, max: 3, step: 1 },
  arbeitstageProJahr: { min: 100, max: 365, step: 5 },
  stundensatz: { min: 20, max: 150, step: 1 },
}
const VOLL: Feld[] = ['arbeitsplaetze', 'nwsMinuten', 'vermeidbarProzent', 'schichtenProTag', 'arbeitstageProJahr', 'stundensatz']
const MINI: Feld[] = ['arbeitsplaetze', 'nwsMinuten', 'vermeidbarProzent']

/**
 * ROI calculator (WEBSITE_PLAN §4.1). "voll" on /kapazitaet with all six
 * inputs, "mini" on the start page with three, the rest fixed at the defaults.
 */
export default function KapazitaetsRechner({ variante = 'voll' }: { variante?: 'voll' | 'mini' }) {
  const [e, setE] = useState<KapazitaetEingaben>(STANDARD_EINGABEN)
  const r = kapazitaet(e)
  const felder = variante === 'voll' ? VOLL : MINI
  return (
    <RechnerPanel
      titel={t.ergebnisTitel}
      hinweis={`${t.pflichthinweis} ${t.vollzeitHinweis(zahl(STUNDEN_JE_VOLLZEITSTELLE))}`}
      klebend={variante === 'voll'}
      ergebnisse={[
        { label: t.ergebnisse.stunden.label, value: zahl(r.stundenJahr), unit: t.ergebnisse.stunden.unit, accent: 'gain-ink' },
        { label: t.ergebnisse.euro.label, value: euro(r.euroJahr), unit: t.ergebnisse.euro.unit, accent: 'gain-ink' },
        { label: t.ergebnisse.vollzeit.label, value: zahl(r.vollzeitstellen, 1), unit: t.ergebnisse.vollzeit.unit, accent: 'gain-ink' },
      ]}
      eingaben={
        <>
          {felder.map((f) => (
            <Schieberegler
              key={f}
              label={t.felder[f].label}
              einheit={t.felder[f].einheit || undefined}
              {...BEREICH[f]}
              value={e[f]}
              format={(v) => zahl(v)}
              onChange={(v) => setE({ ...e, [f]: v })}
            />
          ))}
          {variante === 'mini' && (
            <>
              <p className="t-body text-ink-muted">
                {t.mini.fest(STANDARD_EINGABEN.schichtenProTag, STANDARD_EINGABEN.arbeitstageProJahr, STANDARD_EINGABEN.stundensatz)}
              </p>
              <div>
                <ButtonLink to={t.mini.link.to} variant="secondary">
                  {t.mini.link.label}
                </ButtonLink>
              </div>
            </>
          )}
        </>
      }
    />
  )
}
