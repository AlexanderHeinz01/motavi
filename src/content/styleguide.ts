import type { Accent, PageMeta } from './types'

/**
 * Internal styleguide /_styleguide (design phase D1, DESIGN_BRIEF §4 and §9).
 * noindex, not in sitemap or navigation. Demo texts only.
 */
export const styleguide = {
  meta: {
    title: 'Styleguide',
    description: 'Interne Übersicht aller Komponenten und Zustände der Motavi-Website.',
  } satisfies PageMeta,
  label: 'Intern',
  title: 'Styleguide',
  intro:
    'Alle Komponenten der Website in ihren Varianten und Zuständen. Hover und Fokus sind hier dauerhaft eingeschaltet, damit man sie ohne Maus und Tastatur prüfen kann. Die Seite ist nicht verlinkt und nicht indexiert.',
  inhalt: 'Inhalt',

  zustaende: {
    normal: 'Normal',
    hover: 'Hover',
    fokus: 'Fokus',
    deaktiviert: 'Deaktiviert',
    fehler: 'Fehler',
    aktiv: 'Aktiv',
    ausgewaehlt: 'Ausgewählt',
    bedienbar: 'Normal, bedienbar',
    ersteAntwort: 'erste Antwort',
    ausgefuellt: 'Ausgefüllt, optional',
    keinFehler: {
      button: 'Buttons haben keinen Fehlerzustand. Fehler zeigt das Formularfeld.',
      karte: 'Die Karte hat keinen deaktivierten Zustand und keinen Fehlerzustand.',
      regler: 'Der Schieberegler hat keinen Fehlerzustand, er lässt nur gültige Werte zu.',
    },
  },

  tokens: {
    titel: 'Farben, Schrift, Formen',
    hell: 'Heller Grund',
    dunkel: 'Dunkler Grund (.surface-inverse)',
    typo: 'Typografie',
    typoBeispiel: 'Jede Bewegung im Arbeitsablauf messbar',
    kpiBeispiel: '23.400 €',
    vorschau: 'Aa',
    formen: 'Radien und Trennlinie',
    radiusButton: 'Button 8 px',
    radiusKarte: 'Karte 12 px',
    trennlinie: 'Punktierte Trennlinie',
  },

  button: {
    titel: 'Button',
    varianten: { primary: 'Primär', secondary: 'Sekundär', text: 'Textlink' },
    beschriftung: 'Pilot anfragen',
    link: 'Als Link (ButtonLink)',
  },

  kategorie: { titel: 'Kategorie-Label' },

  empfehlung: {
    titel: 'Empfehlungs-Label',
    ruhig: 'ruhig (Tönung, Text in --text)',
    kraeftig: 'kräftig (volle Fläche, Text in --on-path)',
    gross: 'Größe lg mit Vorrang',
    dunkel: 'Auf dunklem Grund',
  },

  entscheidungsweg: { titel: 'Entscheidungsweg', gross: 'Groß (Startseite)', kompakt: 'Kompakt (Steckbrief)' },

  kpi: {
    titel: 'KPI-Kachel',
    kacheln: [
      { label: 'Zeit', accent: 'data-ink', value: '38,4', unit: 's', description: 'Zykluszeit je Teil, Median aus 690 Zyklen', source: 'Beispielwert' },
      { label: 'Kosten', accent: 'gain-ink', value: '23.400', unit: '€', description: 'pro Jahr, 64 Minuten je Schicht ohne Wertschöpfung', source: 'Beispielwert' },
      { label: 'Belastung', accent: 'risk-ink', value: '5,8', unit: 'Index', description: 'Mittelwert, Rumpfwinkel bis 45 Grad', source: 'Beispielwert' },
    ] satisfies { label: string; accent: Accent; value: string; unit: string; description: string; source: string }[],
  },

  nutzen: {
    titel: 'Nutzen-Karte',
    karte: {
      title: 'Kapazität sichtbar machen',
      text: 'Wo geht Zeit verloren, und wie viel davon lässt sich durch Gestaltung zurückholen?',
      link: { label: 'Mehr zu Kapazität', to: '/kapazitaet' },
    },
  },

  paket: {
    titel: 'Paket-Karte',
    karten: [
      {
        name: 'Steckbrief',
        preis: 'ab 1.900 €',
        preisHinweis: 'Beispielpreis, zzgl. USt.',
        leistungen: ['Ein Arbeitsplatz', 'Steckbrief als PDF', 'Besprechung der Empfehlung'],
        cta: { label: 'Anfragen', to: '/pilot' },
      },
      {
        name: 'Pilot',
        preis: 'ab 4.900 €',
        preisHinweis: 'Beispielpreis, zzgl. USt.',
        leistungen: ['Bis zu fünf Arbeitsplätze', 'Steckbriefe und Vergleich', 'Workshop mit Ihrem Team'],
        cta: { label: 'Pilot anfragen', to: '/pilot' },
        empfohlen: true,
      },
      {
        name: 'Werk',
        preis: 'auf Anfrage',
        leistungen: ['Alle Arbeitsplätze einer Linie', 'Dashboard', 'Wiederholungsmessung'],
        cta: { label: 'Gespräch vereinbaren', to: '/pilot' },
      },
    ],
  },

  vergleich: {
    titel: 'Vergleichstabelle',
    caption: 'Leistungen der Pakete im Vergleich (Beispiel)',
    pakete: [{ name: 'Steckbrief' }, { name: 'Pilot', empfohlen: true }, { name: 'Werk' }],
    zeilen: [
      { label: 'Arbeitsplätze', werte: ['1', 'bis 5', 'alle einer Linie'] },
      { label: 'Steckbrief als PDF', werte: [true, true, true] },
      { label: 'Workshop', werte: [false, true, true] },
      { label: 'Dashboard', werte: [false, false, true] },
    ],
  },

  rechner: {
    titel: 'Rechner-Panel und Schieberegler',
    zyklen: 'Zyklen pro Schicht',
    verlust: 'Sekunden ohne Wertschöpfung je Zyklus',
    stundensatz: 'Stundensatz',
    minuten: 'Minuten',
    euro: 'Euro',
    stunden: 'Stunden',
    proSchicht: 'pro Schicht',
    proJahr: 'pro Jahr',
    reglerZustaende: 'Schieberegler in allen Zuständen',
    regler: 'Schichten pro Tag',
  },

  formular: {
    titel: 'Formularfelder',
    name: 'Name',
    namePlatzhalter: 'Vor- und Nachname',
    email: 'E-Mail',
    emailHinweis: 'Wir melden uns in der Regel innerhalb einer Woche.',
    emailFehler: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    nachricht: 'Nachricht',
    nachrichtFehler: 'Bitte beschreiben Sie kurz Ihren Arbeitsplatz.',
    branche: 'Branche',
    brancheFehler: 'Bitte wählen Sie eine Branche.',
    branchen: [
      { value: '', label: 'Bitte wählen' },
      { value: 'metall', label: 'Metallverarbeitung' },
      { value: 'elektro', label: 'Elektronikfertigung' },
      { value: 'logistik', label: 'Logistik' },
    ],
    textfeld: 'Textfeld',
    mehrzeilig: 'Mehrzeiliges Feld',
    auswahl: 'Auswahl',
    checkbox: 'Checkbox',
    zustimmung: 'Ich habe die Datenschutzhinweise gelesen.',
    zustimmungFehler: 'Bitte bestätigen Sie die Datenschutzhinweise.',
    eingabe: 'Beispiel GmbH',
  },

  fragen: {
    titel: 'Fragenkarte und Ergebnis',
    frage: 'Wie oft wiederholt sich der gleiche Ablauf an diesem Arbeitsplatz?',
    optionen: ['Mehrmals pro Minute', 'Einige Male pro Stunde', 'Selten, jeder Auftrag ist anders'],
    fehler: 'Bitte wählen Sie eine Antwort.',
    ergebnis: 'Ergebnis',
  },

  doppelScore: { titel: 'Doppel-Score' },

  steckbrief: {
    titel: 'Steckbrief-Vorschau',
    vollstaendig: 'Vollständig, mit Umschalter',
    kompakt: 'Kompakt',
  },

  zeitleiste: {
    titel: 'Zyklus-Zeitleiste',
    einzeln: 'Ein Zyklus',
    folge: 'Folge von Zyklen',
    ohneZyklus: 'Ohne wiederkehrenden Zyklus',
  },

  greifraum: { titel: 'Greifraum-Grafik' },

  skelett: {
    titel: 'Skelett-Visual',
    hinweis:
      'Animiert mit Pausenknopf; bei reduzierter Bewegung und ohne JavaScript steht der Endzustand mit allen Werten. Weitere Zeitpunkte auf /_design/skelett.',
    greifen: 'Animiert: Greifen und Platzieren (Hero)',
    buecken: 'Animiert: Bücken (Gesundheit)',
    trenner: 'Statisch: Abschnittstrenner',
    gebueckt: 'Gebückte Haltung auf dunklem Grund',
    gebuecktLabel: 'Bewegungsskelett in gebückter Haltung',
  },

  hinweis: {
    titel: 'Hinweisbox',
    methodeTitel: 'Zur Methode',
    methode: 'Der Haltungsindex bewertet Körperhaltungen anhand von Gelenkwinkeln nach den Bereichen von REBA. Wir messen die Winkel im Video und bewerten Tätigkeiten, nicht Personen.',
    datenschutzTitel: 'Datenschutz',
    datenschutz: 'Das Originalvideo wird unmittelbar nach der Auswertung automatisch gelöscht. Aufbewahrt werden nur ein Video mit unkenntlich gemachtem Kopfbereich und die Gelenkpunkte, beides 30 Tage, sowie die Kennzahlen.',
  },

  partner: { titel: 'Partnerhinweis' },

  dashboard: {
    titel: 'Dashboard-Vorschau',
    reba: 'Haltungsindex',
    regionen: 'Belastung nach Körperregion',
    hinweis: 'Die Diagrammfarben im Dashboard werden in einem eigenen Schritt an die Tokens angeglichen (DESIGN_BRIEF §10.4).',
  },

  navigation: {
    titel: 'Navigation',
    desktop: 'Hauptnavigation Desktop',
    mobil: 'Menü mobil (statische Vorschau)',
    live: 'Der echte Header steht oben auf dieser Seite.',
  },

  footer: { titel: 'Footer', live: 'Der echte Footer steht unten auf dieser Seite.', links: 'Footer-Links' },

  kontrast: {
    titel: 'Kontrastprüfung (WCAG AA)',
    intro:
      'Alle Kombinationen aus DESIGN_BRIEF §3. Text braucht mindestens 4,5:1, Linien, Symbole und Grafiken mindestens 3:1. Dieselbe Liste prüft der automatisierte Test (npm test).',
    spalten: { kombination: 'Kombination', vorschau: 'Vorschau', wert: 'Kontrast', minimum: 'Minimum', ergebnis: 'Ergebnis' },
    bestanden: 'bestanden',
    nichtBestanden: 'nicht bestanden',
    zusammenfassung: (ok: number, gesamt: number) => `${ok} von ${gesamt} Kombinationen bestehen.`,
  },
}
