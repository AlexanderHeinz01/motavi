import type { PageContent } from './types'

export const steckbrief: PageContent = {
  meta: {
    title: 'Der Arbeitsplatz-Steckbrief',
    description:
      'Der Arbeitsplatz-Steckbrief fasst die Messung eines Arbeitsplatzes zusammen und leitet daraus eine Empfehlung ab: verbessern, automatisieren oder beibehalten.',
  },
  label: 'Arbeitsplatz-Steckbrief',
  accent: 'data-ink',
  title: 'Der Arbeitsplatz-Steckbrief',
  intro:
    'Der Steckbrief fasst die Messung eines Arbeitsplatzes zusammen und leitet daraus eine Empfehlung ab: verbessern, automatisieren oder beibehalten.',
  planned: [
    'Aufbau des Steckbriefs mit Erklärung jeder Kennzahl',
    'Entscheidungslogik: wann verbessern, wann automatisieren, wann beibehalten, wann erst verbessern und dann automatisieren',
    'Arbeitsplatz-Check: Selbsttest mit acht Fragen',
  ],
  phase: 'Phase 3',
  pilot: true,
}
