import type { PageContent } from './types'

export const pilot: PageContent & { contactLead: string } = {
  meta: {
    title: 'Pilot anfragen',
    description: 'Erproben Sie Motavi an Ihren Arbeitsplätzen. Für Hersteller sowie Robotik-Anbieter und Integratoren.',
  },
  label: 'Pilot anfragen',
  accent: 'data',
  title: 'Pilot anfragen',
  intro: 'Sie möchten Motavi an Ihren Arbeitsplätzen erproben? Das Anfrageformular folgt in Kürze.',
  contactLead: 'Bis dahin erreichen Sie uns per E-Mail:',
  planned: [
    'Auswahl: Hersteller oder Robotik-Anbieter und Integrator',
    'Name, Unternehmen, Funktion, E-Mail, Telefon (optional)',
    'Anzahl Arbeitsplätze und Interesse: Kapazität, Automatisierung, Gesundheit',
    'Freitext',
  ],
  phase: 'Phase 6',
}
