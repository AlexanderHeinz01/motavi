/**
 * Recommendation from the two scores (STECKBRIEF_MODUL §5.3). Thresholds,
 * decision table and priority come from config/workplace_scoring.json
 * (src/lib/scoring.ts).
 */
import type { Path } from '../content/empfehlungen'
import { config, empfehlung } from './scoring'

export interface Schwellen {
  /** Improvement score from which "verbessern" applies */
  verbesserung: number
  /** Automation score from which "automatisieren" applies */
  automatisierung: number
  /** Posture index (mean, 1 to 10) from which a workplace is marked as priority */
  rebaVorrangig: number
}

export const STANDARD_SCHWELLEN: Schwellen = {
  verbesserung: config.empfehlung.schwelle_verbesserung,
  automatisierung: config.empfehlung.schwelle_automatisierung,
  rebaVorrangig: config.vorrang.reba_mittel_ab,
}

export function empfehlungAus(verbesserung: number, automatisierung: number, s: Schwellen = STANDARD_SCHWELLEN): Path {
  return empfehlung(verbesserung, automatisierung, {
    ...config.empfehlung,
    schwelle_verbesserung: s.verbesserung,
    schwelle_automatisierung: s.automatisierung,
  })
}

export function istVorrangig(rebaMittel: number, s: Schwellen = STANDARD_SCHWELLEN): boolean {
  return rebaMittel >= s.rebaVorrangig
}
