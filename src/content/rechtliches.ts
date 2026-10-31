import type { Accent, PageMeta } from './types'

/**
 * Legal pages (WEBSITE_PLAN §3 and §7.6): marked placeholders until the
 * texts come from a lawyer or a generator. No legal text is written here.
 * Technical facts for the author: docs/RECHTSTEXTE_FAKTEN.md.
 */
export interface Rechtsseite {
  meta: PageMeta
  label: string
  accent: Accent
  title: string
  intro: string
  abschnitte: string[]
}

export const platzhalterText = {
  marke: 'Platzhalter',
  text: 'Text folgt durch Anwalt oder Generator.',
}

export const impressum: Rechtsseite = {
  meta: { title: 'Impressum', description: 'Impressum von Motavi.' },
  label: 'Rechtliches',
  accent: 'data-ink',
  title: 'Impressum',
  intro: 'Das Impressum wird vor der Veröffentlichung ergänzt. Die markierten Abschnitte sind Platzhalter.',
  abschnitte: ['Anbieter', 'Vertretungsberechtigte Personen', 'Kontakt', 'Registereintrag', 'Umsatzsteuer-Identifikationsnummer', 'Verantwortlich für den Inhalt'],
}

export const datenschutz: Rechtsseite = {
  meta: { title: 'Datenschutzerklärung', description: 'Datenschutzerklärung von Motavi.' },
  label: 'Rechtliches',
  accent: 'data-ink',
  title: 'Datenschutzerklärung',
  intro: 'Die Datenschutzerklärung wird vor der Veröffentlichung ergänzt. Die markierten Abschnitte sind Platzhalter.',
  abschnitte: [
    'Verantwortlicher',
    'Hosting der Website',
    'Server-Logdateien',
    'Kontaktformular',
    'Analyse von Videos und Arbeitsplatz-Steckbrief',
    'Speicherdauer',
    'Schriftarten',
    'Ihre Rechte',
    'Beschwerderecht bei einer Aufsichtsbehörde',
  ],
}
