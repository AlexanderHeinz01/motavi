import type { PageMeta } from './types'

/** Startseite (WEBSITE_PLAN §1 and §3). Headline and subline are fixed copy from §1. */
export const startseite = {
  meta: {
    title: 'Verbessern, automatisieren oder beibehalten?',
    description:
      'Motavi macht jede Bewegung messbar: als Zeit, als Kosten und als Belastung. Für jeden Arbeitsplatz eine klare Empfehlung.',
  } satisfies PageMeta,
  headline: 'Verbessern, automatisieren oder beibehalten? Motavi misst, was sich an jedem Arbeitsplatz lohnt.',
  subline:
    'Motavi macht jede Bewegung messbar: als Zeit, als Kosten und als Belastung. Für jeden Arbeitsplatz erhalten Sie eine klare Empfehlung, ob Sie ihn gestalten, automatisieren oder beibehalten sollten. Herstellerneutral, ohne Sensoren, DSGVO-konform.',
  primaryCta: { label: 'Pilot anfragen', to: '/pilot' },
  secondaryCta: { label: 'Beispiel-Steckbrief ansehen', to: '/arbeitsplatz-steckbrief' },
  /** Sections in the required order (WEBSITE_PLAN §3). */
  planned: [
    'Hero mit Bewegungsskelett, aus dem Zeit, Kosten und Belastung entstehen',
    'Problem: Jeder Arbeitsplatz verliert Zeit. Niemand weiß genau, wo und warum.',
    'Eine Messung, drei Empfehlungen: Verbessern, Automatisieren, Beibehalten',
    'Beispiel-Steckbrief mit Demo-Daten',
    'Beweis: Fallbeispiel Abfülllinie mit Methodenhinweis',
    'Drei Perspektiven: Kapazität, Automatisierung, Gesundheit',
    'Kapazität berechnen: Mini-Rechner',
    'So funktioniert es: Video, Messung, Expertenbewertung, Steckbrief',
    'Herstellerneutral: Wir verkaufen keine Roboter.',
    'Betriebsrat als Partner',
    'Pakete',
    'Abschluss: Finden Sie heraus, was sich an Ihren Arbeitsplätzen lohnt.',
  ],
  phase: 'Phase 2',
}
