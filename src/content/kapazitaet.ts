import type { Accent, PageMeta } from './types'

/** /kapazitaet (WEBSITE_PLAN §3 and §4.1, DESIGN_BRIEF §5). */
export const kapazitaet = {
  meta: {
    title: 'Kapazität',
    description:
      'Wie viele Stunden stecken in nicht wertschöpfender Bewegung? Rechnen Sie aus, welche Kapazität sich durch bessere Gestaltung der Abläufe gewinnen lässt.',
  } satisfies PageMeta,
  label: 'Kapazität',
  accent: 'gain-ink' as Accent,
  title: 'Wie viele Stunden stecken in nicht wertschöpfender Bewegung?',
  intro:
    'Gehen, Suchen, Warten und ungünstige Greifwege kosten an jedem Arbeitsplatz Minuten, Schicht für Schicht. Motavi misst, wo diese Zeit steckt und wie viel sich durch Gestaltung zurückgewinnen lässt. Kapazität gewinnen trotz Fachkräftemangel.',

  rechner: {
    id: 'rechner',
    label: 'Rechner',
    titel: 'Was steckt in Ihren Arbeitsplätzen?',
    intro: 'Stellen Sie Ihre Annahmen ein. Das Ergebnis zeigt, welche Kapazität Sie durch eine bessere Gestaltung gewinnen können, in Stunden, Euro und Vollzeitstellen.',
    felder: {
      arbeitsplaetze: { label: 'Arbeitsplätze', einheit: '' },
      nwsMinuten: { label: 'Nicht wertschöpfende Bewegung je Schicht', einheit: 'min' },
      vermeidbarProzent: { label: 'Davon durch Gestaltung vermeidbar', einheit: '%' },
      schichtenProTag: { label: 'Schichten pro Tag', einheit: '' },
      arbeitstageProJahr: { label: 'Arbeitstage pro Jahr', einheit: '' },
      stundensatz: { label: 'Vollkosten pro Stunde', einheit: '€' },
    },
    ergebnisTitel: 'Gewonnene Kapazität',
    ergebnisse: {
      stunden: { label: 'Stunden', unit: 'pro Jahr' },
      euro: { label: 'Euro', unit: 'pro Jahr' },
      vollzeit: { label: 'Kapazität in Vollzeitstellen', unit: 'z. B. für offene Stellen' },
    },
    pflichthinweis: 'Beispielrechnung auf Basis Ihrer Annahmen. Die tatsächlichen Werte ermittelt die Analyse.',
    vollzeitHinweis: (stunden: string) => `Eine Vollzeitstelle entspricht ${stunden} Arbeitsstunden pro Jahr.`,
    formel: {
      titel: 'So wird gerechnet',
      zeilen: [
        'Vermeidbare Minuten je Platz und Schicht = nicht wertschöpfende Bewegung × vermeidbarer Anteil',
        'Stunden pro Jahr = Arbeitsplätze × vermeidbare Minuten × Schichten × Arbeitstage ÷ 60',
        'Euro pro Jahr = Stunden × Vollkosten pro Stunde',
        'Vollzeitstellen = Stunden ÷ 1.650',
      ],
    },
    /** Mini version on the start page: three sliders, the rest fixed */
    mini: {
      fest: (schichten: number, tage: number, satz: number) =>
        `Fest angenommen: ${schichten} Schichten pro Tag, ${tage} Arbeitstage, ${satz} € Vollkosten pro Stunde.`,
      link: { label: 'Mit allen Werten rechnen', to: '/kapazitaet#rechner' },
    },
  },

  wo: {
    label: 'Wo die Zeit steckt',
    titel: 'Vier Arten von Bewegung, die keinen Wert schaffen',
    intro: 'Notwendig ist vieles: Teile greifen, bringen, prüfen. Verschwendung ist, was der Ablauf verlangt, ohne dass es dem Produkt etwas hinzufügt.',
    punkte: [
      { titel: 'Gehen', text: 'Wege zu Material, Werkzeug oder Ablage, die bei anderer Anordnung kürzer wären oder entfallen.' },
      { titel: 'Suchen', text: 'Teile oder Werkzeuge ohne festen Platz. Suchen ist oft zu großen Teilen vermeidbar.' },
      { titel: 'Warten', text: 'Auf Maschine, Material oder den vorigen Schritt. Im Video als Ruhe im Ablauf sichtbar.' },
      { titel: 'Umgreifen und weite Griffe', text: 'Teile aus der Hand legen und neu fassen, Griffe unter Hüfthöhe, über Schulterhöhe oder weit vom Körper.' },
    ],
  },

  gestaltung: {
    label: 'Gestaltung vor Investition',
    titel: 'Oft reicht eine bessere Anordnung',
    intro: 'Bevor Geld in Anlagen fließt, lohnt der Blick auf den Ablauf. Viele Maßnahmen sind schnell und günstig umzusetzen.',
    punkte: [
      { titel: 'Materialbereitstellung', text: 'Teile in Greifhöhe und in der Reihenfolge des Ablaufs bereitstellen.' },
      { titel: 'Greifraum', text: 'Häufig gebrauchte Teile und Werkzeuge in den Bereich zwischen Hüfte und Schulter, nah am Körper.' },
      { titel: 'Arbeitshöhen', text: 'Tische, Ablagen und Behälter so einstellen, dass Bücken und Überkopfarbeit entfallen.' },
      { titel: 'Layout', text: 'Wege verkürzen, Stationen zusammenlegen, feste Plätze für alles, was gesucht wird.' },
    ],
  },

  beispiel: {
    label: 'Fallbeispiel',
    titel: 'Abfülllinie, produzierende Industrie',
    wert: '57',
    einheit: 'Minuten',
    text: 'Potenzial pro Schicht bei 265 Minuten Bezugszeit, gelöst durch Gestaltung eines einzelnen Prozessschritts.',
    quelle: 'Ergebnis einer Analyse mit bewährter Methodik, 2020.',
  },
}
