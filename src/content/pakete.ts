import type { PageMeta } from './types'

/**
 * Packages and prices (WEBSITE_PLAN Phase 5 and §7.3, contents as decided
 * on 30. and 31.10.2026): package 3 gives measured values and the ergonomics
 * report from the customer's own video, without recommendation; packages 2
 * and 1 add recording and validation on site and the Steckbrief with
 * recommendation. The ergonomics report is in all three packages.
 * Single source for /pakete and the start page.
 * TODO: scope per package (number of workplaces, duration, travel costs) once defined.
 */
export interface Paket {
  id: 'video-check' | 'analyse' | 'komplett'
  /** number in WEBSITE_PLAN (1 = Komplettbegleitung) */
  nr: 1 | 2 | 3
  name: string
  preis: string
  leistungen: string[]
  /** what is not included (shown without a check mark) */
  hinweis?: string
  empfohlen?: boolean
}

const NBSP = ' '

export const paketListe: Paket[] = [
  {
    id: 'video-check',
    nr: 3,
    name: 'Video-Check',
    preis: `990${NBSP}€`,
    leistungen: [
      'Aufnahme durch Sie nach unserem Leitfaden, über einen persönlichen Upload-Link',
      'Haltungsindex auf REBA-Basis, Bewegungsanteile und kritische Momente',
      'Zykluszeit und Greifraum, automatisch gemessen',
      'Ergonomie-Report',
    ],
    hinweis: 'Ohne Empfehlung und ohne Bewertung durch Experten.',
  },
  {
    id: 'analyse',
    nr: 2,
    name: 'Analyse vor Ort',
    preis: `2.150${NBSP}€`,
    leistungen: [
      'Videoaufnahme durch uns vor Ort',
      'Validierung und Ermittlung von Prozesspotenzialen vor Ort',
      'Steckbrief mit Empfehlung als Bericht',
      'Ergonomie-Report',
    ],
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
      'Ergonomie-Report',
      'Vorstellung der Ergebnisse in einem Abschlusstermin',
    ],
    empfohlen: true,
  },
]

export const pakete = {
  meta: {
    title: 'Pakete und Preise',
    description: 'Drei Pakete, vom Video-Check mit Messwerten und Ergonomie-Report bis zur Komplettbegleitung mit Aufnahme vor Ort, Steckbrief, Empfehlung und Abschlusstermin.',
  } satisfies PageMeta,
  label: 'Pakete',
  accent: 'data-ink' as const,
  title: 'Pakete und Preise',
  intro:
    'Drei Pakete, vom Video-Check bis zur Komplettbegleitung. Der Ergonomie-Report ist in allen Paketen enthalten. Aufnahme und Validierung vor Ort und den Steckbrief mit Empfehlung gibt es ab dem Paket Analyse vor Ort.',
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
      { label: 'Haltungsindex, Bewegungsanteile, kritische Momente', werte: [true, true, true] },
      { label: 'Zykluszeit und Greifraum', werte: [true, true, true] },
      { label: 'Ergonomie-Report', werte: [true, true, true] },
      { label: 'Validierung und Ermittlung von Prozesspotenzialen vor Ort', werte: [false, true, true] },
      { label: 'Steckbrief mit Empfehlung', werte: [false, 'als Bericht', true] },
      { label: 'Vorstellung des Vorgehens bei Betriebsrat, Management und Mitarbeitenden', werte: [false, false, true] },
      { label: 'Vorstellung der Ergebnisse in einem Abschlusstermin', werte: [false, false, true] },
    ] as { label: string; werte: (string | boolean)[] }[],
  },
  hinweisPilot: 'Die automatische Messung und der Steckbrief sind in der Pilotphase.',
}
