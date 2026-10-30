# Qualitätsbericht Phase 7

Stand: 31.10.2026. Gemessen lokal am Produktions-Build (`vite preview`), nicht auf dem späteren Hosting. Vor dem Go-live auf dem echten Hosting wiederholen (`docs/GO_LIVE_CHECKLISTE.md`, Abschnitt Qualität).

## Lighthouse

Lighthouse 12.6, Chromium headless, mobil (Standard mit simulierter Drosselung) und Desktop (`--preset=desktop`). Gemessen wurde ein Build mit `VITE_SITE_INDEXABLE=true`, damit die SEO-Kategorie nicht allein am `noindex` scheitert. Der normale Build bleibt `noindex`.

| Seite | Mobil P / A / BP / SEO | Desktop P / A / BP / SEO |
|---|---|---|
| `/` | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/arbeitsplatz-steckbrief` | 98 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/kapazitaet` | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/automatisierung` | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/gesundheit` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/so-funktionierts` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/pakete` | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/betriebsrat` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/pilot` | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/impressum` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/datenschutz` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/fuer-robotik-anbieter` | 99 / 100 / 100 / 66 | 100 / 100 / 100 / 66 |
| 404 (`/gibt-es-nicht`) | 93 / 100 / 100 / 66 | 100 / 100 / 100 / 66 |

P Performance, A Barrierefreiheit, BP Best Practices.

- **SEO 66 auf Partnerseite und 404 ist gewollt:** Beide Seiten sind auch im indexierbaren Build `noindex` (Partnerseite bis §7.1, die 404-Seite immer). Lighthouse wertet das als „Seite nicht crawlbar“. Alle anderen SEO-Prüfungen bestehen.
- **Startseite mobil:** Im Serienlauf über alle Seiten kam einmal 77 heraus (Blockierzeit 600 ms). Drei Einzelmessungen danach: 94, 91, 92 (Blockierzeit 150 bis 210 ms). Der Wert hängt bei simulierter Drosselung stark von der Last der Maschine ab; in der Tabelle steht der Median der Einzelmessungen. Größter Posten ist das Haupt-JavaScript (React, Router, Inhalte aller Seiten). Falls die Messung auf dem Hosting unter 90 fällt: Seiten außer der Startseite per Route nachladen und vor dem Hydrieren vorladen.
- **Behoben in Phase 7:** `/arbeitsplatz-steckbrief` (Definitionslisten im Aufbau falsch verschachtelt, vorher 94) und `/pakete` (Überschriftenfolge h1 auf h3, jetzt mit einer nur für Screenreader sichtbaren h2 „Die drei Pakete“, vorher 98). Beide jetzt 100.

## Mobil ab 360 px

Playwright, 360 × 740 px, alle 13 Seiten: Keine Seite ist breiter als das Fenster (`scrollWidth` = 360). Tabellen scrollen innerhalb ihres Containers.

## Tastatur

Geprüft auf `/`, `/kapazitaet`, `/arbeitsplatz-steckbrief`, `/pilot`:

- Erster Tabstopp ist der Sprunglink „Zum Inhalt springen“.
- Jeder Tabstopp hat einen sichtbaren Fokusrahmen (134 Tabstopps, keiner ohne).
- Rechner: Regler per Pfeiltaste bedienbar, Ergebnis ändert sich mit.
- Arbeitsplatz-Check: alle acht Fragen per Leertaste und Enter beantwortbar, der Fokus springt nach „Weiter“ auf die nächste Frage und nach „Auswerten“ auf das Ergebnis.
- Formular: Leeres Absenden setzt den Fokus auf das erste fehlerhafte Feld (Zielgruppe).

## Kontraste und Alt-Texte

- Kontrasttest `src/styles/tokens.test.ts` grün (Text mindestens 4,5 : 1, Linien und Grafiken mindestens 3 : 1).
- Keine `<img>` ohne `alt`. Das Skelett-Visual hat `role="img"` mit Beschreibung, Symbole sind `aria-hidden`. Lighthouse meldet keine fehlenden Alternativtexte.

## Reichweitenmessung

`src/lib/analytics.ts`: standardmäßig aus. Nur wenn beim Build `VITE_ANALYTICS_SRC` (https) und `VITE_ANALYTICS_DOMAIN` gesetzt sind, wird genau ein Skript mit `defer` und `data-domain` eingebunden, ohne Cookies auf unserer Seite. Gedacht für einen cookielosen, in der EU betriebenen Dienst; welcher, ist offen (`docs/ENTSCHEIDUNGEN_NACHT.md`).

## Weitere Prüfungen

- `npx vitest run`: 506 Tests grün. `tsc --noEmit` ohne Fehler.
- Normaler Build: alle 18 vorgerenderten Seiten und `404.html` tragen `noindex`.
- `npm run golive:check` am normalen Build: drei Bedingungen offen (Rechtstexte, Indexierung, `VITE_API_BASE_URL`), wie erwartet.
