import type { PageContent } from './types'

/**
 * Partner page. Built, but not linked and not in the sitemap until at least
 * two providers confirm interest (WEBSITE_PLAN §7.1, DESIGN_BRIEF §10.3).
 */
export const robotikAnbieter: PageContent = {
  meta: {
    title: 'Für Robotik-Anbieter und Integratoren',
    description:
      'Arbeitsplätze, die wirklich passen, mit bereinigten Abläufen und standardisierten Daten für Ihr Angebot.',
  },
  label: 'Für Robotik-Anbieter',
  accent: 'data',
  title: 'Arbeitsplätze, die wirklich passen. Mit Daten, die Sie für ein Angebot brauchen.',
  intro:
    'Robotik-Anbieter und Integratoren erhalten über Motavi Arbeitsplätze, die nachweislich passen, mit bereinigten Abläufen und standardisierten Daten.',
  planned: [
    'Nutzen: vorqualifizierte Arbeitsplätze und bereinigte Abläufe, also weniger Projektrisiko',
    'Zykluszeiten, Greifräume und Ablaufschritte als strukturierte Daten',
    'Datenformat: JSON- und PDF-Steckbrief',
    'Zusammenarbeit und Neutralität: Auch "nicht automatisieren" ist ein mögliches Ergebnis',
    'Partnergespräch vereinbaren',
  ],
  phase: 'Phase 5',
}
