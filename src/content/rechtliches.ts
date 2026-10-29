import type { PageContent } from './types'

/** Legal pages: placeholders until the texts come from a lawyer or a generator (WEBSITE_PLAN §3). */
export const impressum: PageContent = {
  meta: { title: 'Impressum', description: 'Impressum von Motavi.' },
  label: 'Rechtliches',
  accent: 'data',
  title: 'Impressum',
  intro: 'Platzhalter: Der Text des Impressums folgt durch Anwalt oder Generator.',
  planned: [],
  phase: 'Phase 6',
}

export const datenschutz: PageContent = {
  meta: { title: 'Datenschutzerklärung', description: 'Datenschutzerklärung von Motavi.' },
  label: 'Rechtliches',
  accent: 'data',
  title: 'Datenschutzerklärung',
  intro: 'Platzhalter: Der Text der Datenschutzerklärung folgt durch Anwalt oder Generator.',
  planned: [],
  phase: 'Phase 6',
}
