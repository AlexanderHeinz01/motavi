import type { Accent, PageMeta } from './types'

/**
 * /so-funktionierts (WEBSITE_PLAN §3: Video, Messung, Expertenbewertung,
 * Report und Steckbrief; per package as decided on 31.10.2026: no expert and
 * no Steckbrief in the Video-Check). Recording hints follow the analysis module:
 * at least three valid cycles for the cycle detection, five for the variation.
 */
export const soFunktionierts = {
  meta: {
    title: 'So funktioniert es',
    description:
      'Vom Video zum Ergebnis in vier Schritten: Video aufnehmen, automatische Messung, Bewertung durch Experten für Arbeitsgestaltung und Zeitwirtschaft, Report und Steckbrief.',
  } satisfies PageMeta,
  label: 'Ablauf',
  accent: 'data-ink' as Accent,
  title: 'So funktioniert Motavi',
  intro:
    'Vom Video zum Ergebnis in vier Schritten: Ein Video wird aufgenommen, Motavi misst, erfahrene Experten bewerten, und Sie erhalten Report und, je nach Paket, den Steckbrief mit Empfehlung. Das Tool misst, die Experten bewerten.',

  schritte: [
    {
      nr: '01',
      titel: 'Video aufnehmen',
      text: 'Ein Video des Arbeitsplatzes mit dem Smartphone: beim Video-Check durch Sie nach diesen Hinweisen und über einen persönlichen Upload-Link, in den anderen Paketen durch uns vor Ort. Keine Sensoren, keine Umbauten, kein Eingriff in den Ablauf.',
      details: [
        'Kamera fest aufstellen, am besten auf einem Stativ, seitlich oder schräg von vorn.',
        'Die ganze Person im Bild, von Kopf bis Fuß, möglichst nur eine Person.',
        'Mindestens fünf, besser zehn vollständige Arbeitsdurchgänge aufnehmen.',
        'Gutes Licht, keine starken Gegenlichter. Formate MP4, WebM oder MOV.',
        'Wir empfehlen, die Beschäftigten vorher zu informieren und den Betriebsrat zu beteiligen.',
      ],
    },
    {
      nr: '02',
      titel: 'KI misst',
      text: 'Das Video wird verschlüsselt auf Server in Deutschland (Frankfurt) übertragen. Aus jedem Bild bestimmt Motavi Gelenkpunkte des Körpers und berechnet daraus Zyklen, Zeiten, Greifraum und Belastung.',
      details: [
        'Erkannt werden Gelenkpunkte, keine Gesichter und keine Identität.',
        'Das Originalvideo wird unmittelbar nach der Auswertung automatisch gelöscht. Ein Video wird nicht aufbewahrt.',
        'Auf den drei Standbildern der belastendsten Momente sind Köpfe und Gesichter aller Personen geschwärzt.',
        'Wiederkehrende Arbeitsdurchgänge, Ablaufphasen, Greifraum, Arbeitshöhen und Haltungsindex auf REBA-Basis.',
      ],
      pilot: true,
    },
    {
      nr: '03',
      titel: 'Experten bewerten',
      paket: 'Ab dem Paket Analyse vor Ort',
      text: 'Erfahrene Experten für Arbeitsgestaltung und Zeitwirtschaft (REFA) prüfen die Messung vor Ort, ordnen die Ablaufschritte zu, stufen sie ein und bestätigen oder ändern Empfehlung und Automatisierungstyp.',
      details: [
        'Ablaufschritte wie Greifen, Fügen oder Suchen zuordnen und als wertschöpfend, notwendig oder Verschwendung einstufen.',
        'Die Zuordnung gilt für alle erkannten Durchgänge.',
        'Empfehlung und Automatisierungstyp bestätigen oder begründet ändern.',
      ],
      betont: true,
    },
    {
      nr: '04',
      titel: 'Report und Steckbrief',
      text: 'Alle Pakete enthalten den Ergonomie-Report. Ab dem Paket Analyse vor Ort kommt je Arbeitsplatz der Steckbrief mit Empfehlung, Kennzahlen und grober Wirtschaftlichkeit dazu.',
      details: [
        'Ergonomie-Report als PDF auf vier Seiten, in allen Paketen.',
        'Arbeitsplatz-Steckbrief als PDF auf zwei Seiten, ab dem Paket Analyse vor Ort.',
        'Export als JSON in einem dokumentierten, herstellerneutralen Format, mit dem Steckbrief.',
      ],
    },
  ] as { nr: string; titel: string; text: string; details: string[]; paket?: string; pilot?: boolean; betont?: boolean }[],
  betontHinweis: 'Das Tool misst, die Experten bewerten.',
  pilotLabel: 'Pilotphase',
  pilotHinweis: 'Die automatische Messung von Zyklen, Ablaufschritten, Greifraum und Haltungsindex wird noch mit manuellen Messungen abgeglichen.',

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
