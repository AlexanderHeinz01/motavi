import { Check } from 'lucide-react'
import { paketText } from '../content/komponenten'
import ButtonLink from './ButtonLink'
import Icon from './Icon'

/**
 * Package card (DESIGN_BRIEF §4): normal or recommended. Recommended has a
 * 2 px --primary border, the label "Empfohlen" and the only (subtle) shadow.
 */
export default function PaketKarte({
  name,
  preis,
  preisHinweis,
  leistungen,
  cta,
  empfohlen = false,
}: {
  name: string
  preis: string
  preisHinweis?: string
  leistungen: string[]
  cta: { label: string; to: string }
  empfohlen?: boolean
}) {
  return (
    <div
      className={`relative flex flex-col rounded-card bg-page p-6 ${
        empfohlen ? 'border-2 border-primary shadow-[0_8px_24px_rgba(10,15,30,0.08)]' : 'border border-line'
      }`}
    >
      {empfohlen && (
        <span className="t-label absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-1 text-white">
          {paketText.empfohlen}
        </span>
      )}
      <h3 className="t-h3 text-ink">{name}</h3>
      <p className="mt-3 font-mono text-[32px] font-medium leading-none text-ink">{preis}</p>
      {preisHinweis && <p className="mt-1 font-body text-[13px] text-ink-muted">{preisHinweis}</p>}
      <ul className="t-body mt-5 space-y-2 text-ink">
        {leistungen.map((l) => (
          <li key={l} className="flex gap-2">
            <span className="mt-1 text-gain-ink">
              <Icon icon={Check} size={16} />
            </span>
            {l}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <ButtonLink to={cta.to} variant={empfohlen ? 'primary' : 'secondary'} className="w-full">
          {cta.label}
        </ButtonLink>
      </div>
    </div>
  )
}
