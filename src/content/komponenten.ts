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
  beispiel: 'Beispiel',
  pilot: 'Pilotphase',
  umschalter: 'Beispiel wählen',
  kennzahlen: 'Kennzahlen',
  zykluszeit: 'Zykluszeit (Median)',
  schwankung: 'Schwankung (VK)',
  zyklen: 'Zyklen pro Schicht',
  zeitanteil: 'Zeitanteil in Zyklen',
  reba: 'REBA (Mittel)',
  drehungen: 'Drehungen pro Zyklus',
  ausserhalb: 'Griffe außerhalb des Greifraums',
  ablauf: 'Ablauf je Zyklus',
  greifraum: 'Greifraum und Arbeitshöhen',
  wirtschaft: 'Was die Empfehlung bringt',
  minutenVerbesserung: 'Minuten pro Schicht durch Gestaltung',
  euroVerbesserung: 'Euro pro Jahr durch Gestaltung',
  stundenAuto: 'Stunden pro Jahr für Automatisierung',
  typ: 'Automatisierungstyp (Vorschlag)',
  keinZyklus: 'Kein wiederkehrender Zyklus erkannt',
  nichtMessbar: 'nicht belastbar messbar',
  annahmen: (schichten: number, tage: number, satz: number) =>
    `Annahmen: ${schichten} Schichten, ${tage} Arbeitstage, ${satz} € je Stunde.`,
  pflichthinweis: 'Grobe Abschätzung, ersetzt kein Angebot.',
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
  ergebnis: 'Freisetzbare Kapazität',
  pflichthinweis: 'Beispielrechnung auf Basis Ihrer Annahmen. Die tatsächlichen Werte ermittelt die Analyse.',
}
