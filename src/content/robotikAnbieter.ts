import type { Accent, PageMeta } from './types'

/**
 * Partner page (WEBSITE_PLAN §3). Built, but not linked, not in the sitemap
 * and noindex until at least two providers confirm interest (§7.1).
 * The commercial role towards providers (§7.2) is open and not stated here.
 */
export const robotikAnbieter = {
  meta: {
    title: 'Für Robotik-Anbieter und Integratoren',
    description: 'Arbeitsplätze, die wirklich passen, mit bereinigten Abläufen und standardisierten Daten für Ihr Angebot.',
  } satisfies PageMeta,
  label: 'Für Robotik-Anbieter',
  accent: 'data-ink' as Accent,
  title: 'Arbeitsplätze, die wirklich passen. Mit Daten, die Sie für ein Angebot brauchen.',
  intro:
    'Robotik-Anbieter und Integratoren erhalten über Motavi Arbeitsplätze, deren Eignung gemessen ist, mit bereinigten Abläufen und Daten in einem dokumentierten Format.',

  nutzen: {
    label: 'Nutzen',
    titel: 'Weniger Projektrisiko',
    punkte: [
      { titel: 'Vorqualifizierte Arbeitsplätze', text: 'Automatisierungs-Score und Automatisierungstyp aus einer Messung, vom Experten bestätigt.' },
      { titel: 'Bereinigte Abläufe', text: 'Bei Erst verbessern, dann automatisieren ist die Verschwendung vorher aus dem Ablauf. Sie planen auf dem verbesserten Ablauf.' },
      { titel: 'Strukturierte Daten', text: 'Zykluszeiten mit Schwankung, Zyklen pro Schicht, Ablaufschritte mit Anteilen, Greifraum und Arbeitshöhen.' },
      { titel: 'Ehrliche Grenzen', text: 'Werte, die nicht belastbar messbar sind, stehen als solche im Export, mit Grund. Greifraum und Höhen sind relative Werte aus 2D-Video.' },
    ],
  },

  daten: {
    label: 'Datenformat',
    titel: 'JSON-Export und PDF-Steckbrief',
    intro:
      'Jeder Steckbrief steht als PDF und als JSON zur Verfügung. Das JSON-Format ist dokumentiert, versioniert und herstellerneutral. Es enthält keine personenbezogenen Daten.',
    jsonTitel: 'Auszug aus dem JSON-Export (Beispieldaten)',
    jsonLabel: 'Auszug aus dem JSON-Export des Beispiel-Steckbriefs',
    pdfTitel: 'Steckbrief (Beispieldaten)',
    format: 'Format motavi-arbeitsplatz-steckbrief, Version 1.0, mit JSON Schema',
  },

  neutral: {
    label: 'Neutralität',
    titel: 'Gegenüber Endkunden bleibt Motavi neutral',
    punkte: [
      { titel: 'Auch nicht automatisieren ist ein Ergebnis', text: 'Motavi empfiehlt Verbessern, Automatisieren oder Beibehalten nach denselben Regeln, unabhängig von Anfragen aus dem Markt.' },
      { titel: 'Typen, keine Hersteller', text: 'Der Steckbrief nennt Automatisierungstypen, nie Hersteller oder Produkte.' },
      { titel: 'Daten nur mit Freigabe', text: 'Steckbriefe eines Kunden erhalten Sie nur, wenn der Kunde sie freigibt.' },
    ],
  },

  cta: { titel: 'Sprechen wir über eine Zusammenarbeit', label: 'Partnergespräch vereinbaren', to: '/pilot?ich=anbieter' },
}
