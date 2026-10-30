/**
 * Scores, recommendation and Arbeitsplatz-Check (STECKBRIEF_MODUL §5,
 * WEBSITE_PLAN §4.2), computed from the shared configuration
 * config/workplace_scoring.json. That file is a copy of the backend's
 * (motavi-backend, the source; npm run sync:scoring), and this module
 * computes exactly like backend/app/services/workplace/scoring.py: the
 * tests use the backend's results as expected values.
 *
 * A criterion without a value drops out and its weight is spread over the
 * others; below min_gewicht_vorhanden the score is not reliable (null).
 */
import roh from '../../config/workplace_scoring.json'
import type { Path } from '../content/empfehlungen'

export interface Rampe {
  null_bei: number
  voll_bei: number
}
interface Teil extends Rampe {
  gewicht: number
}
interface Kriterium extends Teil {
  text: string
  quelle: string
  kennzahl: string
  ohne_zyklus?: number
}
interface IndexConfig {
  teile: Record<string, Teil>
  min_gewicht_vorhanden: number
}
interface ScoreConfig {
  kriterien: Record<string, Kriterium>
  min_gewicht_vorhanden: number
}
interface Regel {
  verbesserung: 'hoch' | 'niedrig'
  automatisierung: 'hoch' | 'niedrig'
  empfehlung: Path
}
export interface CheckFrage {
  id: string
  antworten: { id: string; werte: Record<string, number> }[]
}

export interface ScoringConfig {
  version: number
  schritt_typen: Record<string, 'wertschoepfend' | 'notwendig' | 'verschwendung'>
  vermeidbarer_anteil: Record<string, number>
  belastung: IndexConfig
  handhabbarkeit: IndexConfig
  verbesserungs_score: ScoreConfig
  automatisierungs_score: ScoreConfig
  empfehlung: {
    schwelle_verbesserung: number
    schwelle_automatisierung: number
    regeln: Regel[]
    texte: Record<Path, string>
    erklaerung: Record<Path, string>
    mit_automatisierung: Path[]
  }
  vorrang: { reba_mittel_ab: number; text: string }
  automatisierungstypen: { regeln: { id: string; name: string; automatisierbarer_anteil: [number, number]; investition_euro: [number, number]; betriebskosten_anteil: [number, number] }[] }
  arbeitsplatz_check: { fragen: CheckFrage[] }
}

/** Removes the comment keys ("_kommentar") at every level. */
function ohneKommentare(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(ohneKommentare)
  if (x && typeof x === 'object') {
    return Object.fromEntries(Object.entries(x).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, ohneKommentare(v)]))
  }
  return x
}

export const config = ohneKommentare(roh) as ScoringConfig

export type Werte = Record<string, number | null | undefined>

/** Half up, like the backend (not banker's rounding). */
export const runden = (x: number) => Math.floor(x + 0.5)

/** Linear: null_bei -> 0, voll_bei -> 1, clamped; inverse if null_bei > voll_bei. */
export function rampe(r: Rampe, wert: number): number {
  const u = (wert - r.null_bei) / (r.voll_bei - r.null_bei)
  return Math.min(1, Math.max(0, u))
}

/** Weighted index 0..1 (load, handling); null if too few parts have a value. */
export function index(cfg: IndexConfig, werte: Werte): number | null {
  let summe = 0
  let gewicht = 0
  let total = 0
  for (const [name, teil] of Object.entries(cfg.teile)) {
    total += teil.gewicht
    const w = werte[name]
    if (w === null || w === undefined) continue
    summe += teil.gewicht * rampe(teil, w)
    gewicht += teil.gewicht
  }
  const vorhanden = total ? gewicht / total : 0
  return gewicht && vorhanden >= cfg.min_gewicht_vorhanden ? summe / gewicht : null
}

export interface KriteriumErgebnis {
  id: string
  text: string
  quelle: string
  gewicht: number
  teilwert: number | null
}

export interface ScoreErgebnis {
  /** 0..100; null: not reliable */
  wert: number | null
  vollstaendig: boolean
  kriterien: KriteriumErgebnis[]
}

/** Derived indices from their parts (load, handling). */
export function mitIndizes(werte: Werte): Werte {
  return {
    ...werte,
    belastung_index: index(config.belastung, werte),
    handhabbarkeit_index: index(config.handhabbarkeit, werte),
  }
}

export function score(cfg: ScoreConfig, werte: Werte, keinZyklus = false): ScoreErgebnis {
  let summe = 0
  let gewicht = 0
  const kriterien: KriteriumErgebnis[] = []
  for (const [id, k] of Object.entries(cfg.kriterien)) {
    const w = werte[k.kennzahl]
    let t: number | null = w === null || w === undefined ? null : rampe(k, w)
    if (t === null && keinZyklus && k.ohne_zyklus !== undefined) t = k.ohne_zyklus
    if (t !== null) {
      summe += k.gewicht * t
      gewicht += k.gewicht
    }
    kriterien.push({ id, text: k.text, quelle: k.quelle, gewicht: k.gewicht, teilwert: t })
  }
  const belastbar = gewicht > 0 && gewicht >= cfg.min_gewicht_vorhanden - 1e-9
  return {
    wert: belastbar ? runden((100 * summe) / gewicht) : null,
    vollstaendig: kriterien.every((k) => k.teilwert !== null),
    kriterien,
  }
}

/** Recommendation from the two scores (decision table, thresholds inclusive). */
export function empfehlung(verbesserung: number, automatisierung: number, cfg = config.empfehlung): Path {
  const v = verbesserung >= cfg.schwelle_verbesserung ? 'hoch' : 'niedrig'
  const a = automatisierung >= cfg.schwelle_automatisierung ? 'hoch' : 'niedrig'
  const regel = cfg.regeln.find((r) => r.verbesserung === v && r.automatisierung === a)
  if (!regel) throw new Error(`Keine Regel für ${v}/${a}`)
  return regel.empfehlung
}

export const istVorrangig = (rebaMittel: number) => rebaMittel >= config.vorrang.reba_mittel_ab

export interface Bewertung {
  verbesserung: ScoreErgebnis
  automatisierung: ScoreErgebnis
  /** null if a score is not reliable */
  empfehlung: Path | null
  vorrangig: boolean
}

/** Both scores, recommendation and priority from metric values (as in the Steckbrief). */
export function bewerten(werte: Werte, keinZyklus = false): Bewertung {
  const w = mitIndizes(werte)
  const verbesserung = score(config.verbesserungs_score, w, keinZyklus)
  const automatisierung = score(config.automatisierungs_score, w, keinZyklus)
  const reba = w.reba_mittel
  return {
    verbesserung,
    automatisierung,
    empfehlung:
      verbesserung.wert !== null && automatisierung.wert !== null ? empfehlung(verbesserung.wert, automatisierung.wert) : null,
    vorrangig: reba !== null && reba !== undefined && istVorrangig(reba),
  }
}

export const checkFragen: CheckFrage[] = config.arbeitsplatz_check.fragen

/**
 * Arbeitsplatz-Check (WEBSITE_PLAN §4.2): each answer sets metrics to a
 * typical value, then the Steckbrief scores and rules decide.
 * antworten: question id -> answer id.
 */
export function checkAuswerten(antworten: Record<string, string>): Bewertung {
  const werte: Werte = {}
  for (const frage of checkFragen) {
    const id = antworten[frage.id]
    if (id === undefined) throw new Error(`Frage ${frage.id} nicht beantwortet`)
    const antwort = frage.antworten.find((a) => a.id === id)
    if (!antwort) throw new Error(`Unbekannte Antwort ${id} für ${frage.id}`)
    Object.assign(werte, antwort.werte)
  }
  return bewerten(werte)
}
