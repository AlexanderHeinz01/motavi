# Entscheidungen und offene Punkte, Phasen 4 bis 7

Stand: 31.10.2026, eigenständig umgesetzt in der Nacht, Rückmeldung vom 31.10.2026 am Ende eingearbeitet. Teil A: Entscheidungen, die ich getroffen und umgesetzt habe (bitte prüfen, alles lässt sich ändern). Teil B: Punkte, die Sie klären müssen.

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

### Phase 7: Qualität und Go-live-Vorbereitung

18. **Reichweitenmessung:** standardmäßig aus. Eingeschaltet wird sie nur beim Build über `VITE_ANALYTICS_SRC` (https) und `VITE_ANALYTICS_DOMAIN`; eingebunden wird ein einzelnes Skript im Stil cookieloser Dienste (`data-domain`), ohne Cookie-Banner. Kein Anbieter festgelegt.
19. **Maschinelle Go-live-Prüfung:** `npm run golive:check` prüft am fertigen Build Rechtsseiten ohne Platzhalter, Indexierbarkeit, kein „DSGVO-konform“, Partnerseite nicht verlinkt und `noindex`, Sitemap mit Domain und die Backend-Adresse des Formulars. Die Freigabe der Partnerseite erfolgt bewusst über `PARTNERSEITE_FREIGEGEBEN=true`.
20. **Lighthouse:** Gemessen am indexierbaren Build, weil `noindex` die SEO-Kategorie sonst immer unter 90 drückt. SEO 66 auf Partnerseite und 404 bleibt, weil beide absichtlich `noindex` sind. Die Startseite mobil schwankt mit der Last (einmal 77, danach 91 bis 94); Code-Splitting der Seiten habe ich deshalb nicht eingebaut, der Weg steht in `docs/QUALITAET.md`.
21. **Überschrift über den Paketkarten:** nur für Screenreader („Die drei Pakete“), damit die Folge h1, h2, h3 stimmt, ohne das Layout zu ändern.

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
12. **Reichweitenmessung:** Ganz verzichten oder einen cookielosen, in der EU betriebenen Dienst wählen? Wenn ja: welchen, dann `VITE_ANALYTICS_SRC` und `VITE_ANALYTICS_DOMAIN` setzen und in der Datenschutzerklärung nennen.
13. **Hosting der Website:** Wo läuft sie (Server in Deutschland, passend zur Fußzeile)? Danach Lighthouse dort wiederholen.

## D. Rückmeldung 31.10.

Umgesetzt am 31.10.2026. Wo Teil A oder B etwas anderes sagt, gilt dieser Abschnitt.

### Korrekturen

1. **Paketinhalte nach Ihrem Konzept** (`src/content/pakete.ts`, ersetzt A9, erledigt B4):
   - Komplettbegleitung (3.350 €): Vorstellung des Vorgehens bei Betriebsrat, Management und Mitarbeitenden; Videoaufnahme durch uns vor Ort; Validierung und Ermittlung von Prozesspotenzialen vor Ort; Steckbrief mit Empfehlung; Vorstellung der Ergebnisse in einem Abschlusstermin. Keine „Begleitung der Umsetzung“ mehr.
   - Analyse und Validierung (2.150 €): Videoaufnahme durch uns vor Ort; Validierung und Ermittlung von Prozesspotenzialen vor Ort; Steckbrief mit Empfehlung als Bericht.
   - Video-Check (990 €): Aufnahme durch den Kunden nach Leitfaden; Messwerte je Arbeitsplatz, Ergonomie-Report, Arbeitsplatz-Check.
   - „Empfohlen“ steht jetzt bei der Komplettbegleitung; dort führt auf der Startseite der Button „Pilot anfragen“ direkt zum Formular.
   - Mitgeändert: Vergleichstabelle, Einleitung und Beschreibung von `/pakete`, Titel der Paket-Sektion auf der Startseite („Drei Pakete, vom Video-Check bis zur Komplettbegleitung“), Schritt 01 auf `/so-funktionierts` (Aufnahme beim Video-Check durch Sie, sonst durch uns vor Ort), `docs/WEBSITE_PLAN.md` §2, §3 und §7.3. Der zusätzliche Kurztext je Karte ist entfallen, die Karten zeigen nur noch die Leistungen aus Ihrem Konzept.
2. **Betriebsrat-Zusage** (`src/content/betriebsrat.ts`): „Wir nutzen Ihre Videos und Bewegungsdaten nicht zum Training von Robotern oder KI-Modellen, außer mit einer gesonderten schriftlichen Vereinbarung mit Ihnen und Zustimmung Ihres Betriebsrats.“
3. **„Server in Deutschland“**: Die Subline der Startseite endet jetzt mit „Herstellerneutral, ohne Sensoren, Analyse auf Servern in Deutschland.“ (auch in `docs/WEBSITE_PLAN.md`). Die Fußzeile nennt weiterhin keinen Standort. Die Go-live-Checkliste (harte Bedingung 4) verlangt, dass „Server in Deutschland“ ohne Zusatz erst erscheint, wenn das Hosting der Website feststeht. Unverändert bleiben die Angaben, die nur die Analyse betreffen: Datenweg der App, `/betriebsrat` („Die Daten liegen auf Servern in Deutschland“) und die Fußzeile des Ergonomie-Reports.

### Entscheidungen zu Teil B

| Punkt | Entscheidung | Umsetzung |
|---|---|---|
| B1 REBA | trägt „Pilotphase“, bis es gegen manuelle Bewertungen geprüft ist | Steckbrief-Seite (REBA jetzt mit Label, der Test verlangt das für alle gemessenen Kennzahlen), `/gesundheit` (Hinweis „noch nicht gegen manuelle REBA-Bewertungen geprüft“), Startseite (Pilothinweis nennt REBA). Im Repo `motavi-backend` zusätzlich: Hinweis im Steckbrief-PDF und im Ergonomie-Report. Im Dashboard steht REBA bereits in der Karte „Kennzahlen“ mit „Pilotphase“. |
| B2 Fehlzeiten | Platzhalter für die Quelle, Zahl erst nach Ihrer Bestätigung | `/gesundheit` zeigt einen markierten Platzhalter mit der Quelle „BKK Gesundheitsreport 2025, Berichtsjahr 2024“. Nach Ihrer Bestätigung die Zahl in `src/content/gesundheit.ts` (`fehltage.kennzahl.wert`) eintragen, dann erscheint sie als Kennzahl mit Quelle. `npm run golive:check` meldet den Platzhalter, bis er ersetzt oder entfernt ist. |
| B7 Kontaktanfragen | 365 Tage bestätigt | In `docs/RECHTSTEXTE_FAKTEN.md` und der Checkliste vermerkt. TTL-Regel, Firestore-Region und SMTP bleiben Aufgaben der harten Bedingung 3. |
| B8 Erfolgsmeldung | „Wir melden uns in der Regel innerhalb einer Woche.“ | `src/content/pilot.ts`, ebenso der Beispieltext im Styleguide. |
| B10 Erkennungsmodell | selbst hosten | Das Modell (`src/analysis/models/pose_landmarker_full.task`, 9,4 MB, unverändert, Prüfsumme in der README daneben) wird mitgebaut und von der eigenen Domain geladen. Im Browser geprüft: Das Modell lädt, die Erkennung läuft, es gibt keine Anfrage an Dritte. Die WebAssembly-Laufzeit lag schon auf der eigenen Domain. `npm run golive:check` prüft, dass der Build nicht mehr von `storage.googleapis.com` lädt. |
| B12 Reichweitenmessung | keine zum Start | Der Code bleibt vorbereitet und aus. `npm run golive:check` meldet, falls `VITE_ANALYTICS_SRC` gesetzt ist. |
| B3, B5, B9, B11, B13 | bleiben offen | als TODO in `docs/GO_LIVE_CHECKLISTE.md`, Abschnitt „Offene Entscheidungen“ |

### Neu aufgefallen, bitte klären

1. **Ergonomie-Report und Arbeitsplatz-Check in Paket 1 und 2:** Ihr Konzept nennt beide nur beim Video-Check, deshalb zeigt die Vergleichstabelle sie bei Analyse und Validierung und bei der Komplettbegleitung als „nicht enthalten“. Sind sie dort enthalten (die Messung ist dieselbe), oder bleibt es so? „Messwerte je Arbeitsplatz“ habe ich bei allen drei Paketen als enthalten geführt, weil der Steckbrief auf ihnen beruht.
2. **Übrige Zusagen auf `/betriebsrat` (B6):** Geändert ist die Zusage zum Training. Keine Weitergabe ohne Freigabe und die Vorstellung beim Betriebsrat auf Wunsch sind noch nicht ausdrücklich bestätigt. Die Komplettbegleitung enthält die Vorstellung jetzt als Leistung, das passt zur Zusage.

## C. TODO-Stellen im Code

| Stelle | Inhalt |
|---|---|
| `src/content/site.ts` (siteUrl) | Domain bestätigen (§7.5) |
| `src/content/site.ts` (Fußzeile) | Hinweis zur Server-Region erst, wenn das Hosting der Website feststeht |
| `src/content/pakete.ts` | Umfang je Paket (Arbeitsplätze, Dauer) |
| `src/content/gesundheit.ts` (`fehltage.kennzahl.wert`) | Fehlzeiten-Zahl aus dem BKK Gesundheitsreport 2025 nach Bestätigung eintragen |
