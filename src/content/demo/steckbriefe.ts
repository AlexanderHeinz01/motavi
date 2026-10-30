/**
 * Demo data of the Arbeitsplatz-Steckbrief (STECKBRIEF_MODUL.md §7):
 * invented, plausible values, clearly marked as examples (beispiel: true).
 */
import type { Path } from '../empfehlungen'
import automatisieren from './demo_automatisieren.json'
import beibehalten from './demo_beibehalten.json'
import steckbrief from './demo_steckbrief.json'
import verbessern from './demo_verbessern.json'

export type Klasse = 'wertschoepfend' | 'notwendig' | 'verschwendung'

/**
 * Export format 1.0 of the backend (motavi-backend, docs/steckbrief_schema.json);
 * only the fields the website uses. The demo files are valid exports with
 * beispiel = true.
 */
export interface Steckbrief {
  format: 'motavi-arbeitsplatz-steckbrief'
  schema_version: '1.0'
  /** true: invented example values, no measurement */
  beispiel: boolean
  arbeitsplatz: string
  empfehlung_id: Path
  empfehlung: string
  vorrangig: boolean
  verbesserungs_score: number
  automatisierungs_score: number
  /** null: no recurring cycle detected (a result, STECKBRIEF_MODUL §4.1) */
  zykluszeit_median_s: number | null
  zykluszeit_vk: number | null
  zyklen_pro_schicht: number | null
  zeitanteil_in_zyklen: number
  anteile_ablauf: Record<Klasse, number>
  ablaufschritte: { typ: string; anteil: number; klasse: Klasse }[]
  hoehenzonen: { unter_knie: number; knie_huefte: number; huefte_schulter: number; ueber_schulter: number }
  griffe_ausserhalb_greifraum: number
  reba_mittel: number
  drehungen_pro_zyklus: number | null
  verbesserung_min_schicht: number
  typ_vorschlag: string | null
  stunden_auto_jahr_bandbreite: [number, number] | null
}

/** The four examples in the order of the switcher, keyed by recommendation. */
export const demoSteckbriefe: { path: Path; data: Steckbrief }[] = [
  { path: 'improve-then-automate', data: steckbrief as Steckbrief },
  { path: 'improve', data: verbessern as Steckbrief },
  { path: 'automate', data: automatisieren as Steckbrief },
  { path: 'keep', data: beibehalten as Steckbrief },
]

/** Assumptions for euro values (defaults of WEBSITE_PLAN §4.1). */
export const annahmen = { schichtenProTag: 2, arbeitstage: 220, stundensatz: 50 }
