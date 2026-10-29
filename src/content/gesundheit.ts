import type { PageContent } from './types'

export const gesundheit: PageContent = {
  meta: {
    title: 'Gesundheit und Compliance',
    description:
      'Wo ist die körperliche Belastung am höchsten, und was hilft am schnellsten? Bewertung von Tätigkeiten mit anerkannten Methoden.',
  },
  label: 'Gesundheit',
  accent: 'risk',
  title: 'Wo ist die Belastung am höchsten, und was hilft am schnellsten?',
  intro:
    'Die Perspektive Gesundheit bewertet die körperliche Belastung von Tätigkeiten mit anerkannten Methoden und zeigt, welche Gestaltungsmaßnahmen am meisten entlasten.',
  planned: [
    'REBA: Bewertung der Körperhaltung',
    // TODO: The analysis module does not compute LMM yet; only describe it once it does.
    'Leitmerkmalmethode (LMM) für Lastenhandhabung, sobald sie im Analysemodul umgesetzt ist',
    'CSRD: Kennzahlen für ESRS S1',
    'Fehltage und ihre Kosten',
    'Hinweis: Alle drei Perspektiven stammen aus derselben Messung',
  ],
  phase: 'Phase 4',
}
