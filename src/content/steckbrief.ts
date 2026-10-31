import type { Path } from './empfehlungen'
import type { Accent, PageMeta } from './types'

/**
 * /arbeitsplatz-steckbrief (WEBSITE_PLAN §3 and §4.2, DESIGN_BRIEF §5).
 * Numbers that come from config/workplace_scoring.json (weights, thresholds,
 * step types, avoidable shares, automation types) are inserted by the page,
 * not written here, so the text cannot drift from the scoring.
 */

/** Where a value comes from, shown next to each metric. */
export type Quelle = 'gemessen' | 'experte' | 'berechnet' | 'kunde'

export interface Kennzahl {
  name: string
  text: string
  quelle: Quelle
  /** Guideline 7: not validated against manual measurement yet (motavi-backend docs/validierung_steckbrief.md) */
  pilot: boolean
}

export const steckbrief = {
  meta: {
    title: 'Der Arbeitsplatz-Steckbrief',
    description:
      'Was der Arbeitsplatz-Steckbrief misst, wie die Empfehlung entsteht und ein Selbsttest mit acht Fragen: verbessern, automatisieren oder beibehalten.',
  } satisfies PageMeta,
  label: 'Arbeitsplatz-Steckbrief',
  accent: 'data-ink' as Accent,
  title: 'Der Arbeitsplatz-Steckbrief',
  intro:
    'Ein Datenblatt je Arbeitsplatz: was gemessen wird, wie daraus einer von drei gleichwertigen Wegen folgt und was er bringt. Mit dem Arbeitsplatz-Check am Ende der Seite machen Sie eine erste Einschätzung selbst.',
  sprungmarkenLabel: 'Auf dieser Seite',
  sprungmarken: [
    { id: 'aufbau', label: 'Aufbau' },
    { id: 'entscheidung', label: 'Entscheidungslogik' },
    { id: 'check', label: 'Arbeitsplatz-Check' },
  ],

  quelle: {
    gemessen: 'gemessen',
    experte: 'von Experten bewertet',
    berechnet: 'berechnet',
    kunde: 'Ihre Angaben',
  } satisfies Record<Quelle, string>,
  pilotLabel: 'Pilotphase',
  pilotErklaerung:
    'Pilotphase: Diese Kennzahlen werden noch mit manuellen Messungen abgeglichen. Erst danach entfällt die Kennzeichnung.',

  aufbau: {
    id: 'aufbau',
    label: 'Aufbau',
    title: 'Jede Kennzahl erklärt',
    intro:
      'Links das Beispiel eines Montagearbeitsplatzes, rechts die Erklärung. Die Nummern entsprechen den Abschnitten im Steckbrief.',
    kopf: {
      nr: 'Kopf',
      titel: 'Empfehlung und Begründung',
      eintraege: [
        {
          name: 'Empfehlung',
          text: 'Einer von drei gleichwertigen Wegen: Verbessern, Automatisieren oder Beibehalten. Oft lautet die Antwort: erst verbessern, dann automatisieren. Das Tool schlägt die Empfehlung aus den beiden Scores vor, erfahrene Experten für Arbeitsgestaltung und Zeitwirtschaft (REFA) bestätigen oder ändern sie.',
          quelle: 'experte',
          pilot: false,
        },
        {
          name: 'Begründung',
          text: 'Bis zu drei Messwerte, die für die Empfehlung ausschlaggebend sind, jeweils mit dem Wert, auf dem sie beruhen.',
          quelle: 'berechnet',
          pilot: false,
        },
      ] satisfies Kennzahl[],
    },
    bewertung: {
      nr: '01',
      titel: 'Bewertung',
      verbesserung: {
        name: 'Verbesserungs-Score',
        text: (schwelle: number) =>
          `Wie viel sich durch Gestaltung des Arbeitsplatzes gewinnen lässt, von 0 bis 100. Ab ${schwelle} gilt er als hoch. Gewichtet aus:`,
        quelle: 'berechnet' as Quelle,
        pilot: true,
      },
      automatisierung: {
        name: 'Automatisierungs-Score',
        text: (schwelle: number) =>
          `Wie gut sich der Arbeitsplatz für eine Automatisierung eignet, von 0 bis 100. Ab ${schwelle} gilt er als hoch. Gewichtet aus:`,
        quelle: 'berechnet' as Quelle,
        pilot: true,
      },
      fehlend:
        'Fehlt ein Wert, verteilt sich sein Gewicht auf die übrigen Kriterien. Die Empfehlung gilt dann als vorläufig.',
    },
    kennzahlen: {
      nr: '02',
      titel: 'Kennzahlen',
      eintraege: [
        {
          name: 'Zykluszeit (Median)',
          text: 'Dauer eines Arbeitsdurchgangs. Das Tool erkennt wiederkehrende Bewegungsmuster in den Gelenkpunkten und misst jeden Durchgang. Angegeben ist der Median, damit einzelne Ausreißer nicht verzerren.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Schwankung (VK)',
          text: 'Wie stark die Dauer der Durchgänge schwankt: Standardabweichung geteilt durch Mittelwert. Kleine Werte stehen für einen gleichförmigen Ablauf.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Zyklen pro Schicht',
          text: 'Erkannte Durchgänge, hochgerechnet auf die Schichtdauer. Unterbrechungen und Nebentätigkeiten zählen nicht mit.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Zeitanteil in Zyklen',
          text: 'Anteil der aufgenommenen Zeit, der in wiederkehrenden Durchgängen liegt. Der Rest sind Unterbrechungen, Nebentätigkeiten oder wechselnde Aufgaben.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Drehungen pro Zyklus',
          text: 'Wie oft der Oberkörper je Durchgang um mindestens 30 Grad gegen die Hüfte verdreht wird. Ein grober Wert, weil die Tiefe aus einem 2D-Video geschätzt wird.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Griffe außerhalb des Greifraums',
          text: 'Anteil der Griffe, bei denen die Hand außerhalb des günstigen Bereichs zur Ruhe kommt: unter Hüfthöhe, über Schulterhöhe oder weit vom Körper entfernt.',
          quelle: 'gemessen',
          pilot: true,
        },
        {
          name: 'Haltungsindex (Mittel)',
          text: 'Belastung durch die Körperhaltung als Haltungsindex auf REBA-Basis, Skala 1 bis 10, gemittelt über die Aufnahme. Er fasst die Winkelbereiche von REBA für Rumpf, Nacken, Arme und Knie zusammen, ist aber kein REBA-Wert: Last, Griffart und Handgelenke fließen nicht ein. Stufen: unter 4 niedrig, 4 bis unter 6 mittel, 6 bis unter 8 hoch, ab 8 sehr hoch.',
          quelle: 'gemessen',
          pilot: true,
        },
      ] satisfies Kennzahl[],
      nichtMessbar:
        'Liegt die Messqualität einer Kennzahl unter der Schwelle, steht dort „nicht belastbar messbar“ statt eines Werts.',
    },
    ablauf: {
      nr: '03',
      titel: 'Ablauf je Zyklus',
      eintraege: [
        {
          name: 'Ablaufschritte',
          text: 'Das Tool teilt einen typischen Durchgang in Phasen: Bewegung, Ruhe und Gehen. Experten ordnen jedem Abschnitt einen Schritt zu, etwa Greifen, Fügen oder Suchen. Die Zuordnung gilt dann für alle erkannten Durchgänge.',
          quelle: 'experte',
          pilot: true,
        },
      ] satisfies Kennzahl[],
      einstufung: 'Jeder Schritt ist wertschöpfend, notwendig oder Verschwendung. Die Experten können die Einstufung im Einzelfall ändern. Standard:',
      ohneZyklus: 'Ohne wiederkehrenden Zyklus gibt es keine Ablaufschritte. Der Steckbrief zeigt dann „Kein wiederkehrender Zyklus erkannt“.',
    },
    greifraum: {
      nr: '04',
      titel: 'Greifraum und Arbeitshöhen',
      eintraege: [
        {
          name: 'Arbeitshöhen der Hände',
          text: 'Zeitanteil, in dem die Hände unter dem Knie, zwischen Knie und Hüfte, zwischen Hüfte und Schulter oder über der Schulter arbeiten. Günstig ist der Bereich zwischen Hüfte und Schulter, nah am Körper.',
          quelle: 'gemessen',
          pilot: true,
        },
      ] satisfies Kennzahl[],
      hinweis: 'Relative Werte aus 2D-Video, bezogen auf die Körpermaße. Für Zentimeterangaben ist eine Referenzmessung vor Ort nötig.',
    },
    wirtschaft: {
      nr: '05',
      titel: 'Was die Empfehlung bringt',
      gestaltung: {
        name: 'Durch Gestaltung',
        text: 'Minuten pro Schicht, die sich durch Gestaltung vermeiden lassen: Verschwendung je Schritt mal vermeidbarer Anteil, in Euro mit Ihren Kosten. Vermeidbare Anteile:',
        quelle: 'berechnet',
        pilot: false,
      } satisfies Kennzahl,
      potenzial: {
        name: 'Automatisierungspotenzial',
        text: 'Stunden pro Jahr, die ein Automatisierungstyp übernehmen könnte, als Bandbreite. Bei „Erst verbessern, dann automatisieren“ gerechnet auf den verbesserten Ablauf, damit keine Verschwendung automatisiert wird.',
        quelle: 'berechnet',
        pilot: false,
      } satisfies Kennzahl,
      euro: {
        name: 'Potenzial in Euro pro Jahr',
        text: 'Stunden mal Vollkosten, abzüglich der Betriebskosten der Anlage für Wartung, Energie und Programmierung.',
        quelle: 'berechnet',
        pilot: false,
      } satisfies Kennzahl,
      typ: {
        name: 'Automatisierungstyp',
        text: 'Nur bei einer Empfehlung mit Automatisierung: der Typ, der zum Ablauf passt. Nie ein Hersteller oder Produkt. Typen:',
        quelle: 'experte',
        pilot: false,
      } satisfies Kennzahl,
      kunde: {
        name: 'Ihre Angaben',
        text: 'Teilegewicht, Varianten, Schichtmodell, Kosten und Stellenbesetzung geben Sie an. Ohne sie fehlen Euro-Werte, und die Bewertung nennt die fehlenden Kriterien.',
        quelle: 'kunde',
        pilot: false,
      } satisfies Kennzahl,
      pflicht: 'Alle Euro-Werte sind grobe Abschätzungen und ersetzen kein Angebot.',
    },
    person: 'Bewertet wird die Tätigkeit am Arbeitsplatz, nie die Person.',
  },

  entscheidung: {
    id: 'entscheidung',
    label: 'Entscheidungslogik',
    title: 'Wie die Empfehlung entsteht',
    intro:
      'Zwei Scores, eine Regel, drei gleichwertige Wege. Oft lautet die Antwort: erst verbessern, dann automatisieren. Auch Beibehalten ist eine gute Antwort, wenn es eine Fehlinvestition vermeidet.',
    achseVerbesserung: 'Verbesserungs-Score',
    achseAutomatisierung: 'Automatisierungs-Score',
    unter: (s: number) => `unter ${s}`,
    ab: (s: number) => `ab ${s}`,
    matrixLabel: 'Entscheidungsregel als Matrix aus Verbesserungs-Score und Automatisierungs-Score',
    /** "Typisch" (WEBSITE_PLAN §1, column "Wann"); the sentence before comes from the configuration */
    typisch: {
      improve: 'Typisch: lange Greifwege, ungünstige Höhen, Suchen und Gehen, belastende Haltungen.',
      'improve-then-automate': 'Typisch: viele gleichförmige Durchgänge, aber Suchen, Gehen oder Warten im Ablauf.',
      automate: 'Typisch: hohe Wiederholung, gleichförmige Zyklen, wenige Varianten, schlanker Ablauf.',
      keep: 'Typisch: hohe Variantenvielfalt, kurze Zyklen ohne Muster, geringe Belastung.',
    } satisfies Record<Path, string>,
    regeln: {
      titel: 'Weitere Regeln',
      vorrang: (reba: string) =>
        `Vorrang: Ab einem Haltungsindex von ${reba} wird der Arbeitsplatz unabhängig von der Empfehlung als vorrangig markiert.`,
      keinZyklus:
        'Kein wiederkehrender Zyklus ist ein Ergebnis: Wiederholung, Gleichförmigkeit und Zeitanteil in Zyklen zählen dann als 0. Eine Empfehlung mit Automatisierung ist damit ausgeschlossen.',
      reihenfolge:
        'Erst verbessern, dann automatisieren: Wer Verschwendung automatisiert, bezahlt eine Anlage für unnötige Bewegungen. Deshalb wird die Automatisierung hier auf den verbesserten Ablauf gerechnet.',
      experte: 'Das Tool schlägt vor, erfahrene Experten für Arbeitsgestaltung und Zeitwirtschaft (REFA) entscheiden. Sie bestätigen oder ändern Empfehlung und Automatisierungstyp.',
      schwellen: 'Gewichte und Schwellen sind Startwerte der Pilotphase und werden an realen Arbeitsplätzen geprüft.',
    },
  },

  check: {
    id: 'check',
    label: 'Arbeitsplatz-Check',
    title: 'Wo steht Ihr Arbeitsplatz?',
    intro:
      'Acht Fragen zu einem Arbeitsplatz, eine erste Einschätzung in zwei Minuten. Gerechnet wird mit denselben Gewichten und Regeln wie im Steckbrief.',
    datenschutz: 'Ihre Antworten bleiben in Ihrem Browser. Nichts wird gespeichert oder übertragen.',
    neu: 'Neu starten',
    selbsteinschaetzung: 'Selbsteinschätzung, keine Messung.',
    vorrangig:
      'Ihre Angaben deuten auf eine hohe körperliche Belastung hin. Ein solcher Arbeitsplatz wird unabhängig von der Empfehlung vorrangig betrachtet.',
    fehler: 'Bitte wählen Sie eine Antwort.',
    cta: { label: 'Pilot anfragen', to: '/pilot' },
    /** Texts for the questions and answers of config/workplace_scoring.json (arbeitsplatz_check), by id */
    fragen: {
      wiederholung: {
        frage: 'Wie oft wiederholt sich die Tätigkeit pro Schicht?',
        antworten: { unter_50: 'Seltener als 50 Mal', '50_bis_200': '50 bis 200 Mal', '200_bis_600': '200 bis 600 Mal', ueber_600: 'Öfter als 600 Mal' },
      },
      gleichfoermigkeit: {
        frage: 'Wie gleichförmig läuft jeder Durchgang ab?',
        antworten: {
          jeder_anders: 'Jeder Durchgang ist anders',
          mit_abweichungen: 'Ähnlich, mit deutlichen Abweichungen',
          weitgehend_gleich: 'Weitgehend gleich',
          praktisch_identisch: 'Praktisch identisch',
        },
      },
      varianten: {
        frage: 'Wie viele Teile- oder Produktvarianten gibt es?',
        antworten: { eine: 'Eine', '2_bis_5': '2 bis 5', '6_bis_20': '6 bis 20', ueber_20: 'Mehr als 20' },
      },
      teile: {
        frage: 'Wie schwer und handlich sind die Teile?',
        antworten: {
          klein_leicht: 'Klein und leicht, unter 2 kg',
          handlich: 'Handlich, 2 bis 10 kg',
          schwer_sperrig: 'Schwer oder sperrig, 10 bis 25 kg',
          sehr_schwer_gross: 'Sehr schwer oder groß, über 25 kg',
        },
      },
      verschwendung: {
        frage: 'Wie viel Gehen, Suchen und Warten gehört zum Ablauf?',
        antworten: {
          kaum: 'Kaum',
          etwas: 'Etwas, bis etwa ein Zehntel der Zeit',
          deutlich: 'Deutlich, etwa ein Fünftel der Zeit',
          viel: 'Viel, ein Drittel der Zeit oder mehr',
        },
      },
      haltung: {
        frage: 'Wie oft wird gebückt, über Kopf oder mit Drehung gearbeitet?',
        antworten: { selten: 'Selten', gelegentlich: 'Gelegentlich', haeufig: 'Häufig', staendig: 'Fast ständig' },
      },
      zeitanteil: {
        frage: 'Wie hoch ist der Zeitanteil dieser Tätigkeit an der Schicht?',
        antworten: {
          unter_viertel: 'Unter einem Viertel',
          etwa_haelfte: 'Etwa die Hälfte',
          grossteil: 'Großteil der Schicht',
          ganze_schicht: 'Nahezu die ganze Schicht',
        },
      },
      besetzung: {
        frage: 'Wie schwer ist die Stelle zu besetzen?',
        antworten: { problemlos: 'Problemlos', mit_aufwand: 'Mit etwas Aufwand', schwierig: 'Schwierig', kaum_zu_besetzen: 'Kaum zu besetzen' },
      },
    } as Record<string, { frage: string; antworten: Record<string, string> }>,
  },
}
