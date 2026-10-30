import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { bewerten, checkAuswerten, checkFragen, config, empfehlung, index, rampe, runden } from './scoring'

/**
 * Reference cases computed by the backend (motavi-backend:
 * backend/tests/profiles.py through steckbrief.kennzahlen and scoring.score);
 * the website must compute the same scores.
 */
const BACKEND = [
  { name: 'Montage', werte: { verschwendung_anteil: 0.22, griffe_ausserhalb: 0.21, zykluszeit_vk: 0.14, zyklen_pro_schicht: 690, zeitanteil_in_zyklen: 0.82, reba_mittel: 5.8, buecken_anteil: 0.1, ueberkopf_anteil: 0.05, drehung_anteil: 0.1, anzahl_varianten: 3, besetzung_schwierigkeit: 4, teilegewicht_kg: 1.2, groesste_kante_cm: 30 }, keinZyklus: false, erwartet: [55, 81, 'improve-then-automate'] },
  { name: 'Rüstplatz', werte: { verschwendung_anteil: 0.35, griffe_ausserhalb: 0.35, zykluszeit_vk: 0.35, zyklen_pro_schicht: 120, zeitanteil_in_zyklen: 0.7, reba_mittel: 7.0, buecken_anteil: 0.25, ueberkopf_anteil: 0.1, drehung_anteil: 0.2, anzahl_varianten: 40, besetzung_schwierigkeit: 2, teilegewicht_kg: 5, groesste_kante_cm: 50 }, keinZyklus: false, erwartet: [91, 31, 'improve'] },
  { name: '20-s-Takt', werte: { verschwendung_anteil: 0.03, griffe_ausserhalb: 0.05, zykluszeit_vk: 0.06, zyklen_pro_schicht: 1300, zeitanteil_in_zyklen: 0.92, reba_mittel: 4.0, buecken_anteil: 0.05, ueberkopf_anteil: 0.0, drehung_anteil: 0.05, anzahl_varianten: 1, besetzung_schwierigkeit: 5, teilegewicht_kg: 0.5, groesste_kante_cm: 15 }, keinZyklus: false, erwartet: [13, 88, 'automate'] },
  { name: 'lange Arbeit', werte: { verschwendung_anteil: 0.05, griffe_ausserhalb: 0.08, zykluszeit_vk: 0.25, zyklen_pro_schicht: 40, zeitanteil_in_zyklen: 0.6, reba_mittel: 3.0, buecken_anteil: 0.02, ueberkopf_anteil: 0.0, drehung_anteil: 0.02, anzahl_varianten: 30, besetzung_schwierigkeit: 1, teilegewicht_kg: 15, groesste_kante_cm: 120 }, keinZyklus: false, erwartet: [23, 20, 'keep'] },
  { name: 'ohne Ablaufschritte', werte: { griffe_ausserhalb: 0.05, zykluszeit_vk: 0.06, zyklen_pro_schicht: 1300, zeitanteil_in_zyklen: 0.92, reba_mittel: 4.0, buecken_anteil: 0.05, ueberkopf_anteil: 0.0, drehung_anteil: 0.05, anzahl_varianten: 1, besetzung_schwierigkeit: 5, teilegewicht_kg: 0.5, groesste_kante_cm: 15 }, keinZyklus: false, erwartet: [14, 88, 'automate'] },
  { name: 'kein Zyklus', werte: { griffe_ausserhalb: 0.08, reba_mittel: 3.0, buecken_anteil: 0.02, ueberkopf_anteil: 0.0, drehung_anteil: 0.02, anzahl_varianten: 30, besetzung_schwierigkeit: 1, teilegewicht_kg: 15, groesste_kante_cm: 120 }, keinZyklus: true, erwartet: [15, 8, 'keep'] },
] as const

/** WEBSITE_PLAN Phase 3 acceptance; expected values from motavi-backend test_arbeitsplatz_check.py. */
const CHECK_PROFILE = {
  verschwendungsreich: { auswahl: [1, 1, 2, 1, 3, 2, 1, 1], erwartet: [82, 40, 'improve'] },
  'repetitiv und bereinigt': { auswahl: [3, 3, 0, 0, 0, 1, 3, 2], erwartet: [21, 87, 'automate'] },
  'repetitiv mit Verschwendung': { auswahl: [2, 2, 1, 0, 2, 2, 2, 2], erwartet: [64, 77, 'improve-then-automate'] },
  hochvariabel: { auswahl: [0, 0, 3, 2, 1, 0, 0, 0], erwartet: [31, 8, 'keep'] },
} as const

const antworten = (auswahl: readonly number[]) => Object.fromEntries(checkFragen.map((f, i) => [f.id, f.antworten[auswahl[i]].id]))

describe('Konfiguration', () => {
  it('ohne Kommentare, Gewichte je Score in Summe 1', () => {
    expect(JSON.stringify(config)).not.toContain('_kommentar')
    for (const s of [config.verbesserungs_score, config.automatisierungs_score]) {
      expect(Object.values(s.kriterien).reduce((a, k) => a + k.gewicht, 0)).toBeCloseTo(1, 9)
    }
  })
  it('ist eine unveränderte Kopie der Backend-Datei (falls daneben ausgecheckt)', () => {
    const quelle = resolve(process.env.MOTAVI_BACKEND_REPO ?? '../motavi-backend', 'config/workplace_scoring.json')
    if (!existsSync(quelle)) return
    expect(readFileSync('config/workplace_scoring.json', 'utf-8')).toBe(readFileSync(quelle, 'utf-8'))
  })
})

describe('Rechenbausteine', () => {
  it('Rampe linear, begrenzt, invers', () => {
    expect([0, 0.1, 0.2, 0.3, 1].map((x) => rampe({ null_bei: 0.1, voll_bei: 0.3 }, x))).toEqual([0, 0, expect.closeTo(0.5), 1, 1])
    expect(rampe({ null_bei: 20, voll_bei: 1 }, 10.5)).toBeCloseTo(0.5)
  })
  it('kaufmännisch runden', () => {
    expect([runden(52.5), runden(53.5), runden(49.49)]).toEqual([53, 54, 49])
  })
  it('Index verteilt fehlende Teile', () => {
    expect(index(config.belastung, { reba_mittel: 5.5, buecken_anteil: 0.3, ueberkopf_anteil: 0 })).toBeCloseTo((0.5 * 0.5 + 0.2) / 0.9, 9)
    expect(index(config.handhabbarkeit, {})).toBeNull()
  })
  it('Entscheidungstabelle mit Schwellen einschließlich', () => {
    expect([empfehlung(50, 60), empfehlung(50, 59), empfehlung(49, 60), empfehlung(49, 59)]).toEqual([
      'improve-then-automate', 'improve', 'automate', 'keep',
    ])
  })
})

describe.each(BACKEND)('gleich wie das Backend: $name', ({ werte, keinZyklus, erwartet }) => {
  it('Scores und Empfehlung', () => {
    const b = bewerten(werte, keinZyklus)
    expect([b.verbesserung.wert, b.automatisierung.wert, b.empfehlung]).toEqual(erwartet)
  })
})

describe('Arbeitsplatz-Check', () => {
  it('acht Fragen mit je vier Antworten', () => {
    expect(checkFragen).toHaveLength(8)
    expect(checkFragen.every((f) => f.antworten.length === 4)).toBe(true)
  })
  it.each(Object.entries(CHECK_PROFILE))('%s', (_name, { auswahl, erwartet }) => {
    const b = checkAuswerten(antworten(auswahl))
    expect([b.verbesserung.wert, b.automatisierung.wert, b.empfehlung]).toEqual(erwartet)
    expect(b.verbesserung.vollstaendig && b.automatisierung.vollstaendig).toBe(true)
  })
  it('vier Profile, vier verschiedene Empfehlungen', () => {
    const e = Object.values(CHECK_PROFILE).map((p) => checkAuswerten(antworten(p.auswahl)).empfehlung)
    expect(new Set(e).size).toBe(4)
  })
  it('Vorrang bei ständig belastender Haltung', () => {
    expect(checkAuswerten(antworten([1, 1, 1, 1, 1, 3, 1, 1])).vorrangig).toBe(true)
    expect(checkAuswerten(antworten([1, 1, 1, 1, 1, 2, 1, 1])).vorrangig).toBe(false)
  })
  it('unvollständige oder unbekannte Antworten werden abgelehnt', () => {
    expect(() => checkAuswerten({})).toThrow('nicht beantwortet')
    expect(() => checkAuswerten({ ...antworten([0, 0, 0, 0, 0, 0, 0, 0]), varianten: 'tausend' })).toThrow('Unbekannte Antwort')
  })
})
