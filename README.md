# Motavi — KI-gestützte Ergonomie-Analyse

Motavi analysiert Bewegungsabläufe von Arbeitskräften in Fertigung, Montage und Logistik kamerabasiert, datenschutzkonform und normgerecht nach REBA (Rapid Entire Body Assessment) und DIN EN ISO 10075 / ArbSchG §5.

## Features

- **Marketing Landing Page**: Interaktive Produktpräsentation mit interaktiver Calendly-Demo-Buchung, Leistungsmetriken, Use Cases und Branchen-Zitaten.
- **Benutzeranmeldung**: Schneller Login mit vorbelegten Testkonten (`demo@motavi.de`) sowie flexibler Benutzerverwaltung.
- **Video-Upload & Parameter**: Auswahl von Arbeitsplatzvideos (MP4/H.264, WebM, MOV) mit Analyseparametern (Unternehmen, Abteilung, Schichtdauer, Körpergröße).
- **Echte Videoanalyse im Browser**: Körperpunkterkennung mit MediaPipe Pose Landmarker direkt im Browser – das Video verlässt den Rechner nicht. Siehe [Analyse](#analyse).
- **Sofort-Demo**: Voranalysierte reale Arbeitsplatzszenarien (z. B. Logistik-Kommissionierung) zum unmittelbaren Testen ohne Videodatei.
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

## Analyse

Die Analyse läuft vollständig im Browser (`src/services/poseAnalyzer.ts`, `src/services/reba.ts`) und überträgt die Pipeline aus `motavi-backend/backend/app/services/analyzer.py`:

1. Das Video wird lokal dekodiert und mit bis zu 5 Bildern pro Sekunde abgetastet (höchstens 1.500 Bilder pro Video).
2. Pro Bild erkennt der MediaPipe Pose Landmarker (Modell `pose_landmarker_full`) 33 Körperpunkte.
3. Daraus werden Rumpf-, Nacken-, Oberarm-, Unterarm- und Kniewinkel bestimmt, REBA-Teilwerte je Körperregion berechnet und die Bewegung als Bücken, Überkopf oder neutral klassifiziert.
4. Aus allen Bildern mit erkannter Person entstehen Gesamt-Score, Bewegungsanteile, Zeitverlauf und Handlungsfelder. Die drei Momente mit dem höchsten Score (mindestens 3 s auseinander) werden als Standbild mit grau maskiertem Kopfbereich gespeichert.

Schwellenwerte, Gewichtung und die 1–10-Skala entsprechen dem Backend. Drei Winkel sind gegenüber dem Backend korrigiert, damit sie der REBA-Definition entsprechen:

- **Oberarm**: Winkel zwischen Oberarm und Rumpf (im Backend gegen die Schulterlinie – ein hängender Arm ergab dort 90° und damit die Höchststufe).
- **Nacken**: Rumpfachse gegen die Achse Schulter→Ohrmitte (im Backend Nase gegen die Senkrechte – ein seitlich gedrehter Kopf galt als starke Beugung).
- **Unterarm**: Ellbogenbeugung (180° − Innenwinkel), 60–100° gilt als neutral.

Beim ersten Start einer Analyse lädt der Browser das Modell (ca. 9 MB) von `storage.googleapis.com` sowie die WebAssembly-Laufzeit (ca. 13 MB) der App; beides wird danach gecacht. Auf Rechnern ohne Hardware-Grafikbeschleunigung rechnet MediaPipe automatisch auf der CPU. Die Seite muss während der Analyse geöffnet bleiben.