import type { Accent, PageMeta } from './types'

/**
 * /gesundheit (WEBSITE_PLAN §3: REBA, LMM, CSRD, Fehltage). The analysis
 * module computes REBA, not the Leitmerkmalmethode: the page says so and
 * promises nothing more (WEBSITE_PLAN, introduction). No legal advice.
 */
export const gesundheit = {
  meta: {
    title: 'Gesundheit und Compliance',
    description:
      'Wo ist die körperliche Belastung am höchsten, und was hilft am schnellsten? Belastung nach REBA, Daten für Gefährdungsbeurteilung und Berichterstattung.',
  } satisfies PageMeta,
  label: 'Gesundheit',
  accent: 'risk-ink' as Accent,
  title: 'Wo ist die Belastung am höchsten, und was hilft am schnellsten?',
  intro:
    'Motavi bewertet die körperliche Belastung von Tätigkeiten aus einem Video und zeigt, welche Gestaltung am meisten entlastet. Bewertet wird die Tätigkeit am Arbeitsplatz, nie die Person.',

  reba: {
    label: 'REBA',
    titel: 'Körperhaltung bewertet nach REBA',
    absaetze: [
      'REBA (Rapid Entire Body Assessment) ist ein verbreitetes Verfahren, um die Belastung durch Körperhaltungen zu bewerten. Es betrachtet Rumpf, Nacken, Beine, Ober- und Unterarme sowie Handgelenke und ergibt einen Wert von 1 bis 15.',
      'Motavi bestimmt die Haltung aus den Gelenkpunkten über die gesamte Aufnahme und gibt den Mittelwert, die belastendsten Momente und die Zeitanteile für Bücken und Überkopfarbeit aus. Die Körperregionen mit der höchsten Belastung zeigt eine Übersicht.',
    ],
    stufenTitel: 'Stufen',
    stufen: [
      { bereich: 'unter 2', stufe: 'vernachlässigbar' },
      { bereich: '2 bis unter 4', stufe: 'niedrig' },
      { bereich: '4 bis unter 8', stufe: 'mittel' },
      { bereich: '8 bis unter 11', stufe: 'hoch' },
      { bereich: 'ab 11', stufe: 'sehr hoch' },
    ],
    vorrang: (s: string) => `Ab einem REBA-Mittel von ${s} markiert der Steckbrief den Arbeitsplatz als vorrangig, unabhängig von der Empfehlung.`,
    pilotHinweis: 'Die Berechnung von REBA aus dem Video ist noch nicht gegen manuelle REBA-Bewertungen geprüft.',
    drehung: 'Zusätzlich misst der Steckbrief Drehungen des Oberkörpers. Weil die Tiefe aus einem 2D-Video geschätzt wird, ist dieser Wert grob.',
  },

  lmm: {
    label: 'Leitmerkmalmethode',
    titel: 'Daten für die Leitmerkmalmethode',
    absaetze: [
      'Die Leitmerkmalmethoden der Bundesanstalt für Arbeitsschutz und Arbeitsmedizin bewerten körperliche Belastung zum Beispiel beim Heben, Halten und Tragen oder bei manuellen Arbeitsprozessen. Sie verbinden Dauer und Häufigkeit mit Last, Körperhaltung und Ausführungsbedingungen.',
      'Motavi misst einen Teil dieser Merkmale im Video: Häufigkeit der Arbeitsdurchgänge, Dauer, Haltungen wie Bücken, Überkopfarbeit und Drehung. Das Teilegewicht geben Sie an. Diese Werte können in eine Bewertung nach Leitmerkmalmethode einfließen. Eine automatische Bewertung nach Leitmerkmalmethode bietet Motavi derzeit nicht.',
    ],
  },

  csrd: {
    label: 'Berichterstattung',
    titel: 'Gefährdungsbeurteilung und Nachhaltigkeitsbericht',
    absaetze: [
      'Arbeitgeber beurteilen die Gefährdungen an den Arbeitsplätzen nach dem Arbeitsschutzgesetz. Motavi liefert dafür dokumentierte, wiederholbare Belastungsanalysen je Arbeitsplatz und zeigt, welche Maßnahmen die Belastung senken.',
      'Für berichtspflichtige Unternehmen verlangt der europäische Standard ESRS S1 Angaben zu Gesundheit und Sicherheit der eigenen Belegschaft. Motavi kann diese Berichterstattung mit Daten zur Belastung und zu umgesetzten Maßnahmen stützen. Die Pflichtangaben selbst, etwa zu Arbeitsunfällen und Ausfalltagen, erhebt Motavi nicht.',
    ],
    hinweis: 'Welche Pflichten für Ihr Unternehmen gelten, klären Sie bitte mit Ihrer Fachkraft für Arbeitssicherheit oder Ihrer Rechtsberatung. Diese Seite ist keine Rechtsberatung.',
  },

  fehltage: {
    label: 'Fehlzeiten',
    titel: 'Belastung kostet Gesundheit und Kapazität',
    text: 'Erkrankungen von Muskeln und Skelett gehören zu den häufigsten Gründen für Arbeitsunfähigkeit. Wer weiß, an welchem Arbeitsplatz die Belastung entsteht, kann gezielt dort ansetzen, statt allgemein zu schulen.',
    /**
     * Figure with source (decision 31.10.2026). TODO: set `wert` (e.g. '24,1 %')
     * only after the figure has been confirmed; until then the page shows a
     * marked placeholder, which npm run golive:check reports.
     */
    kennzahl: {
      wert: null as string | null,
      beschreibung: 'Anteil der Muskel-Skelett-Erkrankungen an den Arbeitsunfähigkeitstagen',
      quelle: 'Quelle: BKK Gesundheitsreport 2025, Berichtsjahr 2024',
      platzhalter: 'Die Zahl wird nach Prüfung der Quelle ergänzt.',
    },
  },

  massnahmen: {
    label: 'Was am schnellsten hilft',
    titel: 'Oft entlastet schon eine andere Anordnung',
    punkte: [
      { titel: 'Arbeitshöhen anpassen', text: 'Tische, Ablagen und Behälter so einstellen, dass Bücken und Überkopfarbeit entfallen.' },
      { titel: 'Greifraum verkleinern', text: 'Häufig gebrauchte Teile zwischen Hüfte und Schulter, nah am Körper bereitstellen.' },
      { titel: 'Drehungen vermeiden', text: 'Zuführung und Ablage so anordnen, dass der Oberkörper nicht verdreht werden muss.' },
      { titel: 'Heben erleichtern', text: 'Hebehilfen und Kippvorrichtungen bei schweren Teilen. Wo die Belastung bleibt, kann eine Automatisierung die Tätigkeit übernehmen.' },
    ],
  },
}
