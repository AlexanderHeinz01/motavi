# Motavi Analysemodul "Arbeitsplatz-Steckbrief": Plan für Claude Code

Stand: 30.10.2026 (Version 3: Modul im Python-Backend)
Ablage im Repo: `docs/STECKBRIEF_MODUL.md`
Zugehörig: `docs/WEBSITE_PLAN.md`, `docs/DESIGN_BRIEF.md`

> **Architekturentscheidung (30.10.2026):** Das Steckbrief-Modul läuft im Python-Backend (Repo `motavi-backend`, Paket `backend/app/services/workplace/`). Die Browser-Entscheidung aus Phase 0 (29.10.2026) ist für dieses Modul aufgehoben. Gründe:
>
> 1. Die Zykluserkennung braucht Pose-Daten mit mindestens 10 Hz. Das Backend erkennt die Pose ohnehin auf jedem Frame (für die Anonymisierung), im Browser wäre eine so dichte Erkennung zu langsam.
> 2. Die Expertenbewertung (Abschnitt 4.3, Phase S3) braucht einen Server.
> 3. Scoring-Logik, Gewichte und Schwellen sollen nicht im Client liegen.
>
> | Teil | Ort |
> |---|---|
> | Ergonomie-Pipeline | `backend/app/services/analyzer.py` (bleibt unverändert, Golden-Test sichert `result.json`) |
> | Pose-Daten | `results/{job_id}/pose.npz` im Bucket, Format in `docs/POSE_DATEN.md` (Repo `motavi-backend`) |
> | Modul | `backend/app/services/workplace/*.py` |
> | Ergebnis, API | `results/{job_id}/workplace.json`, Routen nach Abschnitt 6 |
> | Website-Texte | `src/content/` (Repo `motavi`) |
>
> Unit-Tests laufen mit pytest (`backend/tests/`).

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

S0 hat gezeigt, dass die Pipeline die Pose auf jedem Frame erkennt, die Gelenkpunkte aber verwirft (ausgewertet wird nur etwa 1 Hz). Seit S1 hält ein optionaler Rekorder sie fest und schreibt je Job `results/{job_id}/pose.npz`:

- `t`: Zeitstempel je Frame in Sekunden (float32)
- `landmarks`: Array (Frames × 25 × 4) mit x, y, z, visibility als float16; NaN ohne erkannte Person
- `indices`, `names`: MediaPipe-Index und -Name je gespeichertem Gelenkpunkt
- `fps`, `step`, `width`, `height`

Höchstens 15 Hz. Augen und Mund werden nicht gespeichert, Nase und Ohren bleiben für die Kopfhaltung. Nur Koordinaten, keine Bilddaten.

**`pose.npz` unterliegt derselben Löschfrist wie das anonymisierte Video: 30 Tage.** Das Originalvideo wird direkt nach der Auswertung gelöscht. Details in `docs/POSE_DATEN.md` und `docs/LOESCHKONZEPT.md` (Repo `motavi-backend`).

### 3.2 Normierung

- Zuerst in Pixel umrechnen (x mal Breite, y mal Höhe), sonst sind Winkel bei nicht quadratischen Videos verzerrt.
- Ursprung: Hüftmitte. Skalierung: Rumpflänge (Hüftmitte bis Schultermitte), als Median über das Video, damit Bücken und Drehen die Hände nicht verzerren.
- Glättung mit Savitzky-Golay oder gleitendem Median, Fenster konfigurierbar.
- Lücken bis 0,5 s interpolieren, längere markieren.

---

## 4. Kennzahlen und Methoden

### 4.1 Zykluserkennung

**Signal:** Merkmalsvektor aus normierten Handgelenkpositionen, Rumpfneigung und Rumpfdrehung.

**Verfahren:**
1. Dominante Periode über Autokorrelation (Suchbereich konfigurierbar, Standard 1,5 bis 180 s; Untergrenze am 30.10.2026 von 3 s gesenkt).
2. Zyklusgrenzen über wiederkehrende Muster, z.B. Peak-Erkennung mit `scipy.signal`. Kein `stumpy` (bringt `numba` mit und vergrößert das Container-Image).
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

Aus der bestehenden Pipeline: REBA-Mittelwert und Maximum, Anteile Bücken, Überkopf, Drehung. Zusätzlich Drehungen pro Zyklus. Die Drehung liefert die Pipeline nicht; das Modul misst sie seit S4 aus `pose.npz` (Schulter- gegen Hüftlinie über die geschätzte Tiefe, grober Wert, Pilotphase).

### 4.5 Kundenangaben

- Teilegewicht, grobe Abmessungen
- Anzahl Varianten
- Stück pro Schicht (Plausibilitätsprüfung gegen gemessene Zyklen)
- Schichtmodell, Arbeitstage, Vollkosten pro Stunde
- Schwierigkeit der Stellenbesetzung (1 bis 5)
- Grobe Investitionsbandbreite für Automatisierung (optional, sonst Standardwerte je Typ)

---

## 5. Bewertung und Empfehlung

Alle Gewichte, Schwellen und Regeln in `config/workplace_scoring.json` (Repo `motavi-backend`, seit S4). Dieselbe Datei nutzt der Arbeitsplatz-Check der Website; wie sie ins Website-Repo kommt (Kopie beim Build oder Abruf vom Backend), wird in Phase 3 der Website entschieden.

Ein Kriterium ohne Messwert fällt weg, sein Gewicht verteilt sich auf die übrigen, die Empfehlung ist dann vorläufig. "Kein wiederkehrender Zyklus" zählt bei Wiederholungen, Gleichförmigkeit und Zeitanteil in Zyklen als 0.

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
euro_auto_brutto  = stunden_auto_jahr * stundensatz
euro_auto_netto   = euro_auto_brutto * (1 - betriebskosten_anteil)   # je Typ, Bandbreite (seit 30.10.2026)
amortisation      = investition_bandbreite / euro_auto_netto     # in Jahren, als Bandbreite
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

Datei `src/content/demo/demo_steckbrief.json`, erfundene plausible Werte, klar als Beispiel gekennzeichnet. Seit S5 sind die Demo-Dateien gültige Exporte im Format 1.0 (`format`, `schema_version`, `beispiel: true`, `empfehlung_id`). Zusätzlich drei kürzere Varianten für die anderen Empfehlungen (`demo_verbessern.json`, `demo_automatisieren.json`, `demo_beibehalten.json`), damit die Website alle Wege zeigen kann.

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
3. Zielwert Pilotphase: Median-Zykluszeit innerhalb ±10 % der manuellen Messung. Weitere Zielwerte (bestätigt am 30.10.2026): Anzahl Zyklen innerhalb ±10 % bei höchstens 10 % falsch erkannten Zyklen, Zeitanteil Verschwendung innerhalb ±5 Prozentpunkte, kein Zyklus erkannt, wo von Hand keiner gesehen wird. Entschieden wird je Kennzahl ab drei Videos, und nur wenn alle im Ziel liegen.
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
Setze Abschnitt 3 um: Rekorder als optionaler Parameter der Pipeline,
pose.npz mit höchstens 15 Hz, float16, ohne Augen und Mund. Normierung und
Glättung in backend/app/services/workplace/preprocess.py. Unit-Tests mit
synthetischen Daten. Golden-Test, dass result.json vor und nach der
Änderung identisch ist.
```

**Abnahme:** Tests grün, result.json unverändert. Umgesetzt am 30.10.2026.

### S2: Zykluserkennung und Greifraum

```
Setze Abschnitt 4.1 und 4.2 um in backend/app/services/workplace/cycles.py und reach.py. Tests mit
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

**Abnahme:** An einem Video Segmente bestätigt, Anteile plausibel. Umgesetzt am 30.10.2026 (Backend `segments.py`, `/api/v1/workplace/{job_id}/ablauf` und `/review`, Expertenansicht `/app/experte/{job_id}`); Abnahme an einem echten Video steht aus.

### S4: Scores, Empfehlung, Wirtschaftlichkeit

```
Setze Abschnitt 4.5 und 5 um. config/workplace_scoring.json als einzige
Quelle für Gewichte, Schwellen, vermeidbare Anteile und Regeln. Tests für
beide Scores, alle vier Empfehlungen, Vorrang-Markierung, Typregeln und
Wirtschaftlichkeit inklusive der Rechnung auf Basis des verbesserten
Ablaufs.
```

**Abnahme:** Vier Testprofile ergeben die vier Empfehlungen. Umgesetzt am 30.10.2026 (Backend `scoring.py`, `wirtschaft.py`, `steckbrief.py`, `belastung.py`, Konfiguration `config/workplace_scoring.json`, Erläuterung `docs/SCORING.md` im Repo `motavi-backend`). Die vier Profile ergeben die vier Empfehlungen. Die Startwerte der Konfiguration sind Annahmen und werden nach Abschnitt 8 nachjustiert.

### S5: Dashboard, PDF, Export

```
Setze Abschnitt 6 um: Dashboard-Tab "Steckbrief", 2-seitiger PDF-
Steckbrief, JSON-Export mit Schema in docs/steckbrief_schema.json.
Demo-Daten aus Abschnitt 7 inklusive der drei Varianten anlegen.
Screenshots von Dashboard-Tab und PDF für alle vier Empfehlungen.
```

**Abnahme:** Steckbrief ohne Erklärung verständlich, Export gegen Schema gültig. Umgesetzt am 30.10.2026 (Repo `motavi-backend`: Dashboard-Tab `?tab=steckbrief`, PDF `pdf_steckbrief.py`, Export mit Schema `docs/steckbrief_schema.json`, Bestätigung von Empfehlung und Typ in der Expertenansicht, Erläuterung `docs/STECKBRIEF_AUSGABE.md`). Exporte aller Testprofile und die vier Demo-Dateien sind gegen das Schema gültig. Ob der Steckbrief ohne Erklärung verständlich ist, entscheidet die Durchsicht der Screenshots.

### S6: Validierung

```
Skript, das manuelle Zyklus- und Segment-Zeitstempel (CSV: video,
start_s, ende_s, typ) mit den erkannten vergleicht und die Kennzahlen aus
Abschnitt 8 ausgibt. Ergebnisse in docs/validierung_steckbrief.md.
```

**Abnahme:** Validierungsbericht liegt vor. Danach entscheiden, welche Kennzahlen das Label "Pilotphase" verlieren. Skript umgesetzt am 30.10.2026 (`backend/scripts/validate_steckbrief.py` im Repo `motavi-backend`). `docs/validierung_steckbrief.md` enthält bisher nur einen Prüflauf mit synthetischen Daten, keine Validierung: Das Label "Pilotphase" bleibt für alle Kennzahlen, bis Videos mit geklärten Nutzungsrechten von Hand erfasst sind. Der Prüflauf hat einen Fehler in der Periodenwahl gefunden (kurze Wiederholbewegung innerhalb eines Schritts), der behoben ist.

---

## 10. Bewusst nicht in dieser Version

- Objekterkennung (Teile, Behälter, Maschinen)
- Handgelenk- und Fingerdetails
- 3D-Rekonstruktion und Zentimeterwerte
- Automatische Klassifikation der Ablaufschritte durch ein trainiertes Modell
- LLM-generierte Texte

Kommen in Frage, wenn Pilotkunden und Gespräche mit Robotik-Anbietern zeigen, was wirklich fehlt.
