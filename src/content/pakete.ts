import type { PageMeta } from './types'

/**
 * Packages and prices (WEBSITE_PLAN Phase 5 and §7.3, decided 30.10.2026):
 * package 3 gives measured values and the Arbeitsplatz-Check, the
 * Steckbrief with recommendation and expert assessment comes with package 2.
 * Single source for /pakete and the start page.
 * TODO: scope per package (number of workplaces, duration) once defined.
 */
export interface Paket {
  id: 'video-check' | 'analyse' | 'komplett'
  /** number in WEBSITE_PLAN (1 = Komplettbegleitung) */
  nr: 1 | 2 | 3
  name: string
  preis: string
  kurz: string
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
    kurz: 'Messwerte je Arbeitsplatz aus Ihrem eigenen Video.',
    leistungen: ['Sie nehmen das Video selbst auf', 'Messwerte je Arbeitsplatz', 'Ergonomie-Report', 'Arbeitsplatz-Check'],
  },
  {
    id: 'analyse',
    nr: 2,
    name: 'Analyse und Validierung',
    preis: `2.150${NBSP}€`,
    kurz: 'Messung, Bewertung durch einen Experten und Steckbrief mit Empfehlung.',
    leistungen: ['Messung und Expertenbewertung', 'Steckbrief mit Empfehlung und Report', 'Besprechung der Empfehlungen'],
    empfohlen: true,
  },
  {
    id: 'komplett',
    nr: 1,
    name: 'Komplettbegleitung',
    preis: `3.350${NBSP}€`,
    kurz: 'Von der Aufnahme vor Ort bis zur Begleitung der Umsetzung.',
    leistungen: ['Aufnahme vor Ort', 'Steckbrief mit Empfehlung für alle Arbeitsplätze', 'Begleitung der Umsetzung'],
  },
]

export const pakete = {
  meta: {
    title: 'Pakete und Preise',
    description: 'Drei Pakete, vom Video-Check mit Messwerten bis zur Komplettbegleitung mit Steckbrief, Empfehlung und Umsetzung.',
  } satisfies PageMeta,
  label: 'Pakete',
  accent: 'data-ink' as const,
  title: 'Pakete und Preise',
  intro:
    'Drei Pakete, von den Messwerten bis zur Begleitung. Die Empfehlung mit Bewertung durch einen Experten gibt es ab dem Paket Analyse und Validierung.',
  preisHinweis: 'netto, zuzüglich Umsatzsteuer',
  umfang: 'Den genauen Umfang, etwa die Zahl der Arbeitsplätze, stimmen wir im Angebot mit Ihnen ab.',
  cta: { label: 'Pilot anfragen', to: '/pilot' },
  vergleich: {
    titel: 'Leistungen im Vergleich',
    caption: 'Leistungen der drei Pakete im Vergleich',
    /** in the order of paketListe */
    zeilen: [
      { label: 'Video', werte: ['Sie nehmen auf', 'Sie nehmen auf', 'Aufnahme vor Ort'] },
      { label: 'Automatische Messung', werte: [true, true, true] },
      { label: 'Messwerte je Arbeitsplatz', werte: [true, true, true] },
      { label: 'Ergonomie-Report', werte: [true, true, true] },
      { label: 'Arbeitsplatz-Check', werte: [true, true, true] },
      { label: 'Bewertung durch einen Experten', werte: [false, true, true] },
      { label: 'Steckbrief mit Empfehlung', werte: [false, true, true] },
      { label: 'Besprechung der Empfehlungen', werte: [false, true, true] },
      { label: 'Begleitung der Umsetzung', werte: [false, false, true] },
    ] as { label: string; werte: (string | boolean)[] }[],
  },
  hinweisPilot: 'Alle Pakete nutzen das Arbeitsplatz-Steckbrief-Modul in der Pilotphase.',
}
