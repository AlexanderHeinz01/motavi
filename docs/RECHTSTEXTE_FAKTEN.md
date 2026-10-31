# Fakten für Impressum und Datenschutzerklärung

Stand: 31.10.2026. Technische Angaben für die Person, die Impressum und Datenschutzerklärung verfasst (Anwalt oder Generator, WEBSITE_PLAN §7.6). Keine Rechtstexte, nur was die Software tut. Offene Punkte sind markiert.

## Website (Repo `motavi`)

- Statisch vorgerendert. Hosting: **offen** (Phase 0: Bereitstellung über Google AI Studio; Domain und Hosting nach WEBSITE_PLAN §7.5).
- Keine Cookies. Die Website selbst setzt keine Cookies und lädt keine Inhalte von Dritten.
- Schriften (Inter, Space Grotesk, JetBrains Mono) sind selbst gehostet (`@fontsource`), keine Anfrage an Google Fonts.
- Reichweitenmessung: **keine** zum Start (Entscheidung vom 31.10.2026). Technisch vorbereitet und aus; aktiv würde sie nur, wenn `VITE_ANALYTICS_SRC` beim Build gesetzt ist.
- Der Arbeitsplatz-Check rechnet im Browser; Antworten werden nicht gespeichert oder übertragen.

## Kontaktformular `/pilot`

- Felder: Zielgruppe (Hersteller oder Robotik-Anbieter/Integrator), Name, Unternehmen, Funktion (optional), E-Mail, Telefon (optional), Anzahl Arbeitsplätze (optional), Interesse (optional), Nachricht (optional).
- Übertragung an `POST /api/v1/contact` des Backends (Repo `motavi-backend`, `docs/KONTAKT.md`).
- Speicherung: Google Cloud Firestore, Collection `kontaktanfragen`. Region der Firestore-Datenbank: **offen, bitte prüfen**.
- Löschung nach 365 Tagen über eine Firestore-TTL-Regel (muss einmalig angelegt werden, siehe `docs/KONTAKT.md` im Backend).
- E-Mail-Benachrichtigung an eine interne Adresse, nur mit Hinweis auf die neue Anfrage, ohne deren Inhalt (Entscheidung vom 31.10.2026). SMTP-Anbieter: **offen**.
- Schutz vor Missbrauch: verstecktes Feld (Honeypot) und Begrenzung auf 5 Anfragen je IP-Adresse in 10 Minuten. Die IP-Adresse wird dafür nur im Arbeitsspeicher gehalten, nicht gespeichert.

## Browser-Analyse (Repo `motavi`)

- Seit dem 31.10.2026 nicht auf der Website (keine Selbstbedienung für Kunden, Entscheidung G2). Muss in der Datenschutzerklärung nicht erscheinen, solange sie nicht veröffentlicht ist.

## Analysedienst (Repo `motavi-backend`)

- Google Cloud Run und Cloud Storage, Region `europe-west3` (Frankfurt).
- Originalvideo: unmittelbar nach der Auswertung gelöscht, auch bei Fehlschlag; Lifecycle-Regel 1 Tag als Sicherung (`docs/LOESCHKONZEPT.md`).
- Kein Video wird aufbewahrt. Drei Standbilder der belastendsten Momente, Köpfe und Gesichter aller erkannten Personen geschwärzt, und Gelenkpunkte (`pose.npz`): 30 Tage.
- Video-Check: Der Kunde lädt über einen persönlichen, befristeten Upload-Link hoch (ohne Konto); das Video geht direkt in den Speicher in Frankfurt.
- Je Job `job.json` mit der E-Mail des anlegenden Teammitglieds, Angaben zum Arbeitsplatz und Status; Bestätigungen enthalten die E-Mail des Beraters: 365 Tage.
- Gelöschte Objekte: Soft Delete des Speichers wird abgeschaltet (`motavi-backend/docs/LOESCHKONZEPT.md`); Firestore-Sicherungen prüfen.
- Kennzahlen, bestätigter Steckbrief, Expertenbewertung, Kundenangaben (JSON): 365 Tage ab der letzten Änderung.
- Benutzerkonten (Firestore `users`): nur das Motavi-Team; E-Mail, Name, Unternehmen, Rolle, Passwort-Hash.
- Gelenkpunkte sind Koordinaten, keine Bilder. Erfasst werden keine Namen oder Personalnummern der aufgenommenen Beschäftigten.

## Impressum

Angaben zu Anbieter, Rechtsform, Anschrift, Vertretung, Registereintrag und Umsatzsteuer-Identifikationsnummer liegen der Software nicht vor (**offen**, harte Go-live-Bedingung 0: Motavi oder eine andere Gesellschaft). Kontakt-E-Mail der Website: `src/content/site.ts` (`contactEmail`).
