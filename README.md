# Motavi — KI-gestützte Ergonomie-Analyse

Motavi analysiert Bewegungsabläufe von Arbeitskräften in Fertigung, Montage und Logistik kamerabasiert, datenschutzkonform und normgerecht nach REBA (Rapid Entire Body Assessment) und DIN EN ISO 10075 / ArbSchG §5.

## Features

- **Marketing Landing Page**: Interaktive Produktpräsentation mit interaktiver Calendly-Demo-Buchung, Leistungsmetriken, Use Cases und Branchen-Zitaten.
- **Benutzeranmeldung**: Schneller Login mit vorbelegten Testkonten (`demo@motavi.de`) sowie flexibler Benutzerverwaltung.
- **Video-Upload & Parameter**: Upload von Arbeitsplatzvideos (MP4, WebM, MOV, AVI) mit flexiblen Analyseparametern (Unternehmen, Abteilung, Schichtdauer, Körpergröße).
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