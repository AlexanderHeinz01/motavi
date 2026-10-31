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
- Optional E-Mail-Benachrichtigung über einen SMTP-Server an eine interne Adresse. Anbieter: **offen**.
- Schutz vor Missbrauch: verstecktes Feld (Honeypot) und Begrenzung auf 5 Anfragen je IP-Adresse in 10 Minuten. Die IP-Adresse wird dafür nur im Arbeitsspeicher gehalten, nicht gespeichert.

## Analyse-App unter `/app` (Repo `motavi`)

- Derzeit läuft die Analyse vollständig im Browser (`src/content/datenweg.ts`, `DATENWEG = 'browser'`); das Video verlässt den Rechner nicht.
- Das Erkennungsmodell und die WebAssembly-Laufzeit liegen auf der eigenen Domain (selbst gehostet, Entscheidung vom 31.10.2026); beim Laden wird kein Dritter kontaktiert.
- Ergebnisse werden im `localStorage` des Browsers zwischengespeichert; die Anmeldung speichert ein Token im `localStorage`.

## Analysedienst (Repo `motavi-backend`)

- Google Cloud Run und Cloud Storage, Region `europe-west3` (Frankfurt).
- Originalvideo: unmittelbar nach der Auswertung gelöscht, auch bei Fehlschlag; Lifecycle-Regel 1 Tag als Sicherung (`docs/LOESCHKONZEPT.md`).
- Video mit unkenntlich gemachtem Kopfbereich, Einzelbilder und Gelenkpunkte (`pose.npz`): 30 Tage.
- Kennzahlen, Steckbrief, Expertenbewertung, Kundenangaben (JSON): 365 Tage.
- Benutzerkonten (Firestore `users`): E-Mail, Name, Unternehmen, Rolle, Passwort-Hash.
- Gelenkpunkte sind Koordinaten, keine Bilder. Erfasst werden keine Namen oder Personalnummern der aufgenommenen Beschäftigten.

## Impressum

Angaben zu Anbieter, Rechtsform, Anschrift, Vertretung, Registereintrag und Umsatzsteuer-Identifikationsnummer liegen der Software nicht vor (**offen**). Kontakt-E-Mail der Website: `src/content/site.ts` (`contactEmail`).
