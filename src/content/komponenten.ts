/** Fixed texts used inside library components (src/ui). */

export const paketText = { empfohlen: 'Empfohlen', enthalten: 'enthalten', nichtEnthalten: 'nicht enthalten' }

export const formularText = {
  optional: 'optional',
  fehlerPraefix: 'Fehler:',
}

export const fragenText = {
  fortschritt: (n: number, total: number) => `Frage ${n} von ${total}`,
  zurueck: 'Zurück',
  weiter: 'Weiter',
  auswerten: 'Auswerten',
  ergebnis: 'Ihr Ergebnis',
  ergebnisHinweis: 'Im Steckbrief messen wir diese Kriterien objektiv im Video.',
}

export const entscheidungswegText = {
  messung: 'Eine Messung',
  liste: 'Drei mögliche Empfehlungen',
  nichtZutreffend: 'nicht zutreffend',
  zutreffend: 'zutreffend',
}

export const doppelScoreText = {
  verbesserung: 'Verbesserungs-Score',
  automatisierung: 'Automatisierungs-Score',
  schwelle: 'Schwelle',
  empfehlung: 'Abgeleitete Empfehlung',
}

export const steckbriefText = {
  titel: 'Arbeitsplatz-Steckbrief',
  beispiel: 'Beispieldaten',
  pilot: 'Pilotphase',
  umschalter: 'Beispiel wählen',
  empfehlung: 'Empfehlung',
  begruendung: 'Begründung',
  bewertung: 'Bewertung',
  kennzahlen: 'Kennzahlen',
  zykluszeit: 'Zykluszeit (Median)',
  schwankung: 'Schwankung (VK)',
  zyklen: 'Zyklen pro Schicht',
  zeitanteil: 'Zeitanteil in Zyklen',
  reba: 'Haltungsindex (Mittel, 1 bis 10)',
  drehungen: 'Drehungen pro Zyklus',
  ausserhalb: 'Griffe außerhalb des Greifraums',
  ablauf: 'Ablauf je Zyklus',
  greifraum: 'Greifraum und Arbeitshöhen',
  wirtschaft: 'Was die Empfehlung bringt',
  minutenVerbesserung: 'Minuten pro Schicht durch Gestaltung',
  euroVerbesserung: 'Euro pro Jahr durch Gestaltung',
  stundenAuto: 'Automatisierungspotenzial',
  stundenAutoEinheit: 'Stunden pro Jahr',
  euroAuto: 'Potenzial in Euro pro Jahr',
  nachBetriebskosten: 'nach Abzug der Betriebskosten der Anlage',
  typ: 'Automatisierungstyp (Vorschlag)',
  aufVerbessertemAblauf: 'Automatisierung gerechnet auf den verbesserten Ablauf.',
  ergebnis: 'Ergebnis',
  keineInvestition: 'Keine Investition nötig',
  keineInvestitionText:
    'Der Arbeitsplatz passt zu seiner Aufgabe. Weder Gestaltung noch Automatisierung brächten nennenswerten Nutzen; das vermeidet eine Fehlinvestition.',
  gestaltungspotenzial: 'Gestaltungspotenzial',
  keinZyklus: 'Kein wiederkehrender Zyklus erkannt',
  nichtMessbar: 'nicht belastbar messbar',
  annahmen: (schichten: number, tage: number, satz: number) =>
    `Annahmen: ${schichten} Schichten, ${tage} Arbeitstage, ${satz} € je Stunde.`,
  pflichthinweis: 'Grobe Abschätzung, ersetzt kein Angebot.',
  taetigkeit: 'Bewertet wird die Tätigkeit am Arbeitsplatz, nicht die Person.',
  bis: 'bis',
  reba_stufen: { niedrig: 'niedrig', mittel: 'mittel', hoch: 'hoch', sehrHoch: 'sehr hoch' },
  /** Reasons, each built on a measured value (src/lib/steckbrief.ts). */
  gruende: {
    verschwendung: (anteil: string, typen: string) => `${anteil} des Zyklus ohne Wertschöpfung (${typen})`,
    greifraum: (anteil: string) => `${anteil} der Griffe außerhalb des günstigen Greifraums`,
    wiederholung: (zyklen: string, vk: string) => `${zyklen} gleichförmige Zyklen pro Schicht, Schwankung ${vk}`,
    schlank: (anteil: string) => `Ablauf bereits schlank, nur ${anteil} ohne Wertschöpfung`,
    keinZyklus: 'Kein wiederkehrender Zyklus: wechselnde Aufgaben ohne festes Muster',
    wenigZyklen: (anteil: string) => `Nur ${anteil} der Zeit in wiederkehrenden Zyklen`,
    wenigPotenzial: (min: string) => `Gestaltung brächte ${min} Minuten pro Schicht`,
    belastung: (reba: string, stufe: string) => `Haltungsindex ${reba}, ${stufe}`,
    vorrangig: 'Hohe Belastung: unabhängig von der Empfehlung vorrangig angehen',
  },
}

export const zeitleisteText = {
  wertschoepfend: 'wertschöpfend',
  notwendig: 'notwendig',
  verschwendung: 'Verschwendung',
  zyklus: 'Zyklus',
}

export const greifraumText = {
  zonen: {
    ueber_schulter: 'über Schulter',
    huefte_schulter: 'Hüfte bis Schulter',
    knie_huefte: 'Knie bis Hüfte',
    unter_knie: 'unter Knie',
  },
  guenstig: 'günstiger Greifraum',
  hinweis: 'Relative Werte aus 2D-Video. Für Zentimeterangaben ist eine Referenzmessung vor Ort nötig.',
  grafikLabel: 'Seitenansicht mit Höhenzonen und Verteilung der Handpositionen',
}

export const partnerText = {
  titel: 'Herstellerneutral',
  text: 'Motavi empfiehlt Wege und Automatisierungstypen, nie Hersteller oder Produkte.',
}

export const dashboardText = { titel: 'Analyse-App', demo: 'Demo-Daten' }

export const rechnerText = {
  ergebnis: 'Gewonnene Kapazität',
  pflichthinweis: 'Beispielrechnung auf Basis Ihrer Annahmen. Die tatsächlichen Werte ermittelt die Analyse.',
}
