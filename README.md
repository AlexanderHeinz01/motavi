# Motavi Website

Website von Motavi: Arbeitsabläufe messen, Haltungsindex auf REBA-Basis, Arbeitsplatz-Steckbrief mit Empfehlung (Pilotphase). Die Analyse läuft im Backend (Repo `motavi-backend`).

Hinweise für die Arbeit mit Claude Code, Leitplanken und Struktur: [`CLAUDE.md`](CLAUDE.md).

## Inhalt

- **Website** (Relaunch nach `docs/WEBSITE_PLAN.md`): vorgerenderte Seiten mit gemeinsamem Layout, Texte in `src/content/`, bis zur Freigabe `noindex`. Siehe [Website](#website).
- **Browser-Analyse** (`src/app`, `src/analysis`): Analyse eines Videos im Browser mit MediaPipe. Seit dem 31.10.2026 **nicht im Build** (keine Selbstbedienung für Kunden zum Start, Entscheidung G2). Der Code bleibt im Repository. Die Anmeldung dort ist eine Attrappe ohne Prüfung und darf so nicht veröffentlicht werden.

## Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Visualisierungen**: Recharts & performante Vektorgrafiken (SVG)
- **PDF-Generierung**: jsPDF
- **Posenerkennung**: `@mediapipe/tasks-vision` (WebAssembly, im Build enthalten)
- **Schriften**: Space Grotesk, Inter, JetBrains Mono, selbst gehostet über `@fontsource`

## Website

| Route | Seite |
|---|---|
| `/` | Startseite |
| `/arbeitsplatz-steckbrief` | Der Arbeitsplatz-Steckbrief |
| `/kapazitaet`, `/automatisierung`, `/gesundheit` | Perspektiven |
| `/so-funktionierts` | Ablauf |
| `/pakete` | Pakete und Preise |
| `/betriebsrat` | Datenschutz und Betriebsrat |
| `/pilot` | Pilot anfragen |
| `/impressum`, `/datenschutz` | Rechtliches (Platzhalter) |
| `/fuer-robotik-anbieter` | Partnerseite, nicht verlinkt |

Interne Seiten (`/_styleguide`, `/_design/...`) gibt es nur im Entwicklungsserver (`npm run dev`), nicht im Build. Die alte Startseite ist entfernt.

`npm run build` erzeugt neben dem Client-Build für jede Website-Route eine vorgerenderte HTML-Datei mit eigenem Titel, Beschreibung, Canonical und Open-Graph-Angaben sowie `sitemap.xml`, `robots.txt` und `404.html` (`scripts/prerender.mjs`). Umgebungsvariablen beim Build:

- `VITE_SITE_URL`: Basis-URL für Canonical, Sitemap und Open Graph (Standard `https://motavi.ai`)
- `VITE_SITE_INDEXABLE=true`: hebt das `noindex` der Website auf (Standard: alles `noindex`)

## Browser-Analyse (nicht im Build)

Die Analyse läuft vollständig im Browser (`src/analysis/poseAnalyzer.ts`, `src/analysis/reba.ts`) und überträgt die Pipeline aus `motavi-backend/backend/app/services/analyzer.py`:

1. Das Video wird lokal dekodiert und mit bis zu 5 Bildern pro Sekunde abgetastet (höchstens 1.500 Bilder pro Video).
2. Pro Bild erkennt der MediaPipe Pose Landmarker (Modell `pose_landmarker_full`) 33 Körperpunkte.
3. Daraus werden Rumpf-, Nacken-, Oberarm-, Unterarm- und Kniewinkel bestimmt, Teilwerte je Körperregion nach den Winkelbereichen von REBA berechnet und die Bewegung als Bücken, Überkopf oder neutral klassifiziert.
4. Aus allen Bildern mit erkannter Person entstehen Gesamt-Score, Bewegungsanteile, Zeitverlauf und Handlungsfelder. Die drei Momente mit dem höchsten Score (mindestens 3 s auseinander) werden als Standbild mit grau maskiertem Kopfbereich gespeichert.

Schwellenwerte, Gewichtung, Winkel und die Skala 1 bis 10 (Haltungsindex auf REBA-Basis) entsprechen seit dem 31.10.2026 dem Backend (`motavi-backend/docs/HALTUNGSINDEX.md`): Oberarm gegen den Rumpf, Nacken als Rumpfachse gegen Schulter zur Ohrmitte, Unterarm als Ellbogenbeugung mit 60 bis 100 Grad als neutral. Die Stufen der Browser-Variante sind noch die alten.

Beim ersten Start einer Analyse lädt der Browser das Modell (ca. 9 MB, `src/analysis/models/`) und die WebAssembly-Laufzeit (ca. 13 MB), beides von der eigenen Domain; beides wird danach gecacht. Auf Rechnern ohne Hardware-Grafikbeschleunigung rechnet MediaPipe automatisch auf der CPU. Die Seite muss während der Analyse geöffnet bleiben.