# Motavi: Hinweise für Claude Code

Website (hell, vorgerendert) und Analyse-App (dunkel, `/app`) in einer Vite-App. Bereitstellung über Google AI Studio, das per GitHub-Sync aus diesem Repo zieht. Pläne: `docs/WEBSITE_PLAN.md`, `docs/DESIGN_BRIEF.md`, `docs/STECKBRIEF_MODUL.md`.

## Befehle

- `npm run dev`: Entwicklungsserver auf Port 3000
- `npm run lint`: TypeScript-Prüfung
- `npm run build`: Typprüfung, Client-Build, Server-Build und Vorab-Rendern der Website (`scripts/prerender.mjs`) nach `dist/`
- `npm run preview`: gebauten Stand ansehen

## Struktur

- `src/content/`: alle Website-Texte, eine Datei je Seite, `site.ts` für Navigation und Footer
- `src/website/`: `routes.tsx` (einzige Quelle für Routen, Vorab-Rendern und Sitemap), `layout/`, `pages/` (eine Datei je Route), `seo.ts`
- `src/ui/`: Komponentenbibliothek nach `docs/DESIGN_BRIEF.md` §4
- `src/styles/`: `tokens.css` (Design-Tokens) und `fonts.ts` (selbst gehostete Schriften)
- `src/analysis/`: Analysekern ohne React (MediaPipe im Browser, REBA, Ergebnis, Job-Speicher, PDF). Das Steckbrief-Modul kommt nach `src/analysis/workplace/`.
- `src/app/`: Analyse-App (Login, Upload, Analyse, Dashboard)
- `src/marketing/`: alte Startseite unter `/_alt-startseite`, nur noch zum Vergleich. Wird gelöscht, sobald die neue Startseite steht.

## Entscheidungen (Phase 0)

- **Designsystem:** Tokens aus `docs/DESIGN_BRIEF.md` §3, umgesetzt in `src/styles/tokens.css` und `tailwind.config.js`. Schriften Space Grotesk, Inter, JetBrains Mono, selbst gehostet über `@fontsource`. Keine Google Fonts zur Laufzeit.
- **Analyse im Browser:** Das Video verlässt den Rechner nicht. Auch das Steckbrief-Modul läuft im Browser; Pose-Daten werden dafür lokal (IndexedDB) gespeichert, nur Koordinaten, keine Bilder.
- **noindex:** Die gesamte Website ist bis zur Freigabe `noindex`. Freigabe beim Build mit `VITE_SITE_INDEXABLE=true`. Die App ist immer `noindex`.
- **Partnerseite** `/fuer-robotik-anbieter`: gebaut, aber nicht verlinkt und nicht in der Sitemap (`WEBSITE_PLAN.md` §7.1).

## Leitplanken (gelten für jede Phase, aus `docs/WEBSITE_PLAN.md` §2)

1. **Sprache:** Deutsch, Sie-Form. Keine Gedankenstriche oder Halbgeviertstriche ("—", "–") in sichtbaren Texten.
2. **Keine Namen:** Keine Kunden, Robotik-Anbieter oder Partner auf der Website ohne schriftliche Freigabe. Fallbeispiele heißen "Abfülllinie, produzierende Industrie".
3. **Herstellerneutral:** Motavi empfiehlt Wege (verbessern, automatisieren, beibehalten) und Automatisierungstypen, nie Hersteller oder Produkte.
4. **Alle drei Empfehlungen gleichwertig darstellen:** Automatisierung ist eine mögliche Antwort, nicht das Ziel. Keine Seite erweckt den Eindruck, jeder Arbeitsplatz solle automatisiert werden.
5. **Zahlen ehrlich kennzeichnen:** Werte aus 2020 (+22 %, 57 Minuten bei 265 Minuten Bezugszeit) mit dem Hinweis "Ergebnis einer Analyse mit bewährter Methodik, 2020".
6. **Betriebsrat-Konsistenz:**
   - Motavi bewertet Tätigkeiten und Arbeitsplätze, nie Personen.
   - Keine Formulierungen wie "Personal einsparen", "Mitarbeiter ersetzen", "Leistung messen", "schneller arbeiten".
   - Stattdessen: "Abläufe besser gestalten", "belastende und monotone Tätigkeiten automatisieren", "Kapazität gewinnen trotz Fachkräftemangel".
   - Jede Seite zu Kapazität oder Automatisierung verlinkt auf `/betriebsrat`.
7. **Pilotphase kennzeichnen:** Nicht validierte Funktionen des Steckbrief-Moduls tragen das Label "Pilotphase".
8. **Designsystem:** Vorhandene Tokens lesen und `docs/DESIGN_BRIEF.md` folgen.
9. **Kein Tracking mit Cookie-Pflicht:** Analytics nur cookielos und EU-gehostet.

Zusätzlich gilt: Die Website darf nichts versprechen, was das Analysemodul nicht kann (`docs/WEBSITE_PLAN.md`, Einleitung). Neue sichtbare Texte gehören nach `src/content/` und werden vor dem Commit gegen diese Leitplanken geprüft.
