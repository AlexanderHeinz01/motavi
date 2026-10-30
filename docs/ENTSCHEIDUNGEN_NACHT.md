# Entscheidungen und offene Punkte, Phasen 4 bis 7

Stand: 31.10.2026, eigenständig umgesetzt in der Nacht. Teil A: Entscheidungen, die ich getroffen und umgesetzt habe (bitte prüfen, alles lässt sich ändern). Teil B: Punkte, die Sie klären müssen.

## A. Getroffene Entscheidungen

### Phase 4: Perspektivseiten

1. **Rechner:** Schieberegler für Arbeitsplätze 1 bis 100, nicht wertschöpfende Bewegung 0 bis 240 min, vermeidbarer Anteil 0 bis 100 %, Schichten 1 bis 3, Arbeitstage 100 bis 365, Vollkosten 20 bis 150 €. Standardwerte aus §4.1. Die Mini-Version auf der Startseite hat drei Regler (Arbeitsplätze, Minuten, vermeidbarer Anteil), der Rest ist fest und genannt. Die Formel steht unter dem Rechner.
2. **Abschluss der Perspektivseiten:** Der kompakte Entscheidungsweg zeigt alle drei Wege gleich, ohne einen als zutreffend zu markieren (Leitplanke 4). Dazu Links auf Steckbrief, die anderen beiden Perspektiven und `/betriebsrat` (auch auf `/gesundheit`).
3. **Leitmerkmalmethode:** Das Modul rechnet sie nicht. Die Seite sagt, welche Merkmale Motavi misst (Häufigkeit, Dauer, Haltung), dass das Gewicht vom Kunden kommt, und ausdrücklich: „Eine automatische Bewertung nach Leitmerkmalmethode bietet Motavi derzeit nicht.“
4. **CSRD:** nur allgemein (ESRS S1 verlangt Angaben zu Gesundheit und Sicherheit), Motavi „kann die Berichterstattung stützen“, erhebt aber keine Pflichtangaben. Hinweis „keine Rechtsberatung“. Keine Aussage, wer ab wann berichtspflichtig ist, weil sich das gerade ändert.
5. **Fehlzeiten:** ohne Zahlen („gehören zu den häufigsten Gründen für Arbeitsunfähigkeit“), weil keine Quelle vorliegt (Leitplanke 5).
6. **Automatisierungstypen und Kriterien:** Namen, Gewichte und Schwelle kommen aus der gemeinsamen Konfiguration, die Beschreibungen je Typ aus dem Inhalt (ein Test prüft, dass jeder Typ eine hat).
7. **Leitplanken-Test für alle Inhaltsdateien:** Gedankenstriche, verbotene Formulierungen und eine Liste bekannter Robotik-Hersteller (`src/content/leitplanken.test.ts`).

## B. Von Ihnen zu klären

1. **REBA ohne „Pilotphase“?** Steckbrief- und Gesundheitsseite kennzeichnen REBA nicht als Pilotphase, weil es aus der bestehenden Ergonomie-Analyse stammt. Gegen eine manuelle REBA-Bewertung geprüft ist die Berechnung aus dem 2D-Video aber ebenfalls nicht. Soll REBA auch das Label tragen, bis das geprüft ist?
2. **Quelle für Fehlzeiten:** Wenn Sie eine belastbare Zahl mit Quelle haben (z. B. Anteil der Muskel-Skelett-Erkrankungen an den Arbeitsunfähigkeitstagen), kann `/gesundheit` sie zeigen.
