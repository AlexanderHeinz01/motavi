# Go-live-Checkliste

Stand: 31.10.2026, in Phase 7 vervollständigt.

Die Website geht erst live, wenn jede **harte Bedingung** erfüllt und mit Datum und Namen abgehakt ist. Eine nicht erfüllte harte Bedingung lässt sich nicht durch eine Ausnahme ersetzen: Entweder wird sie erfüllt, oder die betroffene Aussage wird vor dem Go-live von der Website entfernt.

## Harte Bedingungen

### 1. Lifecycle-Regel im Bucket angewendet und geprüft

Aussagen zu Löschfristen dürfen erst live gehen, wenn die Fristen im Speicher technisch durchgesetzt sind.

- [ ] Regel angewendet: `gcloud storage buckets update gs://BUCKET_NAME --lifecycle-file=infra/gcs_lifecycle.json` (Repo `motavi-backend`, Befehle in `docs/LOESCHKONZEPT.md`)
- [ ] Regel geprüft: `gcloud storage buckets describe gs://BUCKET_NAME` zeigt dieselben Regeln wie `infra/gcs_lifecycle.json` (Originalvideo unter `raw/` 1 Tag; anonymisiertes Video, Bilder und `pose.npz` 30 Tage; JSON-Ergebnisse 365 Tage)
- [ ] Wirkung geprüft: Inventar mit `python infra/gcs_inventory.py BUCKET_NAME` (Repo `motavi-backend`) frühestens zwei Tage nach dem Anwenden. Unter `raw/` liegt kein Objekt älter als 1 Tag, unter `results/` keine Medien älter als 30 Tage.
- [ ] Löschung direkt nach der Auswertung geprüft: Nach einem Testupload liegt unter `raw/{job_id}/` nichts mehr, auch nach einer absichtlich fehlgeschlagenen Analyse.

Betroffene Aussagen (vor dem Go-live erneut suchen: `grep -rn "gelöscht\|30 Tage\|Löschfrist" src`):

| Stelle | Aussage |
|---|---|
| Startseite, Sektion Betriebsrat (`src/content/startseite.ts`, `betriebsrat.nachweis`) | Originalvideo unmittelbar nach der Auswertung gelöscht, anonymisiertes Video und Gelenkpunkte 30 Tage |
| Analyse-App, Datenweg Server (`src/content/datenweg.ts`, nur wenn `DATENWEG = 'server'`) | Originalvideo unmittelbar nach der Auswertung gelöscht |
| `/betriebsrat`, Abschnitt Anonymisierung und Speicherfristen (`src/content/betriebsrat.ts`) | Originalvideo unmittelbar nach der Auswertung gelöscht, auch bei Fehlschlag; anonymisiertes Video und Gelenkpunkte 30 Tage; Kennzahlen und Steckbrief 365 Tage |
| `/so-funktionierts`, Schritt 02 (`src/content/soFunktionierts.ts`) | Originalvideo unmittelbar nach der Auswertung gelöscht |

Abgehakt am: ________ von: ________

### 2. Rechtstexte vollständig

- [ ] Impressum und Datenschutzerklärung durch Anwalt oder Generator (§7.6), ohne Platzhalter. Fakten für den Verfasser: `docs/RECHTSTEXTE_FAKTEN.md`.
- [ ] Die Datenschutzerklärung nennt Kontaktformular, Analyse-App, gegebenenfalls Reichweitenmessung und das Laden des Erkennungsmodells von Google (oder das Modell wird selbst gehostet).

Abgehakt am: ________ von: ________

### 3. Kontaktformular funktioniert im Betrieb

- [ ] Website mit `VITE_API_BASE_URL` (https-Adresse des Backends) gebaut.
- [ ] Je eine Testanfrage als Hersteller und als Robotik-Anbieter über das echte Formular gesendet und in Firestore (`kontaktanfragen`) gefunden; bei konfiguriertem SMTP auch die E-Mail erhalten.
- [ ] Firestore-TTL-Regel auf `loeschen_am` angelegt (`motavi-backend/docs/KONTAKT.md`).
- [ ] CORS im Backend auf die Website-Domain beschränkt (`backend/app/main.py`, derzeit `*`).

Abgehakt am: ________ von: ________

### 4. Keine ungeprüften Aussagen

- [ ] Kein „DSGVO-konform“ auf Website, App und in den PDFs, bis die Aussage juristisch geprüft ist (Entscheidung vom 30.10.2026).
- [ ] Kein Link zur Partnerseite `/fuer-robotik-anbieter`, bis `docs/WEBSITE_PLAN.md` §7.1 erfüllt ist; die Seite bleibt bis dahin `noindex`.
- [ ] Label „Pilotphase“ an allen Kennzahlen, die laut `docs/validierung_steckbrief.md` (Repo `motavi-backend`) noch nicht validiert sind.
- [ ] „Server in Deutschland“ stimmt für alle Daten, die die Website und der Dienst verarbeiten (Backend `europe-west3`, Firestore-Region, Hosting der Website).
- [ ] Zusagen auf `/betriebsrat` und im Formular (Antwort innerhalb von zwei Werktagen) intern bestätigt.

Abgehakt am: ________ von: ________

### 5. Freigabe der Indexierung

- [ ] Name, Projekt und Domain geklärt (§7.4, §7.5); `VITE_SITE_URL` gesetzt, Sitemap und Canonical-Links zeigen auf die Domain.
- [ ] Erst dann `VITE_SITE_INDEXABLE=true`.

Abgehakt am: ________ von: ________

## Maschinelle Prüfung

`npm run build && npm run golive:check` mit denselben Umgebungsvariablen wie für den Build prüft am fertigen Build: Rechtsseiten ohne Platzhalter, Seiten indexierbar, kein „DSGVO-konform“, Partnerseite nicht verlinkt und `noindex`, Sitemap mit Domain, Backend-Adresse für das Formular. Exit-Code 1, solange eine Bedingung fehlt. Der Rest dieser Liste ist Handarbeit.

## Qualität (Phase 7)

Stand 31.10.2026, Bericht in `docs/QUALITAET.md`.

Lokal am 31.10.2026 erfüllt (Details im Bericht); vor dem Go-live auf dem echten Hosting wiederholen und hier abhaken.

- [ ] Lighthouse auf allen Seiten in allen vier Kategorien mindestens 90, mobil und Desktop. Ausnahme: SEO auf den `noindex`-Seiten (Partnerseite, 404).
- [ ] Keine Seite mit seitlichem Scrollen ab 360 px Breite.
- [ ] Tastaturbedienung: Sprunglink, sichtbarer Fokus, Rechner, Arbeitsplatz-Check und Formular vollständig per Tastatur.
- [ ] Kontrasttest (`src/styles/tokens.test.ts`, Werte aus `src/styles/contrastReport.ts`) grün.
- [ ] Reichweitenmessung: aus, oder ein cookieloser, in der EU betriebener Dienst über `VITE_ANALYTICS_SRC` und `VITE_ANALYTICS_DOMAIN`, in der Datenschutzerklärung genannt.
