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

### Phase 6: Formular und Pflichtseiten

14. **Endpunkt im vorhandenen Backend:** `POST /api/v1/contact` in `motavi-backend` (§5 hatte offen gelassen, welcher Server ihn bereitstellt). Speicherung in Firestore (`kontaktanfragen`) mit `loeschen_am` nach 365 Tagen, optional E-Mail per SMTP. Rate-Limit 5 Anfragen je IP in 10 Minuten im Arbeitsspeicher, Honeypot-Feld `website`. Beschreibung in `motavi-backend/docs/KONTAKT.md`.
15. **Formular:** Pflicht sind Zielgruppe, Name, Unternehmen und E-Mail; Funktion, Telefon, Anzahl Arbeitsplätze, Interesse und Nachricht sind optional. Zielgruppe per Link vorwählbar (`/pilot?ich=anbieter`). Kein Einwilligungshäkchen, sondern ein Hinweis mit Link zur Datenschutzerklärung. Erfolgsmeldung: „Wir melden uns in der Regel innerhalb von zwei Werktagen.“
16. **Pflichtseiten:** `/impressum` und `/datenschutz` zeigen die üblichen Abschnitte als markierte Platzhalter, ohne Rechtstext. Die technischen Fakten für den Verfasser stehen in `docs/RECHTSTEXTE_FAKTEN.md`.
17. **Aufgeräumt:** Die Platzhalter-Bausteine aus Phase 1 (`PlaceholderPage`, `PlaceholderBlock`, `PageContent`) werden nicht mehr gebraucht und sind entfernt.

## B. Von Ihnen zu klären

1. **REBA ohne „Pilotphase“?** Steckbrief- und Gesundheitsseite kennzeichnen REBA nicht als Pilotphase, weil es aus der bestehenden Ergonomie-Analyse stammt. Gegen eine manuelle REBA-Bewertung geprüft ist die Berechnung aus dem 2D-Video aber ebenfalls nicht. Soll REBA auch das Label tragen, bis das geprüft ist?
2. **Quelle für Fehlzeiten:** Wenn Sie eine belastbare Zahl mit Quelle haben (z. B. Anteil der Muskel-Skelett-Erkrankungen an den Arbeitsunfähigkeitstagen), kann `/gesundheit` sie zeigen.
3. **Umfang der Pakete:** Gilt der Preis je Arbeitsplatz, je Projekt oder für eine bestimmte Zahl von Arbeitsplätzen? Wie lange dauert die Bearbeitung? Die Seite sagt bisher nur, dass der Umfang im Angebot abgestimmt wird.
4. **Paket Analyse und Validierung:** Nimmt der Kunde das Video selbst auf (so steht es jetzt) oder Motavi?
5. **Rolle gegenüber Robotik-Anbietern (§7.2):** Provision, Auftragsanalyse oder rein neutral. Muss vor dem Verlinken der Partnerseite entschieden und gegenüber Endkunden offengelegt werden.
6. **Zusagen auf `/betriebsrat` bestätigen:** kein Training von Robotern oder KI-Modellen mit den Daten, keine Weitergabe ohne Freigabe, Vorstellung beim Betriebsrat auf Wunsch.

7. **Kontaktanfragen:** Aufbewahrung 365 Tage passend? Firestore-TTL-Regel anlegen (Befehl in `motavi-backend/docs/KONTAKT.md`). Region der Firestore-Datenbank prüfen. SMTP-Zugang und Empfängeradresse für die Benachrichtigung festlegen (`SMTP_HOST`, `SMTP_FROM`, `CONTACT_NOTIFY_TO`).
8. **Zusage „innerhalb von zwei Werktagen“** in der Erfolgsmeldung des Formulars bestätigen oder ändern.
9. **`VITE_API_BASE_URL`** beim Bauen der Website auf die Adresse des Backends setzen, sonst sendet das Formular an die eigene Domain. CORS erlaubt im Backend derzeit alle Ursprünge; vor dem Go-live auf die Website-Domain beschränken.
10. **Erkennungsmodell der Analyse-App:** Es wird von `storage.googleapis.com` geladen (Google sieht dabei die IP-Adresse, keine Videodaten). Selbst hosten oder in der Datenschutzerklärung nennen?
11. **Impressum und Datenschutzerklärung:** Texte durch Anwalt oder Generator, Fakten in `docs/RECHTSTEXTE_FAKTEN.md`; dort sind auch die offenen Angaben markiert (Hosting der Website, Analytics-Anbieter, SMTP-Anbieter).

## C. TODO-Stellen im Code

| Stelle | Inhalt |
|---|---|
| `src/content/site.ts` (siteUrl) | Domain bestätigen (§7.5) |
| `src/content/site.ts` (Fußzeile) | Hinweis zur Server-Region erst, wenn das Hosting der Website feststeht |
| `src/content/pakete.ts` | Umfang je Paket (Arbeitsplätze, Dauer) |
