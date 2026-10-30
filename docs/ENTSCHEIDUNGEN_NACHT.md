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

### Phase 5: Restliche Seiten

8. **Pakete als eine Quelle:** `src/content/pakete.ts` liefert die Karten für `/pakete` und die Startseite. Preise netto mit dem Hinweis „netto, zuzüglich Umsatzsteuer“ und dem Satz, dass der genaue Umfang im Angebot abgestimmt wird. Reihenfolge nach Preis aufsteigend wie auf der Startseite; „Empfohlen“ bleibt beim Paket Analyse und Validierung.
9. **Leistungen je Paket (Annahmen):** Video-Check: Video selbst aufgenommen, Messwerte je Arbeitsplatz, Ergonomie-Report, Arbeitsplatz-Check. Analyse und Validierung: Video ebenfalls selbst aufgenommen, Expertenbewertung, Steckbrief mit Empfehlung und Report, Besprechung. Komplettbegleitung: Aufnahme vor Ort, Steckbrief für alle Arbeitsplätze, Begleitung der Umsetzung. Der Ergonomie-Report ist in allen Paketen enthalten.
10. **Partnerseite:** zusätzlich `noindex`, nicht verlinkt, nicht in der Sitemap, bis §7.1 erfüllt ist. Zur Rolle gegenüber Anbietern (§7.2) sagt die Seite nichts. Zugesagt wird, dass Anbieter Steckbriefe eines Kunden nur mit dessen Freigabe erhalten. Der CTA führt zu `/pilot?ich=anbieter`.
11. **Betriebsrat-Seite:** Zusage, Videos und Gelenkpunkte nicht zum Training von Robotern oder KI-Modellen zu nutzen (passt zu §7.7). Mitbestimmung mit Verweis auf § 87 Absatz 1 Nummer 6 BetrVG („berühren in der Regel“), Empfehlung einer gemeinsamen Festlegung vor der ersten Aufnahme, Angebot einer Vorstellung beim Betriebsrat. Hinweis „keine Rechtsberatung“.
12. **So funktioniert es:** Aufnahmehinweise aus dem Analysemodul (mindestens fünf, besser zehn Durchgänge, ganze Person im Bild, möglichst eine Person, MP4 oder WebM). Keine Zusage zur Bearbeitungsdauer.
13. **Löschfristen:** `/betriebsrat` und `/so-funktionierts` nennen sie; beide stehen jetzt unter der harten Bedingung in `docs/GO_LIVE_CHECKLISTE.md`.

## B. Von Ihnen zu klären

1. **REBA ohne „Pilotphase“?** Steckbrief- und Gesundheitsseite kennzeichnen REBA nicht als Pilotphase, weil es aus der bestehenden Ergonomie-Analyse stammt. Gegen eine manuelle REBA-Bewertung geprüft ist die Berechnung aus dem 2D-Video aber ebenfalls nicht. Soll REBA auch das Label tragen, bis das geprüft ist?
2. **Quelle für Fehlzeiten:** Wenn Sie eine belastbare Zahl mit Quelle haben (z. B. Anteil der Muskel-Skelett-Erkrankungen an den Arbeitsunfähigkeitstagen), kann `/gesundheit` sie zeigen.
3. **Umfang der Pakete:** Gilt der Preis je Arbeitsplatz, je Projekt oder für eine bestimmte Zahl von Arbeitsplätzen? Wie lange dauert die Bearbeitung? Die Seite sagt bisher nur, dass der Umfang im Angebot abgestimmt wird.
4. **Paket Analyse und Validierung:** Nimmt der Kunde das Video selbst auf (so steht es jetzt) oder Motavi?
5. **Rolle gegenüber Robotik-Anbietern (§7.2):** Provision, Auftragsanalyse oder rein neutral. Muss vor dem Verlinken der Partnerseite entschieden und gegenüber Endkunden offengelegt werden.
6. **Zusagen auf `/betriebsrat` bestätigen:** kein Training von Robotern oder KI-Modellen mit den Daten, keine Weitergabe ohne Freigabe, Vorstellung beim Betriebsrat auf Wunsch.

## C. TODO-Stellen im Code

| Stelle | Inhalt |
|---|---|
| `src/content/site.ts` (siteUrl) | Domain bestätigen (§7.5) |
| `src/content/site.ts` (Fußzeile) | Hinweis zur Server-Region erst, wenn das Hosting der Website feststeht |
| `src/content/pakete.ts` | Umfang je Paket (Arbeitsplätze, Dauer) |
