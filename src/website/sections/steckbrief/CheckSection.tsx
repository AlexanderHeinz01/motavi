/**
 * Arbeitsplatz-Check (WEBSITE_PLAN §4.2): eight questions, one per view; the
 * result comes from the same scores and rules as the Steckbrief
 * (src/lib/scoring.ts, config/workplace_scoring.json). Nothing is stored.
 */
import { useEffect, useRef, useState } from 'react'
import { steckbrief } from '../../../content/steckbrief'
import { checkAuswerten, checkFragen, config, type Bewertung } from '../../../lib/scoring'
import Button from '../../../ui/Button'
import ButtonLink from '../../../ui/ButtonLink'
import Fragenkarte, { FragenErgebnis } from '../../../ui/Fragenkarte'
import Hinweisbox from '../../../ui/Hinweisbox'
import KategorieLabel from '../../../ui/KategorieLabel'
import { PilotMarke } from './AufbauSection'

const t = steckbrief.check

/** Texts of a question of the configuration (by id); a missing text is a build error in the test. */
export function frageText(id: string) {
  return t.fragen[id]
}

function Ergebnis({ b, onNeu }: { b: Bewertung; onNeu: () => void }) {
  const p = b.empfehlung!
  return (
    <div className="space-y-4">
      <FragenErgebnis path={p} verbesserung={b.verbesserung.wert!} automatisierung={b.automatisierung.wert!} />
      <p className="t-body-lg text-ink">{config.empfehlung.erklaerung[p]}</p>
      {b.vorrangig && <p className="t-body border-l-2 border-risk-ink pl-4 text-ink">{t.vorrangig}</p>}
      <p className="t-body text-ink-muted">{t.selbsteinschaetzung}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <ButtonLink to={t.cta.to}>{t.cta.label}</ButtonLink>
        <Button variant="secondary" onClick={onNeu}>
          {t.neu}
        </Button>
      </div>
    </div>
  )
}

export default function CheckSection() {
  const [schritt, setSchritt] = useState(0)
  const [auswahl, setAuswahl] = useState<Record<string, number>>({})
  const [fehler, setFehler] = useState(false)
  const [ergebnis, setErgebnis] = useState<Bewertung | null>(null)
  const [interagiert, setInteragiert] = useState(false)
  const bereich = useRef<HTMLDivElement | null>(null)

  // after a step, move the focus to the new question or the result (not on page load)
  useEffect(() => {
    if (interagiert) bereich.current?.focus()
  }, [schritt, ergebnis, interagiert])

  const frage = checkFragen[schritt]
  const text = frageText(frage.id)

  const weiter = () => {
    setInteragiert(true)
    if (auswahl[frage.id] === undefined) {
      setFehler(true)
      return
    }
    setFehler(false)
    if (schritt < checkFragen.length - 1) {
      setSchritt(schritt + 1)
      return
    }
    setErgebnis(checkAuswerten(Object.fromEntries(checkFragen.map((f) => [f.id, f.antworten[auswahl[f.id]].id]))))
  }

  const neu = () => {
    setInteragiert(true)
    setAuswahl({})
    setSchritt(0)
    setFehler(false)
    setErgebnis(null)
  }

  return (
    <section id={t.id} className="scroll-mt-20 border-t border-line">
      <div className="site-container site-section">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <KategorieLabel accent="path-improve">{t.label}</KategorieLabel>
              <PilotMarke />
            </div>
            <h2 className="t-h2 mt-4 text-ink">{t.title}</h2>
            <p className="t-body-lg mt-4 text-ink-muted">{t.intro}</p>
            <div className="mt-6">
              <Hinweisbox variant="datenschutz">{t.datenschutz}</Hinweisbox>
            </div>
          </div>
          <div ref={bereich} tabIndex={-1} className="outline-none lg:col-span-7" aria-live="polite">
            {ergebnis ? (
              <Ergebnis b={ergebnis} onNeu={neu} />
            ) : (
              <Fragenkarte
                key={frage.id}
                nummer={schritt + 1}
                gesamt={checkFragen.length}
                frage={text.frage}
                optionen={frage.antworten.map((a) => text.antworten[a.id])}
                value={auswahl[frage.id]}
                onChange={(i) => {
                  setAuswahl({ ...auswahl, [frage.id]: i })
                  setFehler(false)
                }}
                onZurueck={() => {
                  setInteragiert(true)
                  setFehler(false)
                  setSchritt(Math.max(0, schritt - 1))
                }}
                onWeiter={weiter}
                fehler={fehler ? t.fehler : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
