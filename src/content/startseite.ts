import type { Path } from './empfehlungen'
import type { Accent, PageMeta } from './types'

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

  /** Hero drawing and data sheet (decision D0: variant A). */
  hero: {
    zeichnungLabel:
      'Technische Zeichnung: anonymisiertes Bewegungsskelett an einer Werkbank, mit Bahnkurve der Hand, Greifraum und Zykluszeit.',
    zykluszeit: '38,4 s je Zyklus',
    /**
     * Invented example values (DESIGN_BRIEF §2), marked as such (guideline 5).
     * 23.400 € per year = 64 min per shift x 2 shifts x 220 days at 50 € per hour.
     */
    werte: [
      { label: 'Zeit', accent: 'data-ink', value: '38,4 s', detail: 'je Zyklus, 690 Zyklen pro Schicht' },
      { label: 'Kosten', accent: 'gain-ink', value: '23.400 €', detail: 'pro Jahr, 64 Minuten je Schicht ohne Wertschöpfung' },
      { label: 'Belastung', accent: 'risk-ink', value: 'REBA 5,8', detail: 'Mittelwert, Rumpfwinkel bis 45 Grad' },
    ] satisfies { label: string; accent: Accent; value: string; detail: string }[],
    beispielHinweis: 'Beispielwerte',
    bruecke: {
      lead: 'Daraus folgt eine Empfehlung:',
      paths: ['improve', 'automate', 'keep'] satisfies Path[],
      target: 'eine-messung',
    },
  },

  /** Section "Eine Messung, drei Empfehlungen" (WEBSITE_PLAN §3, DESIGN_BRIEF §5). */
  entscheidung: {
    id: 'eine-messung',
    label: 'Entscheidung',
    title: 'Eine Messung, drei Empfehlungen',
    intro: 'Jeder Arbeitsplatz wird gleich gemessen. Daraus folgt eine von drei gleichwertigen Empfehlungen.',
    messung: 'Eine Messung',
    messungText: 'Zeit, Kosten und Belastung je Arbeitsplatz',
    groessen: [
      { label: 'Zeit', accent: 'data-ink' },
      { label: 'Kosten', accent: 'gain-ink' },
      { label: 'Belastung', accent: 'risk-ink' },
    ] satisfies { label: string; accent: Accent }[],
    /** "Wann" column of the table in WEBSITE_PLAN §1. */
    wege: [
      {
        path: 'improve',
        text: 'Verschwendung und Belastung lassen sich durch Gestaltung lösen: Greifwege, Höhen, Layout, Materialbereitstellung.',
      },
      { path: 'automate', text: 'Hohe Wiederholung, gleichförmige Zyklen, hohe Belastung, wenige Varianten.' },
      { path: 'keep', text: 'Hohe Variantenvielfalt, kurze Zyklen ohne Muster, geringe Belastung. Keine Fehlinvestition.' },
    ] satisfies { path: Path; text: string }[],
  },

  /** Sections still to come (WEBSITE_PLAN §3); hero and decision section are built. */
  planned: [
    'Problem: Jeder Arbeitsplatz verliert Zeit. Niemand weiß genau, wo und warum.',
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
