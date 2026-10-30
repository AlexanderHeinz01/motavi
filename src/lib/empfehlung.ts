/**
 * Recommendation from the two scores (STECKBRIEF_MODUL.md §5.3).
 * TODO (Phase 3): read thresholds from config/workplace_scoring.json.
 */
import type { Path } from '../content/empfehlungen'

export interface Schwellen {
  /** Improvement score from which "verbessern" applies */
  verbesserung: number
  /** Automation score from which "automatisieren" applies */
  automatisierung: number
  /** Mean REBA from which a workplace is marked as priority */
  rebaVorrangig: number
}

export const STANDARD_SCHWELLEN: Schwellen = { verbesserung: 50, automatisierung: 60, rebaVorrangig: 8 }

export function empfehlungAus(verbesserung: number, automatisierung: number, s: Schwellen = STANDARD_SCHWELLEN): Path {
  const v = verbesserung >= s.verbesserung
  const a = automatisierung >= s.automatisierung
  if (v && a) return 'improve-then-automate'
  if (v) return 'improve'
  if (a) return 'automate'
  return 'keep'
}

export function istVorrangig(rebaMittel: number, s: Schwellen = STANDARD_SCHWELLEN): boolean {
  return rebaMittel >= s.rebaVorrangig
}
