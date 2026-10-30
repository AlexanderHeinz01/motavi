# Go-live-Checkliste

Stand: 30.10.2026. Wird in Phase 7 (`docs/WEBSITE_PLAN.md`, Abschnitt 6) vervollständigt.

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
| `/betriebsrat` (Phase 5) | noch nicht geschrieben; gleiche Bedingung |

Abgehakt am: ________ von: ________

## Weitere Punkte

Aus Entscheidungen, die schon gefallen sind; Phase 7 ergänzt Lighthouse, Barrierefreiheit und Analytics.

- [ ] Kein "DSGVO-konform" auf der Website, bis die Aussage juristisch geprüft ist (Entscheidung vom 30.10.2026).
- [ ] Kein Link zur Partnerseite `/fuer-robotik-anbieter`, bis `docs/WEBSITE_PLAN.md` §7.1 erfüllt ist (mindestens zwei Anbieter bestätigen Interesse).
- [ ] `noindex` erst entfernen, wenn Name und Projekt intern geklärt sind (§7.4).
- [ ] Impressum und Datenschutzerklärung durch Anwalt oder Generator (§7.6).
- [ ] Label "Pilotphase" an allen Kennzahlen, die laut `docs/validierung_steckbrief.md` (Repo `motavi-backend`) noch nicht validiert sind.
