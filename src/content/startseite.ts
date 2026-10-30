import type { Path } from './empfehlungen'
import type { Accent, PageMeta } from './types'

/** Startseite (WEBSITE_PLAN §1 and §3). Headline and subline are fixed copy from §1. */
export const startseite = {
  meta: {
    title: 'Verbessern, automatisieren oder beibehalten?',
    description:
      'Motavi macht jede Bewegung im Arbeitsablauf messbar: als Zeit, als Kosten und als Belastung. Für jeden Arbeitsplatz eine klare Empfehlung.',
  } satisfies PageMeta,
  headline: 'Verbessern, automatisieren oder beibehalten? Motavi misst, was sich an jedem Arbeitsplatz lohnt.',
  subline:
    'Motavi macht jede Bewegung im Arbeitsablauf messbar: als Zeit, als Kosten und als Belastung. Für jeden Arbeitsplatz erhalten Sie eine klare Empfehlung, ob Sie ihn gestalten, automatisieren oder beibehalten sollten. Herstellerneutral, ohne Sensoren, Server in Deutschland.',
  primaryCta: { label: 'Pilot anfragen', to: '/pilot' },
  secondaryCta: { label: 'Beispiel-Steckbrief ansehen', to: '/arbeitsplatz-steckbrief' },

  /** Hero drawing and data sheet (decision D0: variant A). */
  hero: {
    zeichnungLabel:
      'Technische Zeichnung: anonymisiertes Bewegungsskelett an einer Werkbank, mit Bahnkurve der Hand, Greifraum und Zykluszeit.',
    zykluszeit: '38,4 s je Zyklus',
    /**
     * Invented example values (DESIGN_BRIEF §2), marked as such (guideline 5).
     * Same example as the Steckbrief below (STECKBRIEF_MODUL §7, demo_steckbrief.json):
     * 15.000 € per year = 41 avoidable min per shift x 2 shifts x 220 days at 50 € per hour (rounded).
     */
    werte: [
      { label: 'Zeit', accent: 'data-ink', value: '38,4 s', detail: 'je Zyklus, 690 Zyklen pro Schicht' },
      { label: 'Kosten', accent: 'gain-ink', value: '15.000 €', detail: 'pro Jahr, 41 Minuten je Schicht durch Gestaltung vermeidbar' },
      { label: 'Belastung', accent: 'risk-ink', value: 'REBA 5,8', detail: 'Mittelwert, Rumpfwinkel bis 45 Grad' },
    ] satisfies { label: string; accent: Accent; value: string; detail: string }[],
    beispielHinweis: 'Beispielwerte',
    bruecke: {
      lead: 'Daraus folgt eine Empfehlung:',
      paths: ['improve', 'automate', 'keep'] satisfies Path[],
      target: 'eine-messung',
    },
  },

  /** Section "Eine Messung, drei Empfehlungen" (WEBSITE_PLAN §3, DESIGN_BRIEF §5). */
  entscheidung: {
    id: 'eine-messung',
    label: 'Entscheidung',
    title: 'Eine Messung, drei Empfehlungen',
    intro: 'Jeder Arbeitsplatz wird gleich gemessen. Daraus folgt eine von drei gleichwertigen Empfehlungen.',
    messung: 'Eine Messung',
    messungText: 'Zeit, Kosten und Belastung je Arbeitsplatz',
    groessen: [
      { label: 'Zeit', accent: 'data-ink' },
      { label: 'Kosten', accent: 'gain-ink' },
      { label: 'Belastung', accent: 'risk-ink' },
    ] satisfies { label: string; accent: Accent }[],
    /** "Wann" column of the table in WEBSITE_PLAN §1: one sentence per path, same kind for all three (guideline 4). */
    wege: [
      {
        path: 'improve',
        text: 'Verschwendung und Belastung lassen sich durch Gestaltung lösen: Greifwege, Höhen, Layout, Materialbereitstellung.',
      },
      { path: 'automate', text: 'Hohe Wiederholung, gleichförmige Zyklen, hohe Belastung, wenige Varianten.' },
      { path: 'keep', text: 'Hohe Variantenvielfalt, kurze Zyklen ohne Muster, geringe Belastung.' },
    ] satisfies { path: Path; text: string }[],
  },

  /** Section 2 "Problem" (WEBSITE_PLAN §3). */
  problem: {
    label: 'Ausgangslage',
    title: 'Jeder Arbeitsplatz verliert Zeit. Niemand weiß genau, wo und warum.',
    karten: [
      {
        icon: 'hourglass',
        title: 'Fachkräftemangel',
        text: 'Stellen bleiben unbesetzt, Arbeit bleibt liegen. Jede Minute, die der Ablauf für Suchen, Gehen und Umgreifen verlangt, fehlt in der Wertschöpfung.',
      },
      {
        icon: 'cog',
        title: 'Automatisierungsdruck',
        text: 'Investitionen in Automatisierung werden oft ohne Datengrundlage entschieden. Wer einen unklaren Ablauf automatisiert, bezahlt für unnötige Bewegungen.',
      },
      {
        icon: 'calendar',
        title: 'Fehlzeiten',
        text: 'Belastende Haltungen und Hebevorgänge kosten Gesundheit und Kapazität. Oft ist nicht bekannt, an welchem Arbeitsplatz die Belastung entsteht.',
      },
    ] satisfies { icon: 'hourglass' | 'cog' | 'calendar'; title: string; text: string }[],
  },

  /** Section 4 "Beispiel-Steckbrief", dark (DESIGN_BRIEF §5). */
  beispiel: {
    id: 'beispiel-steckbrief',
    label: 'Beispiel-Steckbrief',
    title: 'Ein Datenblatt je Arbeitsplatz',
    intro:
      'So sieht das Ergebnis aus: Empfehlung mit Begründung, beide Scores, Kennzahlen, Ablauf, Greifraum und was die Empfehlung bringt. Wählen Sie eines der vier Beispiele.',
    link: { label: 'Jede Kennzahl erklärt', to: '/arbeitsplatz-steckbrief' },
  },

  /** Section 5 "Beweis" (WEBSITE_PLAN §3 and guideline 5). */
  beweis: {
    label: 'Fallbeispiel',
    title: 'Abfülllinie, produzierende Industrie',
    intro:
      'Die Analyse fand die Ursache in einem einzelnen Prozessschritt. Gelöst wurde sie durch Gestaltung, ohne Investition in Automatisierung.',
    empfehlung: 'Empfehlung:',
    path: 'improve' as Path,
    zahlen: [
      { wert: 4800, einheit: 'Drehbewegungen', text: 'pro Schicht, verursacht durch einen ungünstig angeordneten Prozessschritt', accent: 'risk-ink' },
      { wert: 57, einheit: 'Minuten', text: 'Potenzial pro Schicht, bei 265 Minuten Bezugszeit', accent: 'gain-ink' },
    ] satisfies { wert: number; einheit: string; text: string; accent: Accent }[],
    methodeTitel: 'Zur Methode',
    methode: 'Ergebnis einer Analyse mit bewährter Methodik, 2020.',
    botschaft: 'Hier lautete die Antwort nicht Automatisieren, sondern Verbessern.',
  },

  /** Section 6 "Drei Perspektiven" (WEBSITE_PLAN §1). */
  perspektiven: {
    label: 'Drei Perspektiven',
    title: 'Drei Einstiege in dieselbe Analyse',
    karten: [
      { icon: 'timer', title: 'Kapazität', text: 'Wie viele Stunden stecken in nicht wertschöpfender Bewegung?', link: { label: 'Zur Kapazität', to: '/kapazitaet' } },
      {
        icon: 'cog',
        title: 'Automatisierung',
        text: 'Welcher Arbeitsplatz lohnt sich für einen Roboter, welcher nicht?',
        link: { label: 'Zur Automatisierung', to: '/automatisierung' },
      },
      {
        icon: 'gauge',
        title: 'Gesundheit und Compliance',
        text: 'Wo ist die Belastung am höchsten, und was hilft am schnellsten?',
        link: { label: 'Zur Gesundheit', to: '/gesundheit' },
      },
    ] satisfies { icon: 'timer' | 'cog' | 'gauge'; title: string; text: string; link: { label: string; to: string } }[],
  },

  /** Section 7 "Kapazität berechnen": mini version of the calculator on /kapazitaet (src/ui/KapazitaetsRechner.tsx). */
  rechner: {
    label: 'Kapazität berechnen',
    title: 'Was steckt in Ihren Arbeitsplätzen?',
    intro: 'Stellen Sie drei Werte ein, der Rest ist typisch angenommen. Mit allen Werten rechnen Sie auf der Seite Kapazität.',
  },

  /** Section 8 "So funktioniert es" (WEBSITE_PLAN §3). Step 03 is emphasised. */
  ablauf: {
    label: 'So funktioniert es',
    title: 'Vom Video zur Empfehlung in vier Schritten',
    schritte: [
      { nr: '01', title: 'Video aufnehmen', text: 'Ein Smartphone-Video des Arbeitsplatzes über einige Zyklen. Keine Sensoren, keine Umbauten.' },
      { nr: '02', title: 'KI misst', text: 'Zyklen, Zeiten, Greifraum und Belastung werden automatisch aus den Gelenkpunkten berechnet.', pilot: true },
      {
        nr: '03',
        title: 'Experte bewertet',
        text: 'Ein Experte prüft Ablaufschritte, Einstufung und Empfehlung und bestätigt oder korrigiert sie.',
        betont: true,
      },
      { nr: '04', title: 'Steckbrief und Empfehlung', text: 'Sie erhalten den Steckbrief mit Empfehlung, Kennzahlen und einer groben Wirtschaftlichkeit.' },
    ],
    betontHinweis: 'Das Tool misst, der Experte bewertet.',
    /** Guideline 7: cycles, process steps and reach are not validated yet (STECKBRIEF_MODUL §8). */
    pilotLabel: 'Pilotphase',
    pilotHinweis: 'Die automatische Messung von Zyklen, Ablaufschritten und Greifraum wird noch mit manuellen Messungen abgeglichen.',
    link: { label: 'Ablauf im Detail', to: '/so-funktionierts' },
  },

  /** Section 9 "Herstellerneutral" (WEBSITE_PLAN §3). */
  neutral: {
    satz: 'Wir verkaufen keine Roboter. Wir sagen Ihnen, wo sich einer lohnt, und wo nicht.',
  },

  /** Section 10 "Betriebsrat als Partner": promise left, proof right. */
  betriebsrat: {
    label: 'Betriebsrat',
    title: 'Mit dem Betriebsrat, nicht an ihm vorbei',
    versprechenTitel: 'Unser Versprechen',
    versprechen: [
      'Motavi bewertet Tätigkeiten und Arbeitsplätze, nie Personen.',
      'Keine Leistungskontrolle und keine Vergleiche zwischen Mitarbeitenden.',
      'Ziel ist, Abläufe besser zu gestalten und Belastungen zu verringern.',
    ],
    nachweisTitel: 'So setzen wir es um',
    nachweis: [
      // Deletion concept of the backend (motavi-backend: docs/LOESCHKONZEPT.md).
      // Hard condition before going live: lifecycle rule applied and checked (docs/GO_LIVE_CHECKLISTE.md).
      {
        title: 'Anonymisierung',
        text: 'Das Originalvideo wird unmittelbar nach der Auswertung automatisch gelöscht. Aufbewahrt werden nur ein Video mit unkenntlich gemachtem Kopfbereich und die Gelenkpunkte, beides 30 Tage, sowie die Kennzahlen.',
      },
      { title: 'Mitbestimmung', text: 'Einsatz nur mit Beteiligung des Betriebsrats nach § 87 BetrVG.' },
      { title: 'Zweckbindung', text: 'Die Daten dienen nur der Gestaltung der Arbeitsplätze.' },
    ],
    link: { label: 'Alles zu Datenschutz und Betriebsrat', to: '/betriebsrat' },
  },

  /**
   * Section 11 "Pakete": placeholders until prices are set (WEBSITE_PLAN Phase 5).
   * WEBSITE_PLAN §7.3 (decided 30.10.2026): package 3 gives measured values and the
   * Arbeitsplatz-Check; the recommendation with expert assessment comes with package 2.
   */
  pakete: {
    label: 'Pakete',
    title: 'Drei Pakete, von den Messwerten bis zur Begleitung',
    karten: [
      {
        name: 'Video-Check',
        preis: 'Preis folgt',
        leistungen: ['Sie nehmen das Video selbst auf', 'Messwerte je Arbeitsplatz', 'Arbeitsplatz-Check'],
        cta: { label: 'Mehr erfahren', to: '/pakete' },
      },
      {
        name: 'Analyse und Validierung',
        preis: 'Preis folgt',
        leistungen: ['Messung und Expertenbewertung', 'Steckbrief mit Empfehlung und Report', 'Besprechung der Empfehlungen'],
        cta: { label: 'Pilot anfragen', to: '/pilot' },
        empfohlen: true,
      },
      {
        name: 'Komplettbegleitung',
        preis: 'Preis folgt',
        leistungen: ['Aufnahme vor Ort', 'Steckbrief mit Empfehlung für alle Arbeitsplätze', 'Begleitung der Umsetzung'],
        cta: { label: 'Mehr erfahren', to: '/pakete' },
      },
    ],
    link: { label: 'Pakete vergleichen', to: '/pakete' },
  },

  /** Section 12 "Abschluss-CTA". */
  abschluss: {
    satz: 'Finden Sie heraus, was sich an Ihren Arbeitsplätzen lohnt.',
    cta: { label: 'Pilot anfragen', to: '/pilot' },
  },
}
