import { Check, Minus } from 'lucide-react'
import { paketText } from '../content/komponenten'
import Icon from './Icon'

type Wert = string | boolean

/** Text alternative for yes/no cells (screen readers). */
const ja = paketText.enthalten
const nein = paketText.nichtEnthalten

function Zelle({ wert }: { wert: Wert }) {
  if (wert === true)
    return (
      <span className="inline-flex text-gain-ink">
        <Icon icon={Check} size={18} />
        <span className="sr-only">{ja}</span>
      </span>
    )
  if (wert === false)
    return (
      <span className="inline-flex text-ink-muted">
        <Icon icon={Minus} size={18} />
        <span className="sr-only">{nein}</span>
      </span>
    )
  return <span>{wert}</span>
}

/** Package comparison (DESIGN_BRIEF §4): table on desktop, cards on mobile. */
export default function Vergleichstabelle({
  caption,
  pakete,
  zeilen,
}: {
  caption: string
  pakete: { name: string; empfohlen?: boolean }[]
  zeilen: { label: string; werte: Wert[] }[]
}) {
  return (
    <div>
      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-card border border-line md:block">
        <table className="w-full border-collapse font-body text-[15px] text-ink">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-page-subtle">
              <th scope="col" className="p-4 text-left font-medium text-ink-muted" />
              {pakete.map((p) => (
                <th key={p.name} scope="col" className="p-4 text-left">
                  <span className="t-h3 block text-ink">{p.name}</span>
                  {p.empfohlen && <span className="t-label text-primary">{paketText.empfohlen}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((z) => (
              <tr key={z.label} className="border-t border-line">
                <th scope="row" className="p-4 text-left font-normal text-ink-muted">
                  {z.label}
                </th>
                {z.werte.map((w, i) => (
                  <td key={pakete[i].name} className={`p-4 ${pakete[i].empfohlen ? 'bg-primary-soft' : ''}`}>
                    <Zelle wert={w} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: one card per package */}
      <div className="grid gap-4 md:hidden">
        {pakete.map((p, i) => (
          <section
            key={p.name}
            aria-label={p.name}
            className={`rounded-card bg-page p-5 ${p.empfohlen ? 'border-2 border-primary' : 'border border-line'}`}
          >
            <h3 className="t-h3 text-ink">{p.name}</h3>
            {p.empfohlen && <p className="t-label text-primary">{paketText.empfohlen}</p>}
            <dl className="mt-3 divide-y divide-line">
              {zeilen.map((z) => (
                <div key={z.label} className="flex items-center justify-between gap-4 py-2 font-body text-[15px]">
                  <dt className="text-ink-muted">{z.label}</dt>
                  <dd className="text-right text-ink">
                    <Zelle wert={z.werte[i]} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
}
