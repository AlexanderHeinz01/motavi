/**
 * Derived statements of the Arbeitsplatz-Steckbrief (STECKBRIEF_MODUL §5):
 * reasons for the recommendation, built only from measured values, and the
 * rough economics of §5.5.
 */
import type { Steckbrief } from '../content/demo/steckbriefe'
import type { Path } from '../content/empfehlungen'
import { steckbriefText as t } from '../content/komponenten'
import { euro, prozent, zahl } from './format'
import { STANDARD_SCHWELLEN } from './empfehlung'

/** REBA action levels: 1 negligible, 2 to 3 low, 4 to 7 medium, 8 to 10 high, 11+ very high. */
export function rebaStufe(reba: number): string {
  if (reba < 2) return t.reba_stufen.vernachlaessigbar
  if (reba < 4) return t.reba_stufen.niedrig
  if (reba < 8) return t.reba_stufen.mittel
  if (reba < 11) return t.reba_stufen.hoch
  return t.reba_stufen.sehrHoch
}

/** Round euro amounts to hundreds: a rough estimate has no exact cents. */
export const euroGerundet = (v: number) => euro(Math.round(v / 100) * 100)

/**
 * Up to three reasons for the recommendation, each with the measured value
 * it rests on. Improvement reasons come from waste, reach and load,
 * automation reasons from repetition and uniformity.
 */
export function begruendung(s: Steckbrief, path: Path): string[] {
  const out: string[] = []
  const verschwendung = s.ablaufschritte.filter((a) => a.klasse === 'verschwendung').map((a) => a.typ)
  const verbessern = path === 'improve' || path === 'improve-then-automate'
  const automatisieren = path === 'automate' || path === 'improve-then-automate'

  if (verbessern) {
    out.push(t.gruende.verschwendung(prozent(s.anteile_ablauf.verschwendung), verschwendung.join(', ')))
    out.push(t.gruende.greifraum(prozent(s.griffe_ausserhalb_greifraum)))
  }
  if (automatisieren && s.zyklen_pro_schicht !== null && s.zykluszeit_vk !== null) {
    out.push(t.gruende.wiederholung(zahl(s.zyklen_pro_schicht), prozent(s.zykluszeit_vk)))
  }
  if (path === 'automate') out.push(t.gruende.schlank(prozent(s.anteile_ablauf.verschwendung)))
  if (path === 'keep') {
    out.push(s.zykluszeit_median_s === null ? t.gruende.keinZyklus : t.gruende.wenigZyklen(prozent(s.zeitanteil_in_zyklen)))
    out.push(t.gruende.wenigPotenzial(zahl(s.verbesserung_min_schicht)))
  }
  out.push(t.gruende.belastung(zahl(s.reba_mittel, 1), rebaStufe(s.reba_mittel)))
  if (s.reba_mittel >= STANDARD_SCHWELLEN.rebaVorrangig) out.push(t.gruende.vorrangig)
  return out.slice(0, 3)
}

export interface Annahmen {
  schichtenProTag: number
  arbeitstage: number
  stundensatz: number
}

/** Rough economics (STECKBRIEF_MODUL §5.5). */
export function wirtschaft(s: Steckbrief, a: Annahmen) {
  const euroVerbesserung = ((s.verbesserung_min_schicht * a.schichtenProTag * a.arbeitstage) / 60) * a.stundensatz
  const euroAuto = s.stunden_auto_jahr_bandbreite?.map((h) => h * a.stundensatz) as [number, number] | undefined
  return { euroVerbesserung, euroAuto }
}
