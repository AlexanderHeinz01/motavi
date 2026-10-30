/** Names of the recommendations (WEBSITE_PLAN §1, STECKBRIEF_MODUL §1). */
export type Path = 'improve' | 'improve-then-automate' | 'automate' | 'keep'

export const empfehlungen: Record<Path, string> = {
  improve: 'Verbessern',
  'improve-then-automate': 'Erst verbessern, dann automatisieren',
  automate: 'Automatisieren',
  keep: 'Beibehalten',
}

/** The two segments of "Erst verbessern, dann automatisieren" (shown as a sequence). */
export const improveThenAutomateSegments = { first: 'Erst verbessern', second: 'dann automatisieren' }

export const vorrangigLabel = 'Vorrangig'
