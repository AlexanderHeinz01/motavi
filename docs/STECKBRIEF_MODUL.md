# Motavi Analysemodul "Arbeitsplatz-Steckbrief": Plan für Claude Code

Stand: 29.10.2026 (Version 2: eine Messung, drei Empfehlungen)
Ablage im Repo: `docs/STECKBRIEF_MODUL.md`
Zugehörig: `docs/WEBSITE_PLAN.md`, `docs/DESIGN_BRIEF.md`

---

## 1. Ziel

Neben dem Ergonomie-Report liefert Motavi pro Arbeitsplatz einen **Arbeitsplatz-Steckbrief** mit einer klaren Empfehlung:

- **Verbessern:** Verschwendung und Belastung lassen sich durch Gestaltung lösen.
- **Erst verbessern, dann automatisieren:** Automatisierung lohnt sich, aber erst nach Bereinigung des Ablaufs.
- **Automatisieren:** Ablauf ist bereits schlank, repetitiv und gleichförmig.
- **Beibehalten:** Weder Verbesserung noch Automatisierung bringen nennenswerten Nutzen.

Der Steckbrief beantwortet:
1. Wie lang ist ein Zyklus, wie oft wiederholt er sich, wie gleichförmig ist er?
2. Wie viel Zeit steckt in nicht wertschöpfender Bewegung (Gehen, Suchen, Warten, Umgreifen, ungünstige Greifwege)?
3. In welchem Greifraum und in welchen Höhen wird gearbeitet?
4. Wie belastend ist die Tätigkeit?
5. Was ist die Empfehlung, und was bringt sie in Minuten und Euro?

**Prinzip:** Das Tool misst, der Experte bewertet. Zyklen, Zeiten, Greifraum und Belastung werden automatisch berechnet. Ablaufschritte, Empfehlung und Automatisierungstyp schlägt das Tool vor, ein Experte bestätigt oder korrigiert sie.

**Kein LLM, kein Modelltraining** in dieser Version.

---

## 2. Leitplanken

1. Bestehende Ergonomie-Pipeline nicht verändern. Das Modul wertet dieselben Pose-Daten zusätzlich aus.
2. Keine Personenbezüge: nur Arbeitsplatz-ID, keine Mitarbeiter-ID, keine Vergleiche zwischen Personen.
3. Jede automatisch berechnete Kennzahl trägt eine Qualitätsangabe. Unter definierten Schwellen erscheint "nicht belastbar messbar" statt eines Werts.
4. 2D-Einschränkung offen ausweisen: Greifraum und Entfernungen als relative Werte bezogen auf Körpermaße.
5. Alle vier Empfehlungen sind gleichwertige Ergebnisse. Kein Default zugunsten Automatisierung.
6. Keine Herstellerempfehlungen, nur Automatisierungstypen.
7. Jede Rechenfunktion mit Unit-Tests, inklusive synthetischer Testsignale.

---

## 3. Datengrundlage

### 3.1 Pose-Daten speichern

Falls Phase S0 zeigt, dass die Pipeline Pose-Daten nicht dauerhaft speichert: nach der Pose-Erkennung pro Frame unter `results/{job_id}/pose.npz` speichern.

- `t`: Zeitstempel je Frame in Sekunden
- `landmarks`: Array (Frames × 33 × 4) mit x, y, z, visibility
- `fps`, `width`, `height`

Nur Koordinaten, keine Bilddaten.

### 3.2 Normierung

- Ursprung: Hüftmitte. Skalierung: Rumpflänge (Hüftmitte bis Schultermitte).
- Glättung mit Savitzky-Golay oder gleitendem Median, Fenster konfigurierbar.
- Lücken bis 0,5 s interpolieren, längere markieren.

---

## 4. Kennzahlen und Methoden

### 4.1 Zykluserkennung

**Signal:** Merkmalsvektor aus normierten Handgelenkpositionen, Rumpfneigung und Rumpfdrehung.

**Verfahren:**
1. Dominante Periode über Autokorrelation (Suchbereich konfigurierbar, Standard 3 bis 180 s).
2. Zyklusgrenzen über wiederkehrende Muster, z.B. Matrix Profile (`stumpy`, BSD-Lizenz) oder Peak-Erkennung.
3. Ausreißer markieren (Unterbrechungen, Nebentätigkeiten).

**Ausgabe:** Anzahl Zyklen, hochgerechnet auf die Schicht. Zykluszeit als Median, Mittelwert, Standardabweichung, Variationskoeffizient. Zeitanteil in Zyklen. Konfidenz. Liste der Zyklen.

**Fallback:** "Kein wiederkehrender Zyklus erkannt". Das ist ein Ergebnis und fließt in die Empfehlung ein.

### 4.2 Greifraum und Arbeitshöhen

- Handgelenkpositionen relativ zur Hüfte, normiert auf Rumpflänge.
- Höhenzonen mit Zeitanteilen: unter Knie, Knie bis Hüfte, Hüfte bis Schulter, über Schulter.
- Anteil der Griffe außerhalb des günstigen Greifraums (Hüfte bis Schulter, körpernah). Schwellen konfigurierbar.
- Darstellung als Dichtekarte über Körpersilhouette.
- Hinweis: "Relative Werte aus 2D-Video. Für Zentimeterangaben ist eine Referenzmessung vor Ort nötig."

### 4.3 Ablaufschritte (halbautomatisch)

1. Geschwindigkeit der Handgelenke und Bewegung der Hüfte (für Gehen) berechnen.
2. Im Median-Zyklus Phasen trennen: Bewegung, Ruhe, Ortswechsel, Richtungswechsel.
3. Segmentvorschläge mit Start, Ende, Dauer.
4. Experte ordnet jedem Segment einen Typ zu und markiert ihn als wertschöpfend oder nicht:

| Typ | Standardeinstufung |
|---|---|
| Fügen, Bearbeiten | wertschöpfend |
| Greifen, Bringen, Platzieren | notwendig, nicht wertschöpfend |
| Prüfen | notwendig, nicht wertschöpfend |
| Gehen, Suchen, Warten, Umgreifen | Verschwendung |

5. Zuordnung wird auf alle Zyklen übertragen.

**Ausgabe:** Ablaufschritte mit Zeitanteilen, Anteil Wertschöpfung, notwendige Nebentätigkeit und Verschwendung je Zyklus und Schicht.

### 4.4 Belastung

Aus der bestehenden Pipeline: REBA-Mittelwert und Maximum, Anteile Bücken, Überkopf, Drehung. Zusätzlich Drehungen pro Zyklus.

### 4.5 Kundenangaben

- Teilegewicht, grobe Abmessungen
- Anzahl Varianten
- Stück pro Schicht (Plausibilitätsprüfung gegen gemessene Zyklen)
- Schichtmodell, Arbeitstage, Vollkosten pro Stunde
- Schwierigkeit der Stellenbesetzung (1 bis 5)
- Grobe Investitionsbandbreite für Automatisierung (optional, sonst Standardwerte je Typ)

---

## 5. Bewertung und Empfehlung

Alle Gewichte, Schwellen und Regeln in `config/workplace_scoring.json`. Dieselbe Datei nutzt der Arbeitsplatz-Check der Website.

### 5.1 Verbesserungs-Score (0 bis 100)

| Kriterium | Quelle | Gewicht |
|---|---|---|
| Zeitanteil Verschwendung (Gehen, Suchen, Warten, Umgreifen) | gemessen und bestätigt | 35 % |
| Griffe außerhalb des günstigen Greifraums | gemessen | 20 % |
| Belastung (REBA, Bücken, Überkopf, Drehung) | gemessen | 30 % |
| Zyklusschwankung (Hinweis auf ungeordneten Ablauf) | gemessen | 15 % |

**Verbesserungspotenzial in Minuten:** Summe der Verschwendungszeiten je Schicht × vermeidbarer Anteil je Typ (konfigurierbar, z.B. Suchen 80 %, Gehen 50 %, Warten 50 %, Umgreifen 70 %).

### 5.2 Automatisierungs-Score (0 bis 100)

| Kriterium | Quelle | Gewicht |
|---|---|---|
| Wiederholungen pro Schicht | gemessen | 20 % |
| Gleichförmigkeit (inverser Variationskoeffizient) | gemessen | 20 % |
| Variantenvielfalt (invers) | Kunde | 15 % |
| Teilegewicht und Handhabbarkeit | Kunde | 10 % |
| Belastung | gemessen | 15 % |
| Zeitanteil in Zyklen | gemessen | 10 % |
| Schwierigkeit der Stellenbesetzung | Kunde | 10 % |

### 5.3 Entscheidungsregel (Vorschlag, durch Experten bestätigt)

| Verbesserungs-Score | Automatisierungs-Score | Empfehlung |
|---|---|---|
| ab 50 | ab 60 | Erst verbessern, dann automatisieren |
| ab 50 | unter 60 | Verbessern |
| unter 50 | ab 60 | Automatisieren |
| unter 50 | unter 60 | Beibehalten |

Zusatzregel: Bei hoher Belastung (Schwelle konfigurierbar, z.B. REBA-Mittel ab 8) wird der Arbeitsplatz unabhängig von der Empfehlung als **vorrangig** markiert.

### 5.4 Automatisierungstyp (nur bei Empfehlung mit Automatisierung)

Regelbasiert aus Ablaufschritten und Kundenangaben:
- Überwiegend Greifen und Platzieren, gleichförmige Positionen: Pick and Place
- Stapeln, Gewicht über Schwelle, Höhenzonen Knie bis Schulter: Palettieren
- Wechsel zwischen Maschine und Ablage, Warten im Zyklus: Maschinenbeladung
- Hoher Prüfanteil: Prüfautomatisierung oder Assistenzsystem

### 5.5 Wirtschaftlichkeit (grob)

```
# Verbessern
min_verbesserung = verschwendung_min_schicht * vermeidbarer_anteil
euro_verbesserung_jahr = min_verbesserung * schichten * tage / 60 * stundensatz

# Automatisieren
stunden_auto_jahr = zykluszeit_s * zyklen_schicht * schichten * tage / 3600 * automatisierbarer_anteil
euro_auto_jahr    = stunden_auto_jahr * stundensatz
amortisation      = investition_bandbreite / euro_auto_jahr      # in Jahren, als Bandbreite
```

Bei "Erst verbessern, dann automatisieren" wird die Automatisierung auf Basis des **verbesserten** Ablaufs gerechnet (Zykluszeit minus vermeidbare Verschwendung). Pflichthinweis: "Grobe Abschätzung, ersetzt kein Angebot."

---

## 6. Ausgabe

1. **Dashboard-Tab "Steckbrief"** neben dem Ergonomie-Dashboard, gleiches Designsystem (dunkel). Kopf mit Empfehlung als großes Label, darunter beide Scores, Kennzahlen, Ablaufschritte, Greifraum, Wirtschaftlichkeit.
2. **PDF-Steckbrief**, 2 Seiten, ergänzt den 4-seitigen Report.
3. **JSON-Export** im dokumentierten, herstellerneutralen Format (`docs/steckbrief_schema.json`).
4. **Expertenansicht** zum Bestätigen von Ablaufschritten, Einstufung, Empfehlung und Typ, nur für angemeldete Berater.

### API

| Methode | Route | Zweck |
|---|---|---|
| GET | `/api/v1/workplace/{job_id}` | Steckbrief abrufen |
| PUT | `/api/v1/workplace/{job_id}/inputs` | Kundenangaben speichern |
| PUT | `/api/v1/workplace/{job_id}/review` | Expertenbestätigung speichern |
| GET | `/api/v1/workplace/{job_id}/pdf` | PDF-Steckbrief |
| GET | `/api/v1/workplace/{job_id}/export` | JSON-Export |

Ergebnisse unter `results/{job_id}/workplace.json`.

---

## 7. Demo-Daten für die Website

Datei `frontend/src/content/demo_steckbrief.json`, erfundene plausible Werte, klar als Beispiel gekennzeichnet. Zusätzlich drei kürzere Varianten für die anderen Empfehlungen (`demo_verbessern.json`, `demo_automatisieren.json`, `demo_beibehalten.json`), damit die Website alle Wege zeigen kann.

```json
{
  "arbeitsplatz": "Beispiel: Montagearbeitsplatz Baugruppe A",
  "empfehlung": "Erst verbessern, dann automatisieren",
  "vorrangig": false,
  "verbesserungs_score": 62,
  "automatisierungs_score": 71,
  "zykluszeit_median_s": 38.4,
  "zykluszeit_vk": 0.14,
  "zyklen_pro_schicht": 690,
  "zeitanteil_in_zyklen": 0.82,
  "anteile_ablauf": {"wertschoepfend": 0.34, "notwendig": 0.44, "verschwendung": 0.22},
  "ablaufschritte": [
    {"typ": "Greifen", "anteil": 0.18, "klasse": "notwendig"},
    {"typ": "Suchen", "anteil": 0.09, "klasse": "verschwendung"},
    {"typ": "Bringen", "anteil": 0.14, "klasse": "notwendig"},
    {"typ": "Fügen", "anteil": 0.34, "klasse": "wertschoepfend"},
    {"typ": "Gehen", "anteil": 0.13, "klasse": "verschwendung"},
    {"typ": "Platzieren", "anteil": 0.12, "klasse": "notwendig"}
  ],
  "hoehenzonen": {"unter_knie": 0.08, "knie_huefte": 0.29, "huefte_schulter": 0.56, "ueber_schulter": 0.07},
  "griffe_ausserhalb_greifraum": 0.21,
  "reba_mittel": 5.8,
  "drehungen_pro_zyklus": 3,
  "verbesserung_min_schicht": 41,
  "typ_vorschlag": "Pick and Place mit Fügeoperation",
  "stunden_auto_jahr_bandbreite": [980, 1380]
}
```

---

## 8. Validierung

1. Auf Videos mit geklärten Nutzungsrechten Zyklen und Ablaufschritte manuell erfassen.
2. Vergleich: Abweichung Median-Zykluszeit, Anzahl Zyklen, Anteil falsch erkannter Zyklen, Abweichung Zeitanteil Verschwendung.
3. Zielwert Pilotphase: Median-Zykluszeit innerhalb ±10 % der manuellen Messung.
4. Ergebnis in `docs/validierung_steckbrief.md`. Erst danach entfällt das Label "Pilotphase" für die jeweilige Kennzahl.

Zusätzlich: Die Empfehlungslogik an drei bis fünf Arbeitsplätzen gegen deine eigene Expertenbewertung prüfen und Schwellen in der Konfiguration nachjustieren.

---

## 9. Phasen mit Prompts

### S0: Bestandsaufnahme Pipeline

```
Lies docs/STECKBRIEF_MODUL.md. Prüfe in backend/app/services/analyzer.py,
ob Pose-Daten pro Frame gespeichert werden, in welchem Format und mit
welcher Bildrate, und wo die Bewegungsklassifikation sitzt. Ändere
nichts. Schlag vor, wie das Modul als Paket
backend/app/services/workplace/ angebunden wird, ohne die bestehende
Pipeline zu verändern.
```

**Abnahme:** Bericht und Paketstruktur freigegeben.

### S1: Pose-Daten speichern und normieren

```
Setze Abschnitt 3 um: pose.npz speichern, Normierung und Glättung in
backend/app/services/workplace/preprocess.py. Unit-Tests mit
synthetischen Daten. Prüfe an einem Testvideo, dass result.json vor und
nach der Änderung identisch ist.
```

**Abnahme:** Tests grün, result.json unverändert.

### S2: Zykluserkennung und Greifraum

```
Setze Abschnitt 4.1 und 4.2 um in cycles.py und reach.py. Tests mit
synthetischen Signalen (bekannte Periode mit Rauschen, Unterbrechungen,
aperiodisch). Qualitätsangaben und Fallback nach Leitplanke 3. Skript,
das für ein Video die erkannten Zyklen als PNG-Diagramm ausgibt.
```

**Abnahme:** Synthetische Perioden auf ±5 % getroffen, Diagramm an echtem Video plausibel.

### S3: Ablaufschritte und Expertenansicht

```
Setze Abschnitt 4.3 um: Segmentvorschlag im Median-Zyklus inklusive
Erkennung von Ortswechsel (Gehen), Endpunkt PUT /review, Expertenansicht
mit Zeitleiste, Segmenttypen und Einstufung wertschöpfend, notwendig,
Verschwendung. Übertragung auf alle Zyklen. Nur für angemeldete Berater.
```

**Abnahme:** An einem Video Segmente bestätigt, Anteile plausibel.

### S4: Scores, Empfehlung, Wirtschaftlichkeit

```
Setze Abschnitt 4.5 und 5 um. config/workplace_scoring.json als einzige
Quelle für Gewichte, Schwellen, vermeidbare Anteile und Regeln. Tests für
beide Scores, alle vier Empfehlungen, Vorrang-Markierung, Typregeln und
Wirtschaftlichkeit inklusive der Rechnung auf Basis des verbesserten
Ablaufs.
```

**Abnahme:** Vier Testprofile ergeben die vier Empfehlungen.

### S5: Dashboard, PDF, Export

```
Setze Abschnitt 6 um: Dashboard-Tab "Steckbrief", 2-seitiger PDF-
Steckbrief, JSON-Export mit Schema in docs/steckbrief_schema.json.
Demo-Daten aus Abschnitt 7 inklusive der drei Varianten anlegen.
Screenshots von Dashboard-Tab und PDF für alle vier Empfehlungen.
```

**Abnahme:** Steckbrief ohne Erklärung verständlich, Export gegen Schema gültig.

### S6: Validierung

```
Skript, das manuelle Zyklus- und Segment-Zeitstempel (CSV: video,
start_s, ende_s, typ) mit den erkannten vergleicht und die Kennzahlen aus
Abschnitt 8 ausgibt. Ergebnisse in docs/validierung_steckbrief.md.
```

**Abnahme:** Validierungsbericht liegt vor. Danach entscheiden, welche Kennzahlen das Label "Pilotphase" verlieren.

---

## 10. Bewusst nicht in dieser Version

- Objekterkennung (Teile, Behälter, Maschinen)
- Handgelenk- und Fingerdetails
- 3D-Rekonstruktion und Zentimeterwerte
- Automatische Klassifikation der Ablaufschritte durch ein trainiertes Modell
- LLM-generierte Texte

Kommen in Frage, wenn Pilotkunden und Gespräche mit Robotik-Anbietern zeigen, was wirklich fehlt.
