import type { Accent, PageMeta } from './types'

/** /automatisierung (WEBSITE_PLAN §3, DESIGN_BRIEF §5). No manufacturer names (guideline 3). */
export const automatisierung = {
  meta: {
    title: 'Automatisierung',
    description:
      'Welcher Arbeitsplatz lohnt sich für einen Roboter, welcher nicht? Erst verstehen, dann entscheiden: herstellerneutral und auf Basis einer Messung.',
  } satisfies PageMeta,
  label: 'Automatisierung',
  accent: 'path-automate' as Accent,
  title: 'Welcher Arbeitsplatz lohnt sich für einen Roboter, welcher nicht?',
  intro:
    'Erst verstehen, dann entscheiden. Motavi zeigt, wo sich Automatisierung lohnt, wo zuerst der Ablauf verbessert werden sollte und wo ein Arbeitsplatz am besten so bleibt, wie er ist.',

  kontext: {
    label: 'Physical AI',
    titel: 'Roboter werden flexibler. Die Frage nach dem richtigen Ort bleibt.',
    absaetze: [
      'Mit Physical AI ist gemeint, dass Roboter und Maschinen ihre Umgebung über Kameras und Sensoren erfassen und sich auf wechselnde Teile und Lagen einstellen. Damit werden Aufgaben automatisierbar, die früher feste Vorrichtungen und exakt gleiche Abläufe brauchten.',
      'Ob sich eine Anlage an einem Arbeitsplatz lohnt, entscheidet aber nicht die Technik, sondern der Arbeitsplatz selbst: wie oft sich die Tätigkeit wiederholt, wie gleichförmig sie ist, wie viele Varianten es gibt und wie viel Verschwendung im Ablauf steckt.',
    ],
  },

  grundsatz: {
    label: 'Grundsatz',
    titel: 'Erst verstehen, dann entscheiden',
    punkte: [
      { titel: 'Messen statt schätzen', text: 'Zykluszeit, Wiederholungen, Gleichförmigkeit und Belastung werden im Video gemessen, nicht aus dem Gedächtnis geschätzt.' },
      { titel: 'Verschwendung nicht automatisieren', text: 'Wer Suchen, Gehen und Warten automatisiert, bezahlt eine Anlage für unnötige Bewegungen. Deshalb kommt oft zuerst die Verbesserung.' },
      { titel: 'Nicht automatisieren ist ein Ergebnis', text: 'Bei vielen Varianten und wechselnden Abläufen ist Beibehalten die bessere Antwort. Sie vermeidet eine Fehlinvestition.' },
      { titel: 'Belastende Tätigkeiten zuerst', text: 'Wo Haltungen hoch belasten oder Tätigkeiten monoton sind, entlastet eine Automatisierung die Beschäftigten am meisten.' },
    ],
  },

  kriterien: {
    label: 'Kriterien',
    titel: 'Woran sich eine Automatisierung lohnt',
    intro: 'Der Automatisierungs-Score fasst diese Kriterien zusammen, gewichtet wie im Arbeitsplatz-Steckbrief:',
    schwelle: (s: number) => `Ab einem Score von ${s} gilt Automatisierung als lohnend. Ob vorher verbessert werden sollte, zeigt der Verbesserungs-Score.`,
    pilotHinweis: 'Gewichte und Schwelle sind Startwerte der Pilotphase und werden an realen Arbeitsplätzen geprüft.',
    link: { label: 'Wie die Empfehlung entsteht', to: '/arbeitsplatz-steckbrief#entscheidung' },
  },

  typen: {
    label: 'Automatisierungstypen',
    titel: 'Typen statt Hersteller',
    intro: 'Motavi schlägt einen Automatisierungstyp vor, der zum Ablauf passt, nie einen Hersteller oder ein Produkt. Den Typ bestätigen erfahrene Experten für Arbeitsgestaltung und Zeitwirtschaft (REFA).',
    /** by id of config/workplace_scoring.json (automatisierungstypen.regeln) */
    beschreibung: {
      palettieren: 'Teile mit höherem Gewicht stapeln oder ablegen, mit Wechsel zwischen den Arbeitshöhen von Knie bis Schulter.',
      maschinenbeladung: 'Eine Maschine bestücken und entnehmen, wenn der Ablauf aus Wegen zwischen Maschine und Ablage und aus Wartezeiten besteht.',
      pruefautomatisierung: 'Wenn Prüfen einen großen Teil des Zyklus ausmacht: automatische Prüfung oder ein Assistenzsystem, das die Prüfung unterstützt.',
      pick_and_place: 'Greifen, Bringen und Platzieren bei gleichförmigen Abläufen und Positionen.',
    } as Record<string, string>,
  },

  wirtschaft: {
    label: 'Wirtschaftlichkeit',
    titel: 'Was eine Automatisierung bringt, grob gerechnet',
    punkte: [
      { titel: 'Automatisierungspotenzial', text: 'Stunden pro Jahr, die ein Typ übernehmen könnte, als Bandbreite, bei Erst verbessern, dann automatisieren auf den verbesserten Ablauf gerechnet.' },
      { titel: 'Potenzial in Euro', text: 'Stunden mal Vollkosten, abzüglich der Betriebskosten der Anlage für Wartung, Energie und Programmierung.' },
      { titel: 'Amortisation', text: 'Investition geteilt durch das Potenzial in Euro, als Bandbreite. Ohne Ihre Angabe mit einer groben Standardbandbreite je Typ.' },
    ],
    pflicht: 'Grobe Abschätzung, ersetzt kein Angebot.',
  },

  beschaeftigung: {
    label: 'Beschäftigung',
    titel: 'Belastende und monotone Tätigkeiten automatisieren',
    text: 'Motavi bewertet Tätigkeiten, nie Personen. Ziel einer Automatisierung ist, belastende und monotone Tätigkeiten zu übernehmen und Kapazität zu gewinnen, wo Stellen schwer zu besetzen sind. Wie wir mit dem Betriebsrat zusammenarbeiten, lesen Sie auf der Seite Datenschutz und Betriebsrat.',
  },
}
