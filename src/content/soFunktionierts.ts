import type { Accent, PageMeta } from './types'

/**
 * /so-funktionierts (WEBSITE_PLAN §3: Video, Messung, Expertenbewertung,
 * Steckbrief und Report). Recording hints follow the analysis module:
 * at least three valid cycles for the cycle detection, five for the variation.
 */
export const soFunktionierts = {
  meta: {
    title: 'So funktioniert es',
    description:
      'Vom Video zur Empfehlung in vier Schritten: Video aufnehmen, automatische Messung, Bewertung durch einen Experten, Steckbrief und Report.',
  } satisfies PageMeta,
  label: 'Ablauf',
  accent: 'data-ink' as Accent,
  title: 'So funktioniert Motavi',
  intro:
    'Vom Video zur Empfehlung in vier Schritten: Sie nehmen ein Video auf, Motavi misst, ein Experte bewertet, und Sie erhalten Steckbrief und Report. Das Tool misst, der Experte bewertet.',

  schritte: [
    {
      nr: '01',
      titel: 'Video aufnehmen',
      text: 'Ein Video des Arbeitsplatzes mit dem Smartphone. Keine Sensoren, keine Umbauten, kein Eingriff in den Ablauf.',
      details: [
        'Kamera fest aufstellen, am besten auf einem Stativ, seitlich oder schräg von vorn.',
        'Die ganze Person im Bild, von Kopf bis Fuß, möglichst nur eine Person.',
        'Mindestens fünf, besser zehn vollständige Arbeitsdurchgänge aufnehmen.',
        'Gutes Licht, keine starken Gegenlichter. Formate MP4 oder WebM.',
        'Vorher die Beschäftigten informieren und den Einsatz mit dem Betriebsrat abstimmen.',
      ],
    },
    {
      nr: '02',
      titel: 'KI misst',
      text: 'Aus jedem Bild bestimmt Motavi Gelenkpunkte des Körpers. Daraus werden Zyklen, Zeiten, Greifraum und Belastung berechnet.',
      details: [
        'Erkannt werden Gelenkpunkte, keine Gesichter und keine Identität.',
        'Im aufbewahrten Video ist der Kopfbereich unkenntlich gemacht.',
        'Das Originalvideo wird unmittelbar nach der Auswertung automatisch gelöscht.',
        'Wiederkehrende Arbeitsdurchgänge, Ablaufphasen, Greifraum, Arbeitshöhen und Körperhaltung nach REBA.',
      ],
      pilot: true,
    },
    {
      nr: '03',
      titel: 'Experte bewertet',
      text: 'Ein Experte prüft die Messung, ordnet die Ablaufschritte zu, stuft sie ein und bestätigt oder ändert Empfehlung und Automatisierungstyp.',
      details: [
        'Ablaufschritte wie Greifen, Fügen oder Suchen zuordnen und als wertschöpfend, notwendig oder Verschwendung einstufen.',
        'Die Zuordnung gilt für alle erkannten Durchgänge.',
        'Empfehlung und Automatisierungstyp bestätigen oder begründet ändern.',
      ],
      betont: true,
    },
    {
      nr: '04',
      titel: 'Steckbrief und Report',
      text: 'Sie erhalten je Arbeitsplatz den Steckbrief mit Empfehlung, Kennzahlen und grober Wirtschaftlichkeit sowie den Ergonomie-Report.',
      details: [
        'Arbeitsplatz-Steckbrief als Ansicht im Dashboard und als PDF auf zwei Seiten.',
        'Ergonomie-Report als PDF auf vier Seiten.',
        'Export als JSON in einem dokumentierten, herstellerneutralen Format.',
      ],
    },
  ],
  betontHinweis: 'Das Tool misst, der Experte bewertet.',
  pilotLabel: 'Pilotphase',
  pilotHinweis: 'Die automatische Messung von Zyklen, Ablaufschritten und Greifraum wird noch mit manuellen Messungen abgeglichen.',

  ihreAngaben: {
    label: 'Ihre Angaben',
    titel: 'Was wir von Ihnen brauchen',
    intro: 'Einige Werte lassen sich nicht im Video messen. Ohne sie fehlen Euro-Werte, und die Bewertung nennt die fehlenden Kriterien.',
    punkte: [
      { titel: 'Teile', text: 'Gewicht und grobe Abmessungen, Anzahl der Varianten.' },
      { titel: 'Schichtmodell', text: 'Schichten pro Tag, Schichtdauer, Arbeitstage pro Jahr, Stück pro Schicht.' },
      { titel: 'Kosten', text: 'Vollkosten pro Stunde, auf Wunsch eine grobe Investitionsbandbreite.' },
      { titel: 'Stellenbesetzung', text: 'Wie schwer die Stelle zu besetzen ist.' },
    ],
  },

  links: [
    { label: 'Jede Kennzahl erklärt', to: '/arbeitsplatz-steckbrief' },
    { label: 'Pakete', to: '/pakete' },
    { label: 'Datenschutz und Betriebsrat', to: '/betriebsrat' },
  ],
}
