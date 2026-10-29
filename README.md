# Motavi — KI-gestützte Ergonomie-Analyse

Motavi analysiert Bewegungsabläufe an Arbeitsplätzen in Fertigung, Montage und Logistik kamerabasiert nach REBA (Rapid Entire Body Assessment), als Grundlage für die Gefährdungsbeurteilung nach ArbSchG §5.

Hinweise für die Arbeit mit Claude Code, Leitplanken und Struktur: [`CLAUDE.md`](CLAUDE.md).

## Features

- **Website** (Relaunch nach `docs/WEBSITE_PLAN.md`, in Arbeit): vorgerenderte Seiten mit gemeinsamem Layout, Texte in `src/content/`, bis zur Freigabe `noindex`. Siehe [Website](#website).
- **Benutzeranmeldung**: Schneller Login mit vorbelegten Testkonten (`demo@motavi.de`) sowie flexibler Benutzerverwaltung.
- **Video-Upload & Parameter**: Auswahl von Arbeitsplatzvideos (MP4/H.264, WebM, MOV) mit Analyseparametern (Unternehmen, Abteilung, Schichtdauer, Körpergröße).
- **Echte Videoanalyse im Browser**: Körperpunkterkennung mit MediaPipe Pose Landmarker direkt im Browser – das Video verlässt den Rechner nicht. Siehe [Analyse](#analyse).
- **Sofort-Demo**: Beispielanalyse mit erfundenen Demodaten (Logistik-Kommissionierung) zum Testen ohne Videodatei.
- **Ergonomie-Dashboard**:
  - **REBA-Score-Tachometer**: 1–10 Skala mit dynamischen Farbzonen (Grün / Gelb / Rot) und Risikostufen-Klassifikation.
  - **Körperregionen-Heatmap**: Anatomische SVG-Heatmap mit per-Region-Subscores (Lendenwirbel, Schulter L/R, Nacken, Unterarm, Knie L/R).
  - **Bewegungsklassifikation**: Aufschlüsselung nach Bücken, Überkopfarbeit und neutraler Schulterhaltung inklusive Schichtzeit-Extrapolation.
  - **Bewegungszeitverlauf**: Farbcodierte Timeline der erkannten Bewegungsmuster über das Beobachtungsfenster.
  - **Priorisierte Handlungsfelder**: Konkrete ergonomische Maßnahmen mit geschätztem Belastungsreduktionspotenzial (-15% bis -50%).
  - **Kritische Bewegungsmomente**: Top-3 Standbilder mit Zeitstempel, REBA-Spitzenwert und DSGVO-konformer Gesichtsmaskierung.
  - **PDF-Export**: Vollständiger normgerechter PDF-Ergebnisbericht zum Download.

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

Analyse-App: `/login`, `/app`, `/app/analyzing/:jobId`, `/app/dashboard/:jobId`. Die alte Startseite liegt bis zum Abschluss des Relaunchs unter `/_alt-startseite`.

`npm run build` erzeugt neben dem Client-Build für jede Website-Route eine vorgerenderte HTML-Datei mit eigenem Titel, Beschreibung, Canonical und Open-Graph-Angaben sowie `sitemap.xml`, `robots.txt` und `404.html` (`scripts/prerender.mjs`). Umgebungsvariablen beim Build:

- `VITE_SITE_URL`: Basis-URL für Canonical, Sitemap und Open Graph (Standard `https://motavi.ai`)
- `VITE_SITE_INDEXABLE=true`: hebt das `noindex` der Website auf (Standard: alles `noindex`)

## Analyse

Die Analyse läuft vollständig im Browser (`src/analysis/poseAnalyzer.ts`, `src/analysis/reba.ts`) und überträgt die Pipeline aus `motavi-backend/backend/app/services/analyzer.py`:

1. Das Video wird lokal dekodiert und mit bis zu 5 Bildern pro Sekunde abgetastet (höchstens 1.500 Bilder pro Video).
2. Pro Bild erkennt der MediaPipe Pose Landmarker (Modell `pose_landmarker_full`) 33 Körperpunkte.
3. Daraus werden Rumpf-, Nacken-, Oberarm-, Unterarm- und Kniewinkel bestimmt, REBA-Teilwerte je Körperregion berechnet und die Bewegung als Bücken, Überkopf oder neutral klassifiziert.
4. Aus allen Bildern mit erkannter Person entstehen Gesamt-Score, Bewegungsanteile, Zeitverlauf und Handlungsfelder. Die drei Momente mit dem höchsten Score (mindestens 3 s auseinander) werden als Standbild mit grau maskiertem Kopfbereich gespeichert.

Schwellenwerte, Gewichtung und die 1–10-Skala entsprechen dem Backend. Drei Winkel sind gegenüber dem Backend korrigiert, damit sie der REBA-Definition entsprechen:

- **Oberarm**: Winkel zwischen Oberarm und Rumpf (im Backend gegen die Schulterlinie – ein hängender Arm ergab dort 90° und damit die Höchststufe).
- **Nacken**: Rumpfachse gegen die Achse Schulter→Ohrmitte (im Backend Nase gegen die Senkrechte – ein seitlich gedrehter Kopf galt als starke Beugung).
- **Unterarm**: Ellbogenbeugung (180° − Innenwinkel), 60–100° gilt als neutral.

Beim ersten Start einer Analyse lädt der Browser das Modell (ca. 9 MB) von `storage.googleapis.com` sowie die WebAssembly-Laufzeit (ca. 13 MB) der App; beides wird danach gecacht. Auf Rechnern ohne Hardware-Grafikbeschleunigung rechnet MediaPipe automatisch auf der CPU. Die Seite muss während der Analyse geöffnet bleiben.