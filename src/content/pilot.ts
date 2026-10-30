import type { Accent, PageMeta } from './types'

/** /pilot (WEBSITE_PLAN Phase 6): form for manufacturers and for robotics providers or integrators. */
export const pilot = {
  meta: {
    title: 'Pilot anfragen',
    description: 'Erproben Sie Motavi an Ihren Arbeitsplätzen. Für Hersteller sowie Robotik-Anbieter und Integratoren.',
  } satisfies PageMeta,
  label: 'Pilot anfragen',
  accent: 'data-ink' as Accent,
  title: 'Pilot anfragen',
  intro: 'Sie möchten Motavi an Ihren Arbeitsplätzen erproben oder als Robotik-Anbieter mit uns sprechen? Schreiben Sie uns, wir melden uns.',

  formular: {
    zielgruppe: {
      legende: 'Ich bin',
      optionen: { hersteller: 'Hersteller', anbieter: 'Robotik-Anbieter oder Integrator' },
    },
    name: 'Name',
    unternehmen: 'Unternehmen',
    funktion: 'Funktion',
    email: 'E-Mail',
    telefon: 'Telefon',
    anzahl: 'Anzahl Arbeitsplätze',
    anzahlHinweis: 'Ungefähr, für eine erste Einschätzung.',
    interesse: { legende: 'Interesse', optionen: { kapazitaet: 'Kapazität', automatisierung: 'Automatisierung', gesundheit: 'Gesundheit' } },
    nachricht: 'Ihre Nachricht',
    honeypot: 'Bitte leer lassen',
    senden: 'Anfrage senden',
    sendet: 'Wird gesendet …',
    datenschutz: 'Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu bearbeiten. Mehr dazu in der',
    datenschutzLink: 'Datenschutzerklärung',
    fehlerTitel: 'Bitte prüfen Sie Ihre Angaben.',
  },
  fehler: {
    zielgruppe: 'Bitte wählen Sie aus, wer Sie sind.',
    name: 'Bitte geben Sie Ihren Namen an.',
    unternehmen: 'Bitte geben Sie Ihr Unternehmen an.',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
    telefon: 'Bitte nur Ziffern, Leerzeichen und + ( ) / - verwenden.',
    anzahl: 'Bitte eine ganze Zahl ab 1 angeben.',
    nachricht: 'Bitte höchstens 4.000 Zeichen.',
  },
  erfolg: {
    titel: 'Vielen Dank, Ihre Anfrage ist angekommen.',
    text: 'Wir melden uns in der Regel innerhalb von zwei Werktagen.',
  },
  fehlschlag: {
    titel: 'Ihre Anfrage konnte nicht gesendet werden.',
    zuViele: 'Es wurden zu viele Anfragen gesendet. Bitte versuchen Sie es später erneut.',
    text: 'Bitte schreiben Sie uns direkt per E-Mail:',
  },
}
