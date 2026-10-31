import type { PageMeta } from './types'

/**
 * Packages and prices (WEBSITE_PLAN Phase 5 and §7.3, contents as decided
 * on 31.10.2026): package 3 gives measured values and the Arbeitsplatz-Check
 * from the customer's own video; packages 2 and 1 add recording and
 * validation on site and the Steckbrief with recommendation.
 * Single source for /pakete and the start page.
 * TODO: scope per package (number of workplaces, duration) once defined.
 */
export interface Paket {
  id: 'video-check' | 'analyse' | 'komplett'
  /** number in WEBSITE_PLAN (1 = Komplettbegleitung) */
  nr: 1 | 2 | 3
  name: string
  preis: string
  leistungen: string[]
  empfohlen?: boolean
}

const NBSP = ' '

export const paketListe: Paket[] = [
  {
    id: 'video-check',
    nr: 3,
    name: 'Video-Check',
    preis: `990${NBSP}€`,
    leistungen: ['Aufnahme durch Sie nach unserem Leitfaden', 'Messwerte je Arbeitsplatz', 'Ergonomie-Report', 'Arbeitsplatz-Check'],
  },
  {
    id: 'analyse',
    nr: 2,
    name: 'Analyse und Validierung',
    preis: `2.150${NBSP}€`,
    leistungen: ['Videoaufnahme durch uns vor Ort', 'Validierung und Ermittlung von Prozesspotenzialen vor Ort', 'Steckbrief mit Empfehlung als Bericht'],
  },
  {
    id: 'komplett',
    nr: 1,
    name: 'Komplettbegleitung',
    preis: `3.350${NBSP}€`,
    leistungen: [
      'Vorstellung des Vorgehens bei Betriebsrat, Management und Mitarbeitenden',
      'Videoaufnahme durch uns vor Ort',
      'Validierung und Ermittlung von Prozesspotenzialen vor Ort',
      'Steckbrief mit Empfehlung',
      'Vorstellung der Ergebnisse in einem Abschlusstermin',
    ],
    empfohlen: true,
  },
]

export const pakete = {
  meta: {
    title: 'Pakete und Preise',
    description: 'Drei Pakete, vom Video-Check mit Messwerten bis zur Komplettbegleitung mit Aufnahme vor Ort, Steckbrief, Empfehlung und Abschlusstermin.',
  } satisfies PageMeta,
  label: 'Pakete',
  accent: 'data-ink' as const,
  title: 'Pakete und Preise',
  intro:
    'Drei Pakete, vom Video-Check bis zur Komplettbegleitung. Aufnahme und Validierung vor Ort und den Steckbrief mit Empfehlung gibt es ab dem Paket Analyse und Validierung.',
  /** heading above the cards, for screen readers only (heading order h1, h2, h3) */
  kartenTitel: 'Die drei Pakete',
  preisHinweis: 'netto, zuzüglich Umsatzsteuer',
  umfang: 'Den genauen Umfang, etwa die Zahl der Arbeitsplätze, stimmen wir im Angebot mit Ihnen ab.',
  cta: { label: 'Pilot anfragen', to: '/pilot' },
  vergleich: {
    titel: 'Leistungen im Vergleich',
    caption: 'Leistungen der drei Pakete im Vergleich',
    /** in the order of paketListe */
    zeilen: [
      { label: 'Videoaufnahme', werte: ['durch Sie nach Leitfaden', 'durch uns vor Ort', 'durch uns vor Ort'] },
      { label: 'Messwerte je Arbeitsplatz', werte: [true, true, true] },
      { label: 'Ergonomie-Report', werte: [true, false, false] },
      { label: 'Arbeitsplatz-Check', werte: [true, false, false] },
      { label: 'Validierung und Ermittlung von Prozesspotenzialen vor Ort', werte: [false, true, true] },
      { label: 'Steckbrief mit Empfehlung', werte: [false, 'als Bericht', true] },
      { label: 'Vorstellung des Vorgehens bei Betriebsrat, Management und Mitarbeitenden', werte: [false, false, true] },
      { label: 'Vorstellung der Ergebnisse in einem Abschlusstermin', werte: [false, false, true] },
    ] as { label: string; werte: (string | boolean)[] }[],
  },
  hinweisPilot: 'Alle Pakete nutzen das Arbeitsplatz-Steckbrief-Modul in der Pilotphase.',
}
