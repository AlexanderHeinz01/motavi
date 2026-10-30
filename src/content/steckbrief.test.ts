import { describe, expect, it } from 'vitest'
import { checkFragen, config } from '../lib/scoring'
import { steckbrief } from './steckbrief'

/** All visible strings of the page content, functions called with a sample value. */
function texte(x: unknown): string[] {
  if (typeof x === 'string') return [x]
  if (typeof x === 'function') return [String((x as (a: number) => string)(50))]
  if (Array.isArray(x)) return x.flatMap(texte)
  if (x && typeof x === 'object') return Object.values(x).flatMap(texte)
  return []
}

describe('Arbeitsplatz-Check: Texte passen zur Konfiguration', () => {
  it('jede Frage und Antwort der Konfiguration hat genau einen Text', () => {
    expect(Object.keys(steckbrief.check.fragen).sort()).toEqual(checkFragen.map((f) => f.id).sort())
    for (const f of checkFragen) {
      expect(Object.keys(steckbrief.check.fragen[f.id].antworten).sort()).toEqual(f.antworten.map((a) => a.id).sort())
    }
  })
  it('die acht Fragen aus WEBSITE_PLAN §4.2', () => {
    expect(checkFragen.map((f) => steckbrief.check.fragen[f.id].frage)).toEqual([
      'Wie oft wiederholt sich die Tätigkeit pro Schicht?',
      'Wie gleichförmig läuft jeder Durchgang ab?',
      'Wie viele Teile- oder Produktvarianten gibt es?',
      'Wie schwer und handlich sind die Teile?',
      'Wie viel Gehen, Suchen und Warten gehört zum Ablauf?',
      'Wie oft wird gebückt, über Kopf oder mit Drehung gearbeitet?',
      'Wie hoch ist der Zeitanteil dieser Tätigkeit an der Schicht?',
      'Wie schwer ist die Stelle zu besetzen?',
    ])
  })
  it('Empfehlungs-Erklärungen und typische Fälle für alle vier Wege', () => {
    for (const p of ['improve', 'improve-then-automate', 'automate', 'keep'] as const) {
      expect(config.empfehlung.erklaerung[p]).toBeTruthy()
      expect(steckbrief.entscheidung.typisch[p]).toBeTruthy()
    }
  })
})

describe('Leitplanken für die sichtbaren Texte', () => {
  const alle = texte(steckbrief)
  it('keine Gedankenstriche (Leitplanke 1)', () => {
    expect(alle.filter((s) => /[—–]/.test(s))).toEqual([])
  })
  it('keine verbotenen Formulierungen (Leitplanke 6)', () => {
    const verboten = /Personal einsparen|Mitarbeiter ersetzen|Leistung messen|schneller arbeiten|freisetz|DSGVO-konform/i
    expect(alle.filter((s) => verboten.test(s))).toEqual([])
  })
  it('jede nicht validierte Messung trägt Pilotphase (Leitplanke 7)', () => {
    const a = steckbrief.aufbau
    const gemessen = [...a.kennzahlen.eintraege, ...a.ablauf.eintraege, ...a.greifraum.eintraege]
    // only REBA comes from the existing ergonomics analysis, everything else is in validation
    expect(gemessen.filter((k) => !k.pilot).map((k) => k.name)).toEqual(['REBA (Mittel)'])
    expect(a.bewertung.verbesserung.pilot && a.bewertung.automatisierung.pilot).toBe(true)
  })
})
