# Go-live-Checkliste

Stand: 31.10.2026. In Phase 7 vervollständigt, beide Rückmeldungen vom 31.10.2026 eingearbeitet (`docs/ENTSCHEIDUNGEN_NACHT.md`, Teile D und F).

Die Website geht erst live, wenn jede **harte Bedingung** erfüllt und mit Datum und Namen abgehakt ist. Eine nicht erfüllte harte Bedingung lässt sich nicht durch eine Ausnahme ersetzen: Entweder wird sie erfüllt, oder die betroffene Aussage wird vor dem Go-live von der Website entfernt.

## Harte Bedingungen

### 0. Anbieter und Impressum geklärt

Entscheidung G1 vom 31.10.2026.

- [ ] Geklärt, wer Anbieter ist (Motavi oder eine andere Gesellschaft), mit Rechtsform, Anschrift, Vertretung und Registereintrag.
- [ ] Bis dahin steht kein Firmenname auf Website, im internen Werkzeug und in den PDFs. `npm run golive:check` sucht nach „Motavi Inc./GmbH/UG/AG/Demo“.

Abgehakt am: ________ von: ________

### 1. Löschfristen im Speicher durchgesetzt

Aussagen zu Löschfristen dürfen erst live gehen, wenn die Fristen technisch durchgesetzt sind. Befehle: `motavi-backend/docs/BETRIEB.md`, Abschnitt Bucket.

- [ ] Lifecycle-Regel angewendet und geprüft (`infra/gcs_lifecycle.json`: Originalvideo unter `raw/` 1 Tag; Standbilder und `pose.npz` 30 Tage; JSON-Ergebnisse 365 Tage).
- [ ] Soft Delete abgeschaltet und Versionierung aus (Entscheidung vom 31.10.2026); `gcloud storage buckets describe` zeigt es.
- [ ] Wirkung geprüft: Inventar mit `python infra/gcs_inventory.py BUCKET_NAME` frühestens zwei Tage nach dem Anwenden. Unter `raw/` liegt kein Objekt älter als 1 Tag, unter `results/` keine Medien älter als 30 Tage.
- [ ] Löschung direkt nach der Auswertung geprüft: Nach einem Testupload liegt unter `raw/{job_id}/` nichts mehr, auch nach einer absichtlich fehlgeschlagenen Analyse.
- [ ] Firestore: Point-in-Time-Recovery und Sicherungen geprüft und entweder abgeschaltet oder in der Datenschutzerklärung genannt.

Betroffene Aussagen (vor dem Go-live erneut suchen: `grep -rn "gelöscht\|30 Tage\|365 Tage\|Löschfrist" src/content`):

| Stelle | Aussage |
|---|---|
| Startseite, Sektion Betriebsrat (`src/content/startseite.ts`, `betriebsrat.nachweis`) | Originalvideo unmittelbar nach der Auswertung gelöscht; Gelenkpunkte und drei Standbilder mit geschwärzten Köpfen 30 Tage |
| `/betriebsrat`, Abschnitt Anonymisierung und Speicherfristen (`src/content/betriebsrat.ts`) | Originalvideo gelöscht, auch bei Fehlschlag; kein Video aufbewahrt; Gelenkpunkte und Standbilder 30 Tage; Kennzahlen und bestätigter Steckbrief 365 Tage |
| `/so-funktionierts`, Schritt 02 (`src/content/soFunktionierts.ts`) | Originalvideo gelöscht, kein Video aufbewahrt, Köpfe auf den Standbildern geschwärzt |
| Upload-Seite für Kunden (`motavi-backend/frontend/src/pages/HochladenPage.tsx`) | Originalvideo unmittelbar nach der Auswertung gelöscht |

Abgehakt am: ________ von: ________

### 2. Rechtstexte und Verträge vollständig

- [ ] Impressum und Datenschutzerklärung durch Anwalt oder Generator (§7.6), ohne Platzhalter. Fakten für den Verfasser: `docs/RECHTSTEXTE_FAKTEN.md`.
- [ ] Die Datenschutzerklärung nennt Kontaktformular (Aufbewahrung 365 Tage) und den Upload für den Video-Check. Erkennungsmodell selbst gehostet, keine Reichweitenmessung zum Start (beides entschieden am 31.10.2026).
- [ ] Mit dem Anwalt geklärt (Entscheidung vom 31.10.2026: von Ihnen zu klären): Vorlage für den Auftragsverarbeitungsvertrag, technische und organisatorische Maßnahmen, Allgemeine Geschäftsbedingungen bzw. Angebotsbedingungen, Vorlage für die Datenschutz-Folgenabschätzung der Kunden.

Abgehakt am: ________ von: ________

### 3. Kontaktformular funktioniert im Betrieb

- [ ] Website mit `VITE_API_BASE_URL` (https-Adresse des Backends) gebaut.
- [ ] CORS im Backend auf die Website-Domain beschränkt: Substitution `_CORS_ORIGINS` im Build-Trigger (`motavi-backend/docs/BETRIEB.md`); ohne den Wert startet der Dienst in Produktion nicht.
- [ ] E-Mail-Benachrichtigung eingerichtet (`_SMTP_HOST`, `_SMTP_FROM`, `_CONTACT_NOTIFY_TO`, Secret `SMTP_PASSWORD`); ohne sie bleiben Anfragen unbemerkt. Festgelegt, wer Anfragen innerhalb einer Woche beantwortet.
- [ ] Je eine Testanfrage als Hersteller und als Robotik-Anbieter über das echte Formular gesendet, in Firestore (`kontaktanfragen`) gefunden und die Benachrichtigung erhalten.
- [ ] Firestore-TTL-Regel auf `loeschen_am` angelegt (`motavi-backend/docs/KONTAKT.md`), Region der Datenbank `europe-west3`.

Abgehakt am: ________ von: ________

### 4. Backend betriebsbereit

Befehle und Reihenfolge: `motavi-backend/docs/BETRIEB.md`.

- [ ] Eigenes Dienstkonto mit den dort genannten Rollen, alter Schlüssel entfernt und gelöscht.
- [ ] Secrets `JWT_SECRET` (mindestens 32 Byte) und `GCS_BUCKET_NAME` angelegt, `_SECRETS` im Build-Trigger vollständig.
- [ ] `_PUBLIC_APP_URL` gesetzt, CORS des Buckets für den Browser-Upload gesetzt (`infra/gcs_cors.json`).
- [ ] Deploy erfolgreich (die Startprüfung in Produktion hat nichts bemängelt).
- [ ] Ende-zu-Ende geprüft: Upload-Link erstellt, Video über den Link hochgeladen, Analyse fertig, Ergonomie-Report mit Zykluszeit und Greifraum erzeugt, Standbilder mit geschwärzten Köpfen, Originalvideo gelöscht.
- [ ] Benachrichtigungen in Cloud Monitoring für „Kontaktanfrage konnte nicht gespeichert werden“, „Deleting the raw video failed“ und „Pipeline failed“.

Abgehakt am: ________ von: ________

### 5. Keine ungeprüften Aussagen

- [ ] Kein „DSGVO-konform“ und kein „datenschutzkonform“ auf Website, im internen Werkzeug und in den PDFs, bis die Aussage juristisch geprüft ist (Entscheidung vom 30.10.2026).
- [ ] Kein Link zur Partnerseite `/fuer-robotik-anbieter`, bis `docs/WEBSITE_PLAN.md` §7.1 erfüllt ist; die Seite bleibt bis dahin `noindex`.
- [ ] Label „Pilotphase“ an allen Kennzahlen, die laut `docs/validierung_steckbrief.md` (Repo `motavi-backend`) noch nicht validiert sind, darunter der Haltungsindex.
- [ ] Nirgends „REBA“ als gemessener Wert: Der Wert heißt „Haltungsindex auf REBA-Basis (1 bis 10)“ (Entscheidung G3 vom 31.10.2026).
- [ ] „Analyse auf Servern in Deutschland“ stimmt (Backend `europe-west3`, Firestore-Region).
- [ ] „Server in Deutschland“ ohne Zusatz in Subline und Fußzeile erst, wenn das Hosting der Website feststeht und in Deutschland liegt (Entscheidung vom 31.10.2026). Bis dahin steht in der Subline „Analyse auf Servern in Deutschland“ (`src/content/startseite.ts`), die Fußzeile nennt keinen Standort (`src/content/site.ts`).
- [ ] Fehlzeiten auf `/gesundheit`: Zahl aus dem BKK Gesundheitsreport 2025 (Berichtsjahr 2024) bestätigt und in `src/content/gesundheit.ts` (`fehltage.kennzahl.wert`) eingesetzt, oder der Platzhalter entfernt. `npm run golive:check` meldet ihn.
- [x] Zusagen bestätigt am 31.10.2026: auf `/betriebsrat` Zweckbindung (keine Leistungskontrolle, keine Weitergabe ohne Freigabe, kein Training ohne gesonderte schriftliche Vereinbarung und Zustimmung des Betriebsrats) und Vorstellung beim Betriebsrat auf Wunsch (P4); im Formular „in der Regel innerhalb einer Woche“ (B8).

Abgehakt am: ________ von: ________

### 6. Freigabe der Indexierung

- [ ] Name, Projekt und Domain geklärt (§7.4, §7.5); `VITE_SITE_URL` gesetzt, Sitemap und Canonical-Links zeigen auf die Domain (`npm run golive:check` verlangt `VITE_SITE_URL`).
- [ ] Erst dann `VITE_SITE_INDEXABLE=true`.

Abgehakt am: ________ von: ________

## Von Ihnen zu klären (TODO vor dem Go-live)

Stand 31.10.2026, aus `docs/ENTSCHEIDUNGEN_NACHT.md`, Teile B, E und F.

- [ ] **Domain und Postfach:** Domain der Website (§7.5) und ob `hello@motavi.ai` existiert und wer es liest (`src/content/site.ts`).
- [ ] **Reisekosten:** in Paket 1 und 2 enthalten oder zusätzlich; bediente Region; Zeit vor Ort.
- [ ] **Umfang je Paket (B3):** Preis je Arbeitsplatz, je Projekt oder für eine bestimmte Zahl von Arbeitsplätzen; Bearbeitungsdauer. Danach `src/content/pakete.ts` (`umfang`) ergänzen.
- [ ] **Rechtliches mit dem Anwalt:** Auftragsverarbeitungsvertrag, technische und organisatorische Maßnahmen, AGB, Vorlage für die Datenschutz-Folgenabschätzung (harte Bedingung 2).
- [ ] **Rolle gegenüber Robotik-Anbietern (B5, §7.2):** Provision, Auftragsanalyse oder rein neutral. Vor dem Verlinken der Partnerseite entscheiden und gegenüber Endkunden offenlegen.
- [ ] **Backend-Adresse und CORS (B9):** harte Bedingung 3.
- [ ] **Impressum und Datenschutzerklärung (B11):** harte Bedingungen 0 und 2.
- [ ] **Hosting der Website (B13):** Anbieter und Standort; danach Subline und Fußzeile prüfen (harte Bedingung 5) und Lighthouse auf dem Hosting wiederholen (Abschnitt Qualität).
- [ ] **Weitere offene Punkte aus Teil F** von `docs/ENTSCHEIDUNGEN_NACHT.md` (z.B. Übernahme nach `main` und automatische Tests, Zurücksetzen von Passwörtern, Videos für die Validierung, Leitfaden zum Herunterladen) entschieden oder bewusst zurückgestellt.

## Maschinelle Prüfung

`npm run build && npm run golive:check` mit denselben Umgebungsvariablen wie für den Build prüft am fertigen Build:

- Rechtsseiten und übrige Seiten ohne Platzhalter;
- Seiten indexierbar;
- kein „DSGVO-konform“;
- Partnerseite nicht verlinkt und `noindex`;
- keine Reichweitenmessung, Erkennungsmodell nicht von Google geladen;
- Domain gesetzt und in der Sitemap;
- keine Firmennamen;
- keine Analyse-App im Build;
- Backend-Adresse für das Formular.

Exit-Code 1, solange eine Bedingung fehlt. Der Rest dieser Liste ist Handarbeit.

## Qualität (Phase 7)

Stand 31.10.2026, Bericht in `docs/QUALITAET.md`.

Lokal am 31.10.2026 erfüllt (Details im Bericht); vor dem Go-live auf dem echten Hosting wiederholen und hier abhaken.

- [ ] Lighthouse auf allen Seiten in allen vier Kategorien mindestens 90, mobil und Desktop. Ausnahme: SEO auf den `noindex`-Seiten (Partnerseite, 404).
- [ ] Keine Seite mit seitlichem Scrollen ab 360 px Breite.
- [ ] Tastaturbedienung: Sprunglink, sichtbarer Fokus, Rechner, Arbeitsplatz-Check und Formular vollständig per Tastatur.
- [ ] Kontrasttest (`src/styles/tokens.test.ts`, Werte aus `src/styles/contrastReport.ts`) grün.
- [ ] Keine Reichweitenmessung zum Start (Entscheidung vom 31.10.2026): `VITE_ANALYTICS_SRC` beim Build nicht gesetzt. `npm run golive:check` prüft das.
