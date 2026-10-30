import type { Accent, PageMeta } from './types'

/**
 * /betriebsrat (WEBSITE_PLAN §3, guideline 6). Describes how Motavi works,
 * no legal advice. Statements on deletion periods: hard condition in
 * docs/GO_LIVE_CHECKLISTE.md.
 */
export const betriebsrat = {
  meta: {
    title: 'Datenschutz und Betriebsrat',
    description:
      'Motavi bewertet Tätigkeiten und Arbeitsplätze, nie Personen. Anonymisierung, Speicherfristen, Mitbestimmung, Zweckbindung und der Umgang mit Automatisierung.',
  } satisfies PageMeta,
  label: 'Datenschutz und Betriebsrat',
  accent: 'data-ink' as Accent,
  title: 'Mit dem Betriebsrat, nicht an ihm vorbei',
  intro:
    'Motavi bewertet Tätigkeiten und Arbeitsplätze, nie Personen. Auf dieser Seite steht, was wir messen, was wir nicht messen, wie lange wir Daten aufbewahren und wie wir mit Automatisierung umgehen.',
  navLabel: 'Inhalt dieser Seite',

  abschnitte: [
    {
      id: 'versprechen',
      titel: 'Unser Versprechen',
      absaetze: [],
      punkte: [
        'Motavi bewertet Tätigkeiten und Arbeitsplätze, nie Personen.',
        'Keine Leistungskontrolle und keine Vergleiche zwischen Beschäftigten.',
        'Ziel ist, Abläufe besser zu gestalten und Belastungen zu verringern.',
      ],
    },
    {
      id: 'messung',
      titel: 'Was Motavi misst und was nicht',
      absaetze: [
        'Aus dem Video bestimmt Motavi Gelenkpunkte des Körpers: Schultern, Ellbogen, Hände, Hüfte, Knie. Daraus entstehen Kennzahlen zum Arbeitsplatz: Dauer eines Arbeitsdurchgangs, Ablaufschritte, Greifraum, Arbeitshöhen und Körperhaltung.',
        'Die Kennzahlen beschreiben den Arbeitsplatz und den Ablauf. Sie werden keiner Person zugeordnet, nicht zwischen Personen verglichen und nicht zur Beurteilung von Leistung verwendet. Eine Aufnahme gehört zu einem Arbeitsplatz, nicht zu einer Person; Namen oder Personalnummern werden nicht erfasst.',
      ],
      punkte: [],
    },
    {
      id: 'anonymisierung',
      titel: 'Anonymisierung und Speicherfristen',
      absaetze: [
        'Das Originalvideo wird unmittelbar nach der Auswertung automatisch gelöscht, auch wenn die Auswertung fehlschlägt. Aufbewahrt werden ein Video mit unkenntlich gemachtem Kopfbereich und die Gelenkpunkte, beides 30 Tage, sowie die Kennzahlen und der Steckbrief, 365 Tage. Gelenkpunkte sind Koordinaten, keine Bilder.',
        'Die Daten liegen auf Servern in Deutschland (Frankfurt).',
      ],
      punkte: [],
    },
    {
      id: 'mitbestimmung',
      titel: 'Mitbestimmung',
      absaetze: [
        'Videoaufnahmen am Arbeitsplatz berühren in der Regel die Mitbestimmung des Betriebsrats nach § 87 Absatz 1 Nummer 6 Betriebsverfassungsgesetz. Motavi wird deshalb nur mit Beteiligung des Betriebsrats eingesetzt.',
        'Wir empfehlen, vor der ersten Aufnahme gemeinsam festzuhalten, wofür die Daten genutzt werden, welche Arbeitsplätze aufgenommen werden, wie lange Daten aufbewahrt werden und wer Zugriff hat. Gern stellen wir dem Betriebsrat das Vorgehen vorab vor.',
      ],
      punkte: [],
    },
    {
      id: 'zweck',
      titel: 'Zweckbindung',
      absaetze: ['Die Daten dienen nur der Gestaltung von Arbeitsplätzen und der Entscheidung, ob ein Arbeitsplatz verbessert, automatisiert oder beibehalten wird.'],
      punkte: [
        'Keine Leistungskontrolle und keine Personalentscheidungen auf Grundlage der Daten.',
        'Keine Weitergabe an Dritte ohne Freigabe des Unternehmens.',
        'Keine Nutzung der Videos oder Gelenkpunkte zum Training von Robotern oder KI-Modellen.',
      ],
    },
    {
      id: 'automatisierung',
      titel: 'Automatisierung und Beschäftigung',
      absaetze: [
        'Automatisierung ist eine mögliche Antwort, nicht das Ziel. Motavi empfiehlt sie dort, wo Tätigkeiten belastend oder monoton sind und sich gleichförmig wiederholen, und oft erst, nachdem der Ablauf verbessert wurde. Ebenso häufig lautet die Empfehlung Verbessern oder Beibehalten.',
        'Ziel ist, belastende und monotone Tätigkeiten zu übernehmen und Kapazität zu gewinnen, wo Stellen schwer zu besetzen sind. Wie gewonnene Kapazität eingesetzt wird, entscheidet das Unternehmen gemeinsam mit dem Betriebsrat. Wir empfehlen, den Betriebsrat früh einzubeziehen, wenn aus einer Empfehlung ein Projekt wird.',
      ],
      punkte: [],
    },
  ],

  hinweis: 'Diese Seite beschreibt, wie Motavi arbeitet. Sie ist keine Rechtsberatung.',
  datenschutzLink: { label: 'Zur Datenschutzerklärung', to: '/datenschutz' },
}
