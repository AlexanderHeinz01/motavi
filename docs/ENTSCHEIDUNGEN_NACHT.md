# Entscheidungen und offene Punkte, Phasen 4 bis 7

Stand: 31.10.2026, eigenständig umgesetzt in der Nacht, Rückmeldung vom 31.10.2026 am Ende eingearbeitet. Teil A: Entscheidungen, die ich getroffen und umgesetzt habe (bitte prüfen, alles lässt sich ändern). Teil B: Punkte, die Sie klären müssen. Teil D: Ihre Rückmeldung vom 31.10. Teil E: kritische Prüfung mit weiteren offenen Punkten. Teil F: Ihre Rückmeldung zu Teil E und was davon umgesetzt ist.

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
| B1 REBA | trägt „Pilotphase“, bis es gegen manuelle Bewertungen geprüft ist | Steckbrief-Seite (REBA jetzt mit Label, der Test verlangt das für alle gemessenen Kennzahlen), `/gesundheit` (Hinweis „noch nicht gegen manuelle REBA-Bewertungen geprüft“), Startseite (Pilothinweis nennt REBA). Im Repo `motavi-backend` zusätzlich: Hinweis im Steckbrief-PDF und im Ergonomie-Report. Im Dashboard trägt REBA das Label nur im Steckbrief-Tab. **Korrektur aus E.2:** Im Ergonomie-Tab des Backend-Dashboards, im JSON-Export (`PILOTPHASE`-Liste ohne `reba_mittel` und `reba_max`) und in der Analyse-App unter `/app` mit ihrem PDF fehlt es noch. |
| B2 Fehlzeiten | Platzhalter für die Quelle, Zahl erst nach Ihrer Bestätigung | `/gesundheit` zeigt einen markierten Platzhalter mit der Quelle „BKK Gesundheitsreport 2025, Berichtsjahr 2024“. Nach Ihrer Bestätigung die Zahl in `src/content/gesundheit.ts` (`fehltage.kennzahl.wert`) eintragen, dann erscheint sie als Kennzahl mit Quelle. `npm run golive:check` meldet den Platzhalter, bis er ersetzt oder entfernt ist. |
| B7 Kontaktanfragen | 365 Tage bestätigt | In `docs/RECHTSTEXTE_FAKTEN.md` und der Checkliste vermerkt. TTL-Regel, Firestore-Region und SMTP bleiben Aufgaben der harten Bedingung 3. |
| B8 Erfolgsmeldung | „Wir melden uns in der Regel innerhalb einer Woche.“ | `src/content/pilot.ts`, ebenso der Beispieltext im Styleguide. |
| B10 Erkennungsmodell | selbst hosten | Das Modell (`src/analysis/models/pose_landmarker_full.task`, 9,4 MB, unverändert, Prüfsumme in der README daneben) wird mitgebaut und von der eigenen Domain geladen. Im Browser geprüft: Das Modell lädt, die Erkennung läuft, es gibt keine Anfrage an Dritte. Die WebAssembly-Laufzeit lag schon auf der eigenen Domain. `npm run golive:check` prüft, dass der Build nicht mehr von `storage.googleapis.com` lädt. |
| B12 Reichweitenmessung | keine zum Start | Der Code bleibt vorbereitet und aus. `npm run golive:check` meldet, falls `VITE_ANALYTICS_SRC` gesetzt ist. |
| B3, B5, B9, B11, B13 | bleiben offen | als TODO in `docs/GO_LIVE_CHECKLISTE.md`, Abschnitt „Offene Entscheidungen“ |

### Neu aufgefallen, bitte klären

1. **Ergonomie-Report und Arbeitsplatz-Check in Paket 1 und 2:** Ihr Konzept nennt beide nur beim Video-Check, deshalb zeigt die Vergleichstabelle sie bei Analyse und Validierung und bei der Komplettbegleitung als „nicht enthalten“. Sind sie dort enthalten (die Messung ist dieselbe), oder bleibt es so? „Messwerte je Arbeitsplatz“ habe ich bei allen drei Paketen als enthalten geführt, weil der Steckbrief auf ihnen beruht.
2. **Übrige Zusagen auf `/betriebsrat` (B6):** Geändert ist die Zusage zum Training. Keine Weitergabe ohne Freigabe und die Vorstellung beim Betriebsrat auf Wunsch sind noch nicht ausdrücklich bestätigt. Die Komplettbegleitung enthält die Vorstellung jetzt als Leistung, das passt zur Zusage.

## E. Kritische Prüfung 31.10.

Gesamte Umsetzung in beiden Repos noch einmal geprüft. „Fehler“ lässt sich ohne Entscheidung beheben, „Entscheidung“ braucht Sie. Die Ergebnisse zweier unabhängiger Prüfungen stehen in E.2 (Website-Texte gegen das Produkt) und E.3 (Backend). Die wichtigsten Punkte aus beiden habe ich im Code nachgeprüft.

### E.0 Überblick: was zuerst entschieden werden muss

1. **Welche Analyse-App geht live?** Die Fußzeile verlinkt die Browser-App unter `/app`. Ihre Anmeldung ist eine Attrappe (E.2 Punkt 1). Die Backend-App (`motavi-backend/frontend`) hat echte Anmeldung, Steckbrief und Expertenansicht, aber offene Endpunkte (E.3 Punkt 1). Von dieser Entscheidung hängen Datenweg, Texte zu Speicherfristen und der Video-Check ab (E.1 Punkte 2, 4 und 8).
2. **REBA oder Haltungsindex?** Gemessen wird ein Index auf der Skala 1 bis 10 mit Winkelfehlern im Backend; Website, Report und Vorrang-Regel sprechen von REBA mit 1 bis 15 (E.1 Punkt 1, E.2 Punkt 6, E.3 Punkt 17).
3. **Was enthält der Video-Check genau?** Messwerte, Arbeitsplatz-Check, Report, Freischaltung im Produkt (E.1 Punkt 4, E.2 Punkte 2, 4 und 5).

Unabhängig davon sind vor jedem Einsatz mit echten Videos zu beheben: Anmeldung und Eigentümerprüfung auf allen Backend-Routen, Lücken der Anonymisierung, Upload über 32 MiB, Fehler „keine Person erkannt“ ergibt „geringes Risiko“ (E.3 Punkte 1 bis 5). Vor dem Go-live der Website: alte Seiten aus dem Build nehmen und die falschen Aussagen streichen (E.2 Punkte 7 bis 13). Die meisten übrigen Punkte sind „Fehler“, die ich ohne Entscheidung beheben kann.

### E.1 Eigene Befunde

**Widersprüche zwischen Website und Produkt**

1. **„REBA“ ist kein Standard-REBA (Entscheidung, wichtigster Punkt).** Backend (`motavi-backend/backend/app/services/analyzer.py`, `_overall_reba`) und Analyse-App (`src/analysis/reba.ts`) berechnen einen gewichteten Index aus Körperregionen (Lendenbereich 30 %, Nacken 20 %, Schultern, Knie, Unterarm je 10 %) und rechnen ihn auf eine Skala von 1 bis 10 um. Das Standard-REBA rechnet anders: Tabellen A, B und C, Skala 1 bis 15, mit Last, Griffart und Aktivität. Handgelenke fließen nicht ein. Betroffen sind:
   - `/gesundheit` (`src/content/gesundheit.ts`: „Rumpf, Nacken, Beine, Ober- und Unterarme sowie Handgelenke … Wert von 1 bis 15“, Stufentabelle bis „ab 11“);
   - Steckbrief-Seite (`src/content/steckbrief.ts`, Eintrag „REBA (Mittel)“: „Skala 1 bis 15“);
   - Ergonomie-Report (`backend/app/services/pdf.py`: Stufen bis „ab 11 sehr hoch“), Stufe „sehr hoch“ ist auf der Skala 1 bis 10 nie erreichbar;
   - Vorrang ab REBA-Mittel 8 und Kriterium `reba_mittel` in `config/workplace_scoring.json`: beide sind für Standard-REBA gedacht, gemessen wird aber der Index.

   Optionen:
   - (a) Standard-REBA umsetzen: Tabellen A, B und C, Last aus dem Teilegewicht, Griffart als Annahme.
   - (b) Den Wert ehrlich benennen, z. B. „Haltungsindex auf REBA-Basis, 1 bis 10“, und Texte, Stufen, Vorrangschwelle und Check-Werte anpassen.

   Empfehlung: kurzfristig (b), (a) zusammen mit der Validierung.
2. **Datenweg (Entscheidung).** Die Analyse-App rechnet vollständig im Browser (`src/content/datenweg.ts`, `DATENWEG = 'browser'`), das Video verlässt den Rechner nicht. Die Website sagt dagegen:
   - „Analyse auf Servern in Deutschland“ (Subline);
   - „Originalvideo unmittelbar nach der Auswertung gelöscht“ (`/so-funktionierts`, Schritt 02);
   - Speicherfristen auf `/betriebsrat`.

   Das stimmt nur für den Weg über das Backend, also für Aufnahmen, die Motavi in Paket 1 und 2 selbst verarbeitet. Zu klären: Läuft der Video-Check über die Browser-App (Selbstbedienung, Motavi sieht das Video nie) oder über einen Upload ins Backend? Danach Subline, `/so-funktionierts` und `/betriebsrat` je Weg formulieren. Der Steckbrief braucht in jedem Fall das Backend (`pose.npz`).
3. **`/so-funktionierts` passt nicht zum Video-Check (Fehler).** Die vier Schritte (`src/content/soFunktionierts.ts`) versprechen jedem Kunden „Experte bewertet“ und „Steckbrief und Report“, der Video-Check enthält beides nicht. Ebenso `/pakete`: „Alle Pakete nutzen das Arbeitsplatz-Steckbrief-Modul in der Pilotphase.“ Vorschlag: Schritte 03 und 04 als „ab Paket Analyse und Validierung“ kennzeichnen und den Hinweis auf `/pakete` auf Paket 1 und 2 beschränken. Wie genau, hängt von Punkt 2 und 4 ab.
4. **Inhalt des Video-Checks (Entscheidung).**
   - Welche „Messwerte je Arbeitsplatz“ sind gemeint? Die Browser-App liefert REBA-Index, Bewegungsanteile, kritische Momente und den PDF-Report. Zyklen, Greifraum und Ablaufschritte gibt es nur im Backend.
   - Der „Arbeitsplatz-Check“ ist auf der Website ein kostenloser Selbsttest. Was ist er als bezahlte Leistung? Zum Beispiel der Check mit gemessenen statt geschätzten Werten, also eine automatische Voreinschätzung ohne Experten.

**Betrieb und Ablauf**

5. **`golive:check` erzwingt die Domain nicht (Fehler).** Ohne `VITE_SITE_URL` setzt der Build `https://motavi.ai` als Standard ein, und die Prüfung „Sitemap mit Domain“ besteht trotzdem. Die Prüfung sollte `VITE_SITE_URL` verlangen.
6. **Domain und E-Mail (Entscheidung).** `motavi.ai` und `hello@motavi.ai` stehen als Standard im Code (`src/content/site.ts`), obwohl Name und Projekt noch offen sind (§7.4, §7.5). Existiert das Postfach, und wer liest es?
7. **Nichts ist auf `main`, keine CI (Entscheidung).** Die Website liegt nur auf `website-relaunch`, das Backend auf `claude/lucid-ptolemy-uk3l0m` (23 Commits vor `main`). In keinem Repo laufen Tests automatisch, es gibt keine GitHub-Workflows. Vorschlag: zwei Pull Requests mit Durchsicht, danach eine CI mit Tests, Typprüfung und `golive:check`.
8. **Zwei Oberflächen (Entscheidung).** `motavi/app` (Analyse im Browser, Anmeldung am Backend) und `motavi-backend/frontend` (Upload ins Backend, Dashboard, Steckbrief-Tab, Expertenansicht) bestehen nebeneinander. Wo läuft das Backend-Frontend? Welche Oberfläche bekommt der Kunde, welche ist internes Werkzeug für den Experten?
9. **Zwei REBA-Berechnungen (Entscheidung).** `analyzer.py` und `src/analysis/reba.ts` sind getrennte Umsetzungen. Laut `README.md` im Website-Repo weichen drei Winkel voneinander ab; die Angabe ist vermutlich veraltet, seit das Backend korrigiert wurde. Kein Test hält beide gleich. Entweder eine Quelle oder ein Test mit gemeinsamen Referenzwerten. Hängt mit Punkt 1 zusammen.
10. **Kontaktanfragen können unbemerkt bleiben.** Ohne SMTP liegen Anfragen nur in der Firestore-Konsole. Vorschlag: Benachrichtigung als harte Go-live-Bedingung, nicht optional, und festlegen, wer innerhalb einer Woche antwortet.
11. **Zugänge zur Analyse-App (Entscheidung).** Selbstregistrierung ist abgeschaltet. Wer legt Kunden-Zugänge an, und wie? Wie setzt ein Kunde ein vergessenes Passwort zurück? Wann wird ein Zugang wieder gelöscht?

**Recht und Organisation** (zur Klärung mit Anwalt oder Datenschutzberatung, keine Rechtsberatung)

12. **Rolle im Datenschutz.** Motavi verarbeitet die Videos voraussichtlich im Auftrag des Kunden. Nötig wären:
    - eine Vorlage für den Auftragsverarbeitungsvertrag;
    - eine Beschreibung der technischen und organisatorischen Maßnahmen;
    - Verträge mit Google Cloud, Hosting und E-Mail-Anbieter;
    - ein Verzeichnis der Verarbeitungstätigkeiten.

    Für Videoanalysen am Arbeitsplatz braucht der Kunde wahrscheinlich eine Datenschutz-Folgenabschätzung. Bietet Motavi dafür und für eine Betriebsvereinbarung Vorlagen an? Das würde zur Komplettbegleitung passen.
13. **Videos für die Validierung.** Für S6 braucht es echte Videos, deren Abläufe von Hand mit Zeitstempeln erfasst werden. Kundenvideos dafür zu nutzen geht über die Zweckbindung auf `/betriebsrat` hinaus („Die Daten dienen nur der Gestaltung von Arbeitsplätzen …“). Das braucht eine eigene Vereinbarung. Wer erfasst die Abläufe von Hand?
14. **Kalibrierung der Annahmen.** Folgende Werte in `config/workplace_scoring.json` sind Annahmen:
    - Gewichte und Schwellen 50 und 60;
    - vermeidbare Anteile;
    - Investitions- und Betriebskostenbandbreiten;
    - Werte des Arbeitsplatz-Checks.

    Sie gehören an drei bis fünf Arbeitsplätzen gegen Ihre Expertenbewertung geprüft (STECKBRIEF_MODUL §8). Wer macht das, und bis wann? Bis dahin zeigt die Website die Schwellen als feste Regeln.

**Pakete und Vertrieb**

15. **Leistungen vor Ort (Entscheidung, gehört zu B3).** Sind Reisekosten in Paket 1 und 2 enthalten? Welche Region bedienen Sie? Wie viel Zeit vor Ort ist eingeplant?
16. **Leitfaden für den Video-Check (TODO).** Die Karte verspricht eine „Aufnahme nach Leitfaden“, den Leitfaden gibt es aber nur als Hinweise auf `/so-funktionierts`, nicht als Dokument zum Herunterladen.
17. **Vertragsbedingungen (Entscheidung).** Allgemeine Geschäftsbedingungen oder Angebotsbedingungen mit Zahlungsziel und Haftung für die „grobe Abschätzung“ der Wirtschaftlichkeit fehlen.
18. **Wer ist „der Experte“? (Entscheidung).** Die Website verspricht eine Expertenbewertung. Soll die Qualifikation genannt werden, etwa Ergonomie oder Arbeitswissenschaft? Eine Seite „Über uns“ gibt es nicht.
19. **Analyse-App nicht geprüft (TODO).** Die dunkle Oberfläche unter `/app` war nicht Teil der Qualitätsprüfung in Phase 7: Lighthouse, Barrierefreiheit und Texte gegen die Leitplanken stehen aus.

### E.2 Website-Texte gegen das Produkt (unabhängige Prüfung)

Repo `motavi`, sofern nicht anders angegeben. Punkte, die schon in E.1 oder E.3 stehen, sind dort ergänzt und hier nur verwiesen. Nachgeprüft habe ich die Punkte 1, 6, 7 und 8.

**Analyse-App und Produkt**

1. **Die Anmeldung zur Analyse-App ist eine Attrappe (Fehler, nachgeprüft; Entscheidung siehe E.0).**
   - Die Fußzeile jeder Seite verlinkt „Analyse-App, Anmelden“ (`src/content/site.ts`).
   - `src/app/api/auth.ts` nimmt jede E-Mail mit jedem Passwort an, vorbelegt mit demo@motavi.de / motavi2026 (`LoginPage.tsx`).
   - Die Analyse läuft im Browser, die Ergebnisse bleiben unbefristet im Browser gespeichert. Steckbrief und JSON gibt es dort nicht, nur ein einseitiges PDF.
   - Damit erhält jeder Besucher den Ergonomie-Report des Video-Checks (990 €) kostenlos.
   - „Demo anfragen“ führt ins Leere (`/#demo`).

   Entscheidung: `/login` und `/app` aus dem Website-Build nehmen und auf die Backend-App verweisen, oder die App behalten und alle Aussagen zu Server, Fristen und Steckbrief anpassen.
2. **Das Produkt trennt die Pakete nicht (Entscheidung).** Im Backend-Dashboard sieht jeder angemeldete Nutzer den Steckbrief-Tab, PDF und JSON verlangen nur eine Anmeldung. Ein Video-Check-Kunde erhält so einen „Steckbrief mit Empfehlung“ als ungeprüften Vorschlag. Freischaltung je Paket oder Paketbeschreibung anpassen.
3. **Feld „Körpergröße“ (Fehler).** Es wird in beiden Upload-Masken abgefragt, 365 Tage gespeichert, aber nirgends gerechnet. Es widerspricht `/betriebsrat` („gehört zu einem Arbeitsplatz, nicht zu einer Person“). Vorschlag: Feld entfernen.
4. **„Jeder bekommt Experte, Steckbrief und Report“ (Fehler, ergänzt E.1 Punkt 3).** Neben `/so-funktionierts` betroffen:
   - Startseite, Ablauf: Schritt 03 „Experte bewertet“, Schritt 04 „Sie erhalten den Steckbrief“;
   - „für jeden Arbeitsplatz eine klare Empfehlung“ (Subline, `src/content/perspektiven.ts`).

   Nach der Vergleichstabelle liefert zudem kein Paket Steckbrief und Ergonomie-Report zusammen. Vorschlag: „je nach Paket“ formulieren.
5. **Arbeitsplatz-Check im Video-Check (Entscheidung, ergänzt E.1 Punkt 4).** Die Steckbrief-Seite beschreibt ihn als „Selbsteinschätzung, keine Messung“, bei der „nichts gespeichert“ wird. Im Backend gibt es dafür keine Funktion.

**Messung und Zahlen**

6. **REBA (ergänzt E.1 Punkt 1).** Der Ergonomie-Report widerspricht sich selbst: `pdf.py` nennt einmal „1 bis 15“, einmal „REBA-Skala 1 bis 10“. Die Browser-App nutzt eigene Stufen bei 4, 6 und 8; dasselbe Video ergibt in App und Backend zwei verschiedene Werte. So kann die beschlossene Prüfung gegen manuelle REBA-Bewertungen nicht bestehen.
7. **Erfundene Wirkungszahlen im Ergonomie-Report (Fehler).** `analyzer.py` legt je Handlungsfeld feste Senkungen zwischen 15 und 50 % fest, angezeigt als „mögliche Senkung der Belastung“ (Backend-Report, Browser-App und ihr PDF). Keine Quelle, keine Kennzeichnung (Leitplanke 5). Streichen oder als Annahme kennzeichnen.
8. **Weitere Stellen ohne „Pilotphase“ (Fehler).**
   - `/automatisierung`: „Ab einem Score von 60 gilt Automatisierung als lohnend“.
   - Partnerseite: „deren Eignung gemessen ist“.
   - Pilothinweis auf `/so-funktionierts` ohne REBA.
   - Dazu die Korrektur zu B1 in Teil D.

**Seiten und Texte, die nicht live gehen dürfen**

9. **Alte Startseite `/_alt-startseite` (Fehler).** Sie ist im Build und öffentlich erreichbar. `golive:check` nimmt sie aus der Prüfung aus. Inhalt:
   - „10× schnellere Analyse“, „80 % Kosteneinsparung“, „100 % Datenschutzkonform“;
   - LMM-Punktwert, „Normenkonforme Auswertung“, „Betriebsratskonform“;
   - Platzhalter-Zitate, ein Gründername, „On-Premise-Betrieb möglich“;
   - ein Calendly-Rahmen, also ein Dritter mit Cookies.

   Vorschlag: `src/marketing` löschen, wie in `CLAUDE.md` angekündigt.
10. **Werbeaussagen in der Browser-App und ihrem PDF (Fehler).**
    - „DIN EN ISO 10075 konform“ (die Norm betrifft psychische Belastung).
    - „datenschutzkonform“: umgeht die Regel, `golive:check` sucht nur „DSGVO-konform“.
    - „Motavi Inc.“
    - „Automatische Gesichtsanonymisierung“: maskiert werden nur drei Standbilder.
    - Drei verschiedene Stufenschemata, Gedankenstriche.
11. **Das Backend zeigt unter „/“ seine alte Marketingseite (Fehler).** Das ist `motavi-backend/frontend`, unter derselben Adresse, an die das Kontaktformular sendet. Darin:
    - „Anonymisierung vor Upload, kein Mitarbeiterbild verlässt den Betrieb“ ist falsch.
    - „analysiert Bewegungen Ihrer Mitarbeitenden“ widerspricht Leitplanke 6.
    - Die Kunden-App lädt Google Fonts von Google.
12. **`/_styleguide` und `/_design` (Entscheidung).** Beide sind `noindex`, aber öffentlich erreichbar. Der Styleguide zeigt alte Pakete („Steckbrief ab 1.900 €“, „Pilot ab 4.900 €“). Vorschlag: aus dem Produktions-Build nehmen.
13. **Begleittexte mit alten Aussagen (Fehler).**
    - `metadata.json`: „LMM-Punktwert“.
    - `README.md`: „DSGVO-konforme Gesichtsmaskierung“, „normgerecht“.
    - Gedankenstriche in Titeln.
    - Eine englische Fehlermeldung an Kunden (`analyzer.py`).
    - Die Gliederung der Datenschutzerklärung nennt noch die Reichweitenmessung (`src/content/rechtliches.ts`), obwohl B12 keine vorsieht.

**Formulierungen und Zusagen**

14. **„Kennzahlen und Steckbrief 365 Tage“** stimmt technisch nicht (Fehler, siehe E.3 Punkt 7). Vorschlag: Steckbrief nach der Bestätigung einfrieren und beim Abruf nicht neu speichern.
15. **Beteiligung des Betriebsrats zugesagt, aber nicht abgesichert (Entscheidung).** Startseite und `/betriebsrat` sagen „Einsatz nur mit Beteiligung des Betriebsrats“. Beim Video-Check lädt der Kunde aber selbst hoch, und keine Upload-Maske fragt danach. Bestätigung im Upload oder im Vertrag verlangen, oder „empfehlen wir“ schreiben.
16. **„freimachen“ auf `/kapazitaet` (Entscheidung).** „welche Kapazität eine bessere Gestaltung freimachen kann“ liegt nah am verbotenen „freisetz…“. Vorschlag: „gewinnen“ und das Wort in den Leitplanken-Test aufnehmen.
17. **Drei oder vier Empfehlungen? (Entscheidung).** Startseite, Perspektiven, Komponenten und das Vorschaubild sagen „drei Empfehlungen“, die Steckbrief-Seite „eine von vier gleichwertigen Empfehlungen“. Einheitlich festlegen, etwa „drei Wege, vier Empfehlungen“ oder durchgehend „vier“.
18. **„Validierung“ doppeldeutig (Entscheidung).** Der Paketname „Analyse und Validierung“ steht neben „Pilotphase: noch nicht validiert“. Vorschlag für die Leistung: „Prüfung vor Ort“.
19. **Domain, E-Mail und Firmenname uneinheitlich (Entscheidung, ergänzt E.1 Punkt 6).** Neben `motavi.ai` erscheinen `motavi.de` (Demo-Zugang, `$id` im Steckbrief-Schema, für das die Partnerseite wirbt), „Motavi Inc.“ und „Motavi Demo GmbH“. Die Wortmarke ist im Vorschaubild `public/og/motavi.png` fest eingebrannt.

### E.3 Backend (unabhängige Prüfung)

Repo `motavi-backend`, Branch `claude/lucid-ptolemy-uk3l0m`. Die Punkte 1, 3, 9 und 10 habe ich im Code selbst nachgeprüft. „Fehler“ kann ich ohne Entscheidung beheben, „Risiko“ braucht eine Entscheidung zu Betrieb oder Sicherheit.

**Vor jedem Betrieb mit echten Videos**

1. **Analyse ohne Anmeldung, keine Trennung zwischen Kunden (Fehler, nachgeprüft).**
   - `POST /upload`, `GET /analysis/{job_id}`, `GET /frames/...` und `GET /report/.../pdf` verlangen keine Anmeldung (`routers/upload.py`, `analysis.py`, `report.py`). Jeder kann Videos bis 500 MB hochladen und teure Analysen starten. Ohne `--max-instances` treibt das die Kosten hoch.
   - Wer eine Job-ID kennt, erhält Ergebnis, PDF und die kritischen Einzelbilder mit Beschäftigten.
   - Beim Steckbrief (`workplace.py`) reicht „angemeldet“: Jeder Nutzer kann die Kundenangaben jedes Jobs lesen und überschreiben.
   - Behebung: Anmeldung auf allen Routen, Eigentümer bzw. Firma am Job speichern und prüfen, Bilder über kurzlebige signierte Links, `--max-instances` setzen.
2. **Anonymisierung mit Lücken (Risiko).** Betroffen ist `services/analyzer.py`.
   - Bilder ohne erkannte Person kommen ungeschwärzt ins aufbewahrte Video.
   - Erkannt wird nur eine Person, Kolleginnen und Kollegen im Bild bleiben erkennbar.
   - Bei schlecht sichtbarem Kopf beginnt der Balken erst an den Schultern.
   - `video_anon.mp4` wird 30 Tage aufbewahrt, aber von keinem Code gelesen.

   Das berührt die Aussagen auf `/betriebsrat` und `/so-funktionierts` („Im aufbewahrten Video ist der Kopfbereich unkenntlich gemacht“). Vorschlag: das anonymisierte Video gar nicht speichern, die drei kritischen Bilder großzügig schwärzen und bei fehlender Erkennung verwerfen, Gesichtserkennung für alle Personen. Danach die Texte anpassen.
3. **Uploads über 32 MiB scheitern (Fehler).** Cloud Run begrenzt einzelne Anfragen auf 32 MiB, ein einminütiges Handyvideo hat etwa 100 MB. Das Frontend verspricht 500 MB, zudem liegt jeder Upload ganz im Arbeitsspeicher. Behebung: Upload über einen signierten Link direkt in den Speicher, danach die Analyse starten.
4. **Analyse läuft im Webdienst (Risiko).** Jedes Deploy und jedes Herunterskalieren bricht laufende Analysen ab, der Job bleibt dann dauerhaft auf „processing“. Der Kommentar „max. 4 parallele Jobs“ in `cloudbuild.yaml` stimmt nicht. Behebung: eigener Worker über Cloud Run Jobs oder Cloud Tasks, Jobstatus in Firestore.
5. **Keine Person erkannt ergibt „geringes Risiko“ (Fehler, nachgeprüft).** Ohne erkannte Person (falscher Winkel, dunkles Video) liefert die Analyse REBA 1,0 „LOW“, und der Steckbrief übernimmt den Wert als belastbar. Behebung: in diesem Fall ein Fehlerergebnis ausgeben und den Erkennungsanteil als Qualität führen.

**Löschfristen und Datenschutz**

6. **Soft Delete im Speicher (Risiko).** Google Cloud Storage hält gelöschte Objekte standardmäßig 7 Tage wiederherstellbar, also auch das „unmittelbar gelöschte“ Originalvideo. Entweder Soft Delete im Bucket abschalten (`--clear-soft-delete`) und Versionierung prüfen, oder die 7 Tage offen nennen. Gleiches für Firestore-Sicherungen prüfen. Gehört zur harten Go-live-Bedingung 1.
7. **Weitere Abweichungen bei den Löschfristen (Hinweis).**
   - Der Steckbrief wird immer aus `pose.npz` neu berechnet. Nach 30 Tagen liefern Abruf, PDF und Export deshalb 404, obwohl die Ergebnisse laut Website 365 Tage bleiben.
   - Jeder Abruf schreibt `workplace.json` neu, die Frist zählt damit faktisch ab dem letzten Abruf.
   - Bestätigungen speichern die E-Mail des Beraters (`bestaetigt_von`); das ist nicht dokumentiert.
   - Benachrichtigungsmails liegen mit allen Kontaktdaten im Postfach, außerhalb der 365 Tage.
8. **E-Mail-Versand ohne Zertifikatsprüfung (Fehler).** `starttls()` ohne SSL-Kontext prüft das Zertifikat des Mailservers nicht; Passwort und Anfragedaten wären mitlesbar.

**Kontaktformular**

9. **Rate-Limit umgehbar, Speicher wächst (Fehler, nachgeprüft).** Gezählt wird der erste Eintrag aus `X-Forwarded-For`, den der Absender frei setzen kann. Einträge werden nie gelöscht, eine Flut füllt den Speicher und kann laufende Analysen beenden. Behebung: den von Google angehängten Eintrag nehmen, Adressen prüfen, alte Einträge löschen. Entscheidung: zusätzlicher Schutz wie Cloud Armor oder ein Captcha ohne Cookies?
10. **Eingabeprüfung (Fehler).**
    - Ein Zeilenumbruch im Feld Unternehmen erzeugt nach dem Speichern einen Fehler 500; ein Neuversuch führt zu Duplikaten.
    - Steuerzeichen werden angenommen.
    - Adressen wie `a,b@evil.com` gelten als gültig.
    - Website und Backend erlauben unterschiedlich viele Arbeitsplätze (999.999 gegenüber 100.000).
11. **Blockierende Aufrufe, fehlendes Logging (Fehler).** Firestore, Mailversand und Speicherzugriffe blockieren den ganzen Dienst, solange sie laufen. Fehler beim Speichern werden nicht geloggt, die Anfrage ist dann still verloren. Einige Fehlermeldungen geben interne Details an anonyme Aufrufer.

**Deployment**

12. **`cloudbuild.yaml` löscht Secrets (Fehler).** `--set-secrets` entfernt alle vorhandenen Secrets und setzt nur zwei. Ein in der Konsole hinterlegtes `JWT_SECRET` oder `SMTP_PASSWORD` verschwindet bei jedem Deploy; danach antworten Anmeldung und Steckbrief mit 503, und der Mailversand bleibt still aus.
13. **Dienstkonto und Rechte (Risiko).** Statt eines dauerhaften Schlüssels sollte ein eigenes Dienstkonto angehängt werden. Die nötigen Rollen sind nirgends dokumentiert:
    - `storage.objectUser` auf dem Bucket. Ohne Löschrecht scheitert das Löschen des Originalvideos still.
    - `datastore.user`.
    - Zugriff auf die Secrets.
14. **Erkennungsmodell im Backend (Fehler).** Es wird bei jedem Kaltstart von Google geladen, ohne feste Version. Gleichzeitige Jobs können ein halb geladenes Modell erwischen. Behebung: Modell mit fester Version und Prüfsumme ins Image, wie auf der Website.
15. **Anmeldung (Hinweis).**
    - Keine Begrenzung der Anmeldeversuche.
    - An der Antwortzeit lässt sich erkennen, ob ein Konto existiert.
    - Setup-Schlüssel nicht in konstanter Zeit verglichen.
    - Keine Mindestlänge für Passwörter.
16. **Betriebsunterlagen (Hinweis).**
    - Die README ist leer, eine Liste der Umgebungsvariablen fehlt.
    - `.env.example` lässt das Backend beim Start abbrechen.
    - Kein Testschritt im Build.
    - Abhängigkeiten nicht auf Versionen festgelegt.
    - Das Image läuft als root.

**Messung**

17. **REBA-Berechnungen laufen auseinander (Fehler, nachgeprüft, gehört zu E.1 Punkt 1 und 9).** Das Backend misst den Oberarm gegen die Schulterlinie. Ein hängender Arm ergibt dort immer die höchste Stufe: aufrecht stehend 4,6 („mittel“) im Backend gegenüber 3,1 („niedrig“) in der App. Auch „Überkopf“ ist unterschiedlich definiert. Der Wert fließt in Belastungsindex und Vorrang-Regel ein. Rampe und Vorrangschwelle sind auf eine Skala abgestimmt, auf der schon neutrales Stehen etwa 4,6 ergibt.
18. **Zyklen pro Schicht (Hinweis).** Gerechnet wird mit der Schichtdauer aus dem Upload (480 min, brutto inklusive Pausen) und der Annahme, dass die ganze Schicht diese Tätigkeit ist. Zyklen pro Schicht und Wirtschaftlichkeit fallen damit um etwa den Pausenanteil zu hoch aus. Die Schichtdauer hat keine Grenzen (0 und negative Werte werden angenommen). Entscheidung: Netto-Arbeitszeit abfragen oder Pausenabzug annehmen?

## F. Rückmeldung 31.10., Teil 2

Ihre Entscheidungen zu „Neu aufgefallen“ (Teil D) und zu Teil E, umgesetzt am 31.10.2026. Commits: Repo `motavi-backend` `8d97e5b`, `0a940b3`, `ea9a7b1` (Branch `claude/lucid-ptolemy-uk3l0m`); Repo `motavi` `383dd57` und dieser Commit (Branch `website-relaunch`). Tests: Backend 354 grün (1 übersprungen), Website 507 grün.

### Grundsatz

| Nr. | Entscheidung | Umsetzung |
|---|---|---|
| G1 | Harte Go-live-Bedingung 0: Anbieter und Impressum geklärt; bis dahin keine Firmennamen | Bedingung 0 in `docs/GO_LIVE_CHECKLISTE.md`. „Motavi Inc.“ und „Motavi Demo GmbH“ entfernt. `npm run golive:check` sucht nach Firmennamen. |
| G2 | Keine Kunden-Selbstbedienung; Backend-App als internes Werkzeug; Upload-Link für Video-Check-Kunden; Website beschreibt nur den Weg über das Backend | Website: `/login` und `/app` nicht mehr im Build, Fußzeile ohne Link, Code bleibt (`src/app`, `src/analysis`). Backend: Upload-Links (`routers/upload_links.py`), öffentliche Seite `/hochladen/{token}`, alte Marketingseite unter „/“ entfernt. Texte auf `/so-funktionierts`, `/betriebsrat` und der Startseite beschreiben Upload, Analyse in Frankfurt und Löschung. |
| G3 | „Haltungsindex auf REBA-Basis (1 bis 10)“; Texte, Stufen, Report, Vorrang, Check anpassen | Überall umbenannt (Website, Dashboard, beide PDFs, Export-Schema 1 bis 10). Stufen und Schwellen siehe „Meine Festlegungen“. Doku `motavi-backend/docs/HALTUNGSINDEX.md`. |

### Pakete und Texte

| Nr. | Umsetzung |
|---|---|
| P1 | Video-Check: Aufnahme über persönlichen Upload-Link, Haltungsindex, Bewegungsanteile und kritische Momente, Zykluszeit und Greifraum, Ergonomie-Report; unter der Liste „Ohne Empfehlung und ohne Bewertung durch Experten“. Arbeitsplatz-Check aus allen Paketen gestrichen, er bleibt der kostenlose Selbsttest auf der Steckbrief-Seite. Damit der Report liefert, was das Paket verspricht, enthält der Ergonomie-Report jetzt den Abschnitt „Arbeitsablauf und Greifraum“ (aus `pose.npz`, Pilotphase). |
| P2 | Ergonomie-Report in allen drei Paketen (Karten, Vergleichstabelle, `/so-funktionierts`). |
| P3 | „Analyse vor Ort“ statt „Analyse und Validierung“. Die Leistung heißt weiter „Validierung und Ermittlung von Prozesspotenzialen vor Ort“ wie in Ihrem Konzept. |
| P4 | In der Checkliste als bestätigt abgehakt. |
| P5 | „Eine Messung, drei Wege“ (Startseite), „einer von drei gleichwertigen Wegen“ (Perspektiven, Steckbrief-Seite), „Oft lautet die Antwort: erst verbessern, dann automatisieren.“ Die Entscheidungsmatrix zeigt die Kombination weiter als vierte Zelle. |
| P6 | Startseite und `/betriebsrat`: „Wir empfehlen, den Betriebsrat von Anfang an zu beteiligen.“ Ebenso auf der Upload-Seite und in den Aufnahmehinweisen. |
| P7 | „Erfahrene Experten für Arbeitsgestaltung und Zeitwirtschaft (REFA)“ auf Startseite, `/so-funktionierts`, Steckbrief-Seite und `/automatisierung`; Mehrzahl statt „der Experte“. |
| P8 | „gewinnen“ statt „freimachen“; `freimach` und `datenschutzkonform` stehen jetzt im Leitplanken-Test. |
| P9 | Netto-Arbeitszeit je Schicht, Standard 450 min, Grenzen 60 bis 720 (Upload, Upload-Link, internes Werkzeug). Der Report rechnet die Minuten auf die Netto-Arbeitszeit hoch, nicht mehr zusätzlich auf 8 Stunden. |

### Behobene Fehler

**Priorität 1, Backend vor echten Videos**

- E.3.1: Anmeldung auf allen Job-Routen, Eigentümer je Job (`job.json`); das Team sieht alle Jobs, andere nur eigene. Einzelbilder über Links, die 15 Minuten gelten. `--max-instances=3`.
- E.3.3: Upload über eine Resumable-Session direkt in Cloud Storage, bis 1 GiB.
- E.3.5: Ohne erkannte Person eine Fehlermeldung statt „geringes Risiko“, ab 50 % Erkennung ein Ergebnis; der Erkennungsanteil ist die Qualität des Haltungsindex im Steckbrief.
- E.3.12: `cloudbuild.yaml` mit vollständiger Secret-Liste (`_SECRETS`), Umgebungsvariablen über Substitutionen. In Produktion startet der Dienst nicht ohne `JWT_SECRET` (mindestens 32 Byte), `PUBLIC_APP_URL` und `CORS_ORIGINS`.
- E.3.13: eigenes Dienstkonto ohne Schlüssel; Rollen und Befehle in `motavi-backend/docs/BETRIEB.md`.
- E.3.14: beide Modelle mit fester Version und Prüfsumme im Image; ohne Image ohne halb geladene Dateien.
- E.3.17: Nacken, Oberarm und Unterarm wie in der REBA-Definition und wie in der Browser-Variante. Aufrechtes Stehen ergibt jetzt etwa 3,1 statt 4,6. Golden-Referenz bewusst neu gesetzt.
- E.3.2: Es wird kein Video mehr gespeichert. Die drei Standbilder kommen aus dem Original, Köpfe aller Personen (bis zu sechs, aus den Gelenkpunkten) und alle von der Gesichtserkennung gefundenen Gesichter großzügig schwarz gefüllt. Bilder ohne erkannte Person und alle Bilder bei nicht verfügbaren Detektoren werden verworfen.
- E.3.6: Befehle für Soft Delete und Versionierung in `motavi-backend/docs/BETRIEB.md` und `docs/LOESCHKONZEPT.md`. **Von Ihnen auszuführen.**
- E.2.14: Der bestätigte Steckbrief wird als `steckbrief.json` eingefroren und von dort ausgeliefert, auch nach dem Löschen von `pose.npz`. Abrufe schreiben nichts. Änderungen des Teams frieren neu ein.
- E.3.7: Benachrichtigung nur als Hinweis mit Dokument-ID, ohne Inhalt der Anfrage.
- E.3.4: geplant in `motavi-backend/docs/WORKER.md` (Cloud Run Jobs), nicht umgesetzt.

**Priorität 2, Website vor dem Go-live**

- E.2.3: Körpergröße entfernt (Backend, internes Werkzeug).
- E.2.7: feste Senkungsprozente gestrichen (Backend, Report, internes Werkzeug, Code der Browser-App).
- E.2.8: Pilotphase auf `/automatisierung`, auf der Partnerseite und im Hinweis auf `/so-funktionierts`.
- E.2.9: alte Startseite gelöscht.
- E.2.11: alte Marketingseite im Backend entfernt, Schriften dort selbst gehostet.
- E.2.12: Styleguide und Designentwürfe nur im Entwicklungsserver.
- E.2.13: README, `metadata.json`, Titel, Fehlermeldung, Datenschutz-Gliederung bereinigt.
- E.2.16: siehe P8.
- E.1.3: `/so-funktionierts` je Paket.
- E.1.5: `golive:check` verlangt `VITE_SITE_URL`.
- E.1.10: Benachrichtigung und Zuständigkeit als harte Bedingung 3.

**Priorität 3, Rest**

- E.2.4: „Mit dem Steckbrief erhalten Sie für jeden Arbeitsplatz eine klare Empfehlung …“ (Subline und Beschreibung der Startseite).
- E.2.10: Werbeaussagen, Firmenname und Gedankenstriche im Code der Browser-App entfernt.
- E.2.6: Report einheitlich 1 bis 10.
- E.3.8: TLS mit Zertifikatsprüfung.
- E.3.9: Rate-Limit aus dem angehängten Eintrag, IPv6 je /64, höchstens 10.000 Schlüssel.
- E.3.10: Steuerzeichen und Adresslisten abgelehnt, gleiche Grenzen auf der Website (1 bis 100.000 Arbeitsplätze, gleiche E-Mail-Regel).
- E.3.11: synchrone Handler, Logging ohne personenbezogene Daten, keine internen Details in Fehlermeldungen.
- E.3.15: Begrenzung der Anmeldeversuche (10 in 15 Minuten), gleiche Laufzeit, Setup-Key in konstanter Zeit, Passwort mindestens 12 Zeichen.
- E.3.16 teilweise: README, Liste der Umgebungsvariablen, `.env.example` startet, Image ohne root.
- E.3.7: Die E-Mail des Beraters in Bestätigungen ist dokumentiert.

### Meine Festlegungen bei der Umsetzung (bitte prüfen)

1. **Stufen des Haltungsindex:** unter 4 niedrig, 4 bis unter 6 mittel, 6 bis unter 8 hoch, ab 8 sehr hoch. Das sind die Grenzen, die die Analyse schon für `reba_level` nutzte, jetzt überall gleich.
2. **Vorrang ab 6** (Stufe hoch). Folge: Im Arbeitsplatz-Check ergeben die Antworten „häufig“ und „ständig“ zur Haltung „vorrangig“, über alle Antwortkombinationen die Hälfte (vorher ein Viertel). Wenn Ihnen das zu oft ist: Vorrang ab 7 oder 8.
3. **Belastungsindex:** Rampe 3 (etwa aufrechtes Stehen) bis 8 statt 2 bis 9. **Check-Werte** je Stufenmitte: 3,0 / 5,0 / 7,0 / 8,5. Die Scores der Testprofile ändern sich um 1 bis 2 Punkte, alle Empfehlungen bleiben. Die Verteilung des Checks ist jetzt 35 / 31 / 23 / 11 %.
4. **Demo-Werte der Website** auf die neue Skala gesetzt, die Stufe bleibt gleich: Automatisieren 6,9 auf 4,6, Verbessern 6,4 auf 5,2 (beide mittel). Montage 5,8 und Beibehalten 3,4 unverändert.
5. **Upload-Links:** 14 Tage gültig (einstellbar 1 bis 60), ein Video je Link, höchstens 1 GiB. Der Kunde sieht nach dem Upload nur eine Bestätigung, keine Ergebnisse. Den Report schickt das Team.
6. **Zugriff:** Rollen `berater` und `admin` sehen alle Jobs; Konten mit Rolle `user` nur selbst angelegte. Kunden haben keine Konten.
7. **Gesichtserkennung:** MediaPipe Face Detector (Nahbereich) zusätzlich zur Kopf-Box aus den Gelenkpunkten. Auf größere Entfernung findet er Gesichter schlechter; die Kopf-Box aus den Gelenkpunkten greift dort.
8. **Eingefrorener Steckbrief:** Ohne Bestätigung ist ein Steckbrief nach 30 Tagen nicht mehr abrufbar (keine Pose-Daten). Mit Bestätigung bleibt er 365 Tage ab der letzten Änderung.
9. **CORS in Produktion Pflicht**, Website-Adresse über `_CORS_ORIGINS`.

### Weiter offen

Von Ihnen zu klären, geführt in `docs/GO_LIVE_CHECKLISTE.md`:

- Domain und Postfach;
- Reisekosten;
- Umfang je Paket;
- Rechtliches mit dem Anwalt (Auftragsverarbeitungsvertrag, technische und organisatorische Maßnahmen, AGB, Vorlage für die Datenschutz-Folgenabschätzung);
- B5, B9, B11, B13.

Noch nicht entschieden oder umgesetzt:

1. **Übernahme nach `main` und automatische Tests** (E.1.7). Vorschlag: zwei Pull Requests, danach GitHub Actions mit Tests, Typprüfung und `golive:check`. Dazu fehlen noch ein Testschritt in Cloud Build und feste Versionen der Python-Abhängigkeiten (E.3.16).
2. **Passwort vergessen und Konten löschen** (E.1.11). Konten legt das Team über `/auth/register` mit Setup-Key an (`motavi-backend/docs/BETRIEB.md`).
3. **Videos für die Validierung und Kalibrierung der Annahmen** (E.1.13, E.1.14). Damit kommt auch Standard-REBA (G3).
4. **Schutz des Kontaktformulars über das Rate-Limit hinaus** (E.3.9): Cloud Armor oder ein Captcha ohne Cookies.
5. **Leitfaden zum Herunterladen** für den Video-Check (E.1.16). Die Hinweise stehen auf `/so-funktionierts` und der Upload-Seite.
6. **„Validierung“ in der Leistung** von Paket 1 und 2 (E.2.18): Der Paketname ist geändert, die Leistung heißt weiter „Validierung … vor Ort“ neben „Pilotphase: noch nicht validiert“. Umbenennen in „Prüfung vor Ort“?
7. **Domain im Export-Schema und Vorschaubild** (E.2.19): `$id` `https://motavi.de/schema/…` in `docs/steckbrief_schema.json` und die eingebrannte Wortmarke in `public/og/motavi.png`. Nach der Domain-Entscheidung anpassen.
8. **Browser-Analyse:** nicht im Build. Stufen und Anmeldung dort sind alt (Attrappe). Vor einer Wiederverwendung angleichen oder löschen.
9. **Golden-Test mit echtem Video:** Die Referenz `testvideo_result.json` stammt von vor dem 31.10.2026 und muss mit dem Testvideo neu erstellt werden.

## C. TODO-Stellen im Code

| Stelle | Inhalt |
|---|---|
| `src/content/site.ts` (siteUrl) | Domain bestätigen (§7.5) |
| `src/content/site.ts` (Fußzeile) | Hinweis zur Server-Region erst, wenn das Hosting der Website feststeht |
| `src/content/pakete.ts` | Umfang je Paket (Arbeitsplätze, Dauer) |
| `src/content/gesundheit.ts` (`fehltage.kennzahl.wert`) | Fehlzeiten-Zahl aus dem BKK Gesundheitsreport 2025 nach Bestätigung eintragen |
