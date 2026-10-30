# Motavi Website: Design-Briefing für Claude Code

Stand: 29.10.2026 (Version 3: eine Messung, drei Empfehlungen)
Gehört zu: `docs/WEBSITE_PLAN.md`, `docs/STECKBRIEF_MODUL.md`
Ablage im Repo: `docs/DESIGN_BRIEF.md`

So nutzt du dieses Briefing:
1. Datei ins Repo legen.
2. Die Design-Phasen D0 bis D3 (Abschnitt 9) laufen zwischen Phase 1 und Phase 2 des Website-Plans.
3. Erst wenn der Design-Prototyp freigegeben ist, setzt Claude Code die Inhaltsseiten um.

---

## 1. Designziel

Die Website muss in fünf Sekunden drei Dinge vermitteln:

1. **Jede Bewegung wird messbar, und daraus folgt eine klare Entscheidung:** verbessern, automatisieren oder beibehalten.
2. **Das ist präzise Ingenieursarbeit und herstellerneutral**, kein Verkaufsprospekt eines Roboteranbieters. Alle drei Wege sind gleichwertig.
3. **Das ist sicher für Mitarbeitende und Betriebsrat.**

**Gefühl:** ruhig, präzise, technisch, vertrauenswürdig. Eher Messinstrument und technisches Datenblatt als Startup-Spielerei.

**Referenzgefühl:** Datenblatt trifft Industriesoftware trifft Robotik-Engineering. Viel Weißraum, klare Raster, Zahlen als Helden, technische Zeichnungen statt Fotos.

**Vermeiden:**
- Stockfotos von lächelnden Menschen mit Helm
- Gesundheits-Optik (Herzen, Wellness-Grün, Rückenschmerz-Illustrationen)
- Generische KI-Optik (leuchtende Gehirne, Neuronetze, Roboterhände, Humanoide)
- Roboterfotos oder Renderings bestimmter Hersteller (widerspricht der Neutralität)
- Bilder "Roboter ersetzt Mensch" oder Mensch und Roboter im Wettstreit
- Verläufe in Lila-Pink, Glasmorphismus, verspielte Blobs
- Überladene Animationen

---

## 2. Visuelle Leitidee: "Die Bewegung wird zum Datenblatt"

Das wiederkehrende Motiv ist ein **anonymisiertes Bewegungsskelett** (Linien und Gelenkpunkte), über dem Messwerte erscheinen: Zykluszeit, Wiederholungen, Greifraum, Winkel.

Dieses Motiv zeigt in einem Bild, was Motavi tut, und beantwortet gleichzeitig die Datenschutzfrage: Man sieht keinen Menschen, nur seine Bewegung.

**Erweiterung:** Aus der Bewegung entsteht schrittweise eine technische Beschreibung der Aufgabe. Die Animation endet nicht beim Skelett, sondern bei einem Datenblatt: Bahnkurve der Hand, Greifraum als Hüllkurve, Zykluszeit. Das ist die Sprache von Industrial Engineering und Robotik. Der Roboter selbst wird nie gezeigt: Motavi beschreibt die Aufgabe, nicht die Lösung.

**Zweites Leitmotiv: der Entscheidungsweg.** Eine Messung verzweigt sich in drei Wege: Verbessern, Automatisieren, Beibehalten. Gestaltet wie eine schlichte technische Weiche oder ein Flussdiagramm mit drei Ausgängen. Jeder Weg hat eine eigene Kennfarbe (siehe Abschnitt 3), aber gleiches Gewicht in Größe und Platzierung. Dieses Motiv erscheint auf der Startseite, auf der Steckbrief-Seite und als Kopf jedes Steckbriefs.

**Einsatz:**
- Hero: animiertes Skelett bei einem Greif- und Platzierzyklus. Die Handbahn zeichnet sich als Linie nach, nach drei Zyklen erscheinen die drei Werte des Markenversprechens: Zeit ("38,4 s je Zyklus"), Kosten ("23.400 € pro Jahr"), Belastung ("REBA 5,8").
- Abschnittstrenner: statische Skelett-Posen als feine Linienzeichnung.
- Leere Zustände und Ladeanimationen: dasselbe Motiv.

Das Skelett wird als SVG gebaut (keine Fotos, keine echten Videos). Gelenkpunkte als Kreise, Verbindungen als 1,5 px Linien.

---

## 3. Design-Tokens

### Grundsatz

- **Website hell**, Dashboard bleibt dunkel. Der Wechsel beim Login ist gewollt: Die Website ist das Schaufenster, das Dashboard das Werkzeug.
- **Verbindendes Element:** Die Datenfarben des Dashboards (Cyan, Rot) erscheinen auf der Website in Zahlen, Diagrammen und dem Skelett. So erkennt ein Besucher später im Produkt die Website wieder.
- Falls Phase 0 ergibt, dass im Repo bereits ein anderes System festgelegt ist, fragt Claude Code nach, bevor es diese Tokens übernimmt.

### Farben

```css
:root {
  /* Flächen */
  --bg:            #FFFFFF;
  --bg-subtle:     #F6F7F9;   /* abgesetzte Sektionen */
  --bg-inverse:    #0A0F1E;   /* dunkle Sektionen, Footer, Dashboard-Vorschau */
  --border:        #E4E6EB;   /* Karten, Trennlinien (dekorativ) */
  --border-strong: #868FA6;   /* Formularelemente: 3,23 auf Weiß, 3,02 auf subtle */
  --error-ink:     #9B3D3D;   /* Formularfehler: 6,71 auf Weiß, 6,26 auf subtle */

  /* Text */
  --text:          #1A1A1A;
  --text-muted:    #5B616E;
  --text-inverse:  #FFFFFF;

  /* Marke */
  --primary:       #6C3AED;   /* CTAs, Links, aktive Zustände */
  --primary-hover: #5A2BD4;
  --primary-soft:  #F1ECFE;   /* Hintergrund für Hervorhebungen */

  /* Datenfarben, Stufe "ink": für Text, Linien, Symbole und Füllungen
     auf hellem Grund (--bg und --bg-subtle). Alle mindestens 4,5:1. */
  --data-ink:      #007A99;   /* 4,95 auf Weiß, 4,62 auf subtle */
  --risk-ink:      #C62E3A;   /* 5,45 / 5,08 */
  --gain-ink:      #15803D;   /* 5,02 / 4,68 */
  --warn-ink:      #B45309;   /* 5,02 / 4,68 */

  /* Datenfarben, Stufe "bright": Originalfarben des Dashboards. Nur auf
     dunklem Grund (--bg-inverse) oder als Fläche, deren Beschriftung
     außerhalb in --text steht. Nie als Text oder Linie auf Hell. */
  --data:          #00B4D8;   /* 7,75 auf --bg-inverse */
  --risk:          #E63946;   /* 4,58 auf --bg-inverse */
  --gain:          #16A34A;   /* 5,79 auf --bg-inverse */
  --warn:          #D97706;   /* 5,99 auf --bg-inverse */

  /* Empfehlungen (gleichwertig, keine Ampellogik), auf Hell */
  --path-improve:  #15803D;   /* Verbessern */
  --path-automate: #007A99;   /* Automatisieren */
  --path-keep:     #5B616E;   /* Beibehalten, 6,21 */
}

/* Dunkle Sektionen und Dashboard: ink-Tokens auf bright umschalten */
.surface-inverse {
  --data-ink: #00B4D8;
  --risk-ink: #E63946;
  --gain-ink: #16A34A;
  --warn-ink: #D97706;
  --path-improve:  #16A34A;
  --path-automate: #00B4D8;
  --path-keep:     #9AA0AC;   /* 7,27 auf --bg-inverse */
}
```

**Kontrastregel:** Komponenten verwenden ausschließlich die Tokens `--*-ink` und `--path-*`. Die bright-Werte werden nur über `.surface-inverse` aktiv. So passt sich jede Komponente automatisch an hellen und dunklen Grund an, und kein Datenwert kann versehentlich mit zu wenig Kontrast erscheinen.

**Empfehlungs-Labels, zwei Varianten:**
- **Kräftig** (nur für die eine Hauptaussage, z.B. Kopf des Steckbriefs): volle `--path-*`-Fläche mit weißer Schrift (4,94 bis 6,21:1).
- **Ruhig** (Standard für Listen, Tabellen, Matrix, Entscheidungsweg): Tönung der Pfadfarbe mit 10 bis 12 % Deckkraft als Fläche, Text in `--text`. Die Pfadfarbe trägt Icon, Punkt und 1-px-Rahmen. Wirkt wie ein Datenblatt-Etikett.

Nie Text in der Pfadfarbe auf der eigenen Tönung, nie weiße Schrift auf Bright-Cyan.

**Visuelle Folge:** Die Website wirkt in den Datenfarben etwas gedeckter und technischer als das Dashboard. Das passt zur Leitidee "Datenblatt". Die leuchtenden Originalfarben erscheinen dort, wo das Dashboard gezeigt wird: in dunklen Sektionen und der Steckbrief-Vorschau.

**Empfehlungsfarben:** Die drei Wege dürfen nicht wie eine Ampel wirken. "Beibehalten" ist ein gutes Ergebnis (keine Fehlinvestition), kein schlechtes. Deshalb Grau statt Rot. "Erst verbessern, dann automatisieren" wird als Abfolge der beiden Farben dargestellt (zwei Segmente mit Pfeil), nicht als Mischfarbe. Farbe nie als einziges Unterscheidungsmerkmal: immer mit Text und Icon.

**Regeln:**
- `--primary` nur für Interaktion (Buttons, Links, Fokus). Nicht für Daten.
- `--risk-ink` nur für Belastung und kritische Werte, nie für Fehlermeldungen im Formular. Dafür gilt `--error-ink` #9B3D3D (6,71:1 auf Weiß, 6,26:1 auf subtle), immer mit Icon und Text unter dem Feld.
- `--gain-ink` für alle Einsparungswerte. Die wichtigste Zahl der Seite (freisetzbare Minuten) ist immer grün oder neutral, nie rot.
- Text mindestens 4,5:1, auch bei großen Zahlen (strenger als WCAG verlangt, damit eine Regel für alles gilt). Linien, Symbole und Grafikelemente mindestens 3:1. Claude Code prüft alle Kombinationen automatisiert (Test im Repo) und meldet Verstöße.

### Typografie

| Rolle | Schrift | Einsatz |
|---|---|---|
| Headlines | Space Grotesk, 600 | H1 bis H3 |
| Fließtext | Inter, 400 und 500 | Text, Navigation, Buttons |
| Zahlen und Labels | JetBrains Mono, 500 | KPIs, Rechnerergebnisse, Kategorie-Labels |

**Skala (Desktop / Mobil):**

| Token | Desktop | Mobil |
|---|---|---|
| display | 64 px / 1,05 | 40 px |
| h1 | 48 px / 1,1 | 34 px |
| h2 | 36 px / 1,15 | 28 px |
| h3 | 22 px / 1,3 | 20 px |
| body-lg | 19 px / 1,6 | 17 px |
| body | 16 px / 1,6 | 16 px |
| label | 12 px, Mono, Großbuchstaben, Laufweite +0,08 em | gleich |
| kpi | 56 px, Mono | 40 px |

Schriften selbst hosten (keine Google-Fonts-Einbindung zur Laufzeit), damit keine Daten an Dritte gehen.

### Raster und Abstände

- Container max. 1200 px, Seitenrand 24 px mobil, 48 px Desktop.
- 12-Spalten-Raster, Abstand 24 px.
- Abstandsskala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Sektionsabstand vertikal: 96 px Desktop, 64 px mobil.

### Formen

- Radius: 8 px für Buttons und Eingabefelder, 12 px für Karten.
- Rahmen: 1 px `--border` für Karten und Trennlinien (dekorativ, kein Kontrastzwang). Schatten sparsam, nur bei hervorgehobenen Karten.
- Formularelemente (Eingabefelder, Auswahlfelder, Checkboxen, Radiobuttons, Spur des Schiebereglers): 1 px `--border-strong`. Hover: `--text-muted`. Fokus: 2 px `--primary` plus Fokusring. Fehler: 2 px `--error-ink` plus Icon und Fehlertext in `--error-ink` unter dem Feld. Formularelemente nur auf `--bg` oder `--bg-subtle` platzieren, nicht auf `--primary-soft` (dort nur 2,80:1).
- **Kategorie-Label:** kleiner Punkt (●) in Datenfarbe plus Label in Mono-Großbuchstaben, z.B. "● KAPAZITÄT".
- **Trennlinie:** feine gepunktete Linie (SVG, 1 px, Punktabstand 4 px) zwischen Abschnitten.

---

## 4. Komponenten

Claude Code baut zuerst eine Komponentenbibliothek und eine interne Übersichtsseite `/_styleguide` (nicht in Navigation und Sitemap, noindex).

| Komponente | Varianten | Hinweise |
|---|---|---|
| Button | primär, sekundär, Text | Mindesthöhe 44 px, sichtbarer Fokusring |
| Kategorie-Label | Daten, Risiko, Gewinn | Punkt plus Mono-Text |
| KPI-Kachel | Zahl, Einheit, Beschreibung, Quelle | Zahl in Mono, Quelle klein darunter |
| Nutzen-Karte | Icon, Titel, Text, Link | Drei nebeneinander, mobil gestapelt |
| Paket-Karte | normal, empfohlen | Empfohlen: 2 px Rahmen in `--primary`, Label "Empfohlen" |
| Vergleichstabelle | Pakete | Mobil als Karten statt Tabelle |
| Rechner-Panel | Eingaben links, Ergebnis rechts | Mobil: Ergebnis klebt unten als Leiste |
| Schieberegler | mit Wertanzeige | Tastatur bedienbar |
| Fragenkarte | Arbeitsplatz-Check | Eine Frage pro Ansicht, Fortschrittsbalken, Ergebnis als Empfehlungs-Label mit Doppel-Score |
| Skelett-Visual | animiert, statisch | SVG, respektiert `prefers-reduced-motion` |
| Hinweisbox | Methode, Datenschutz | Dezenter Hintergrund `--bg-subtle`, kleines Info-Icon |
| Dashboard-Vorschau | dunkler Rahmen | Zeigt gebautes UI mit Demo-Daten, kein Screenshot mit Kundenmaterial |
| Entscheidungsweg | groß (Startseite), kompakt (Steckbrief-Kopf) | Eine Messung, drei Ausgänge. Im Steckbrief ist der zutreffende Weg aktiv, die anderen gedämpft |
| Empfehlungs-Label | Verbessern, Erst verbessern dann automatisieren, Automatisieren, Beibehalten, Zusatz "Vorrangig" | Groß, mit Icon und Text, Farben nach Abschnitt 3 |
| Doppel-Score | zwei Balken | Verbesserungs-Score und Automatisierungs-Score nebeneinander mit Schwellenlinie, darunter die abgeleitete Empfehlung |
| Steckbrief-Vorschau | kompakt, vollständig, vier Varianten | Wirkt wie ein technisches Datenblatt: Kopf mit Arbeitsplatz und Empfehlung, Doppel-Score, Kennzahlen in Mono, Zyklus-Zeitleiste, Greifraum-Grafik, Minuten und Euro. Liest die Demo-Dateien. Umschalter zwischen den vier Beispielen |
| Zyklus-Zeitleiste | einzelner Zyklus, Folge von Zyklen | Segmente nach Klasse: wertschöpfend (kräftig), notwendig (mittel), Verschwendung (schraffiert). Zykluszeit als Maßlinie wie in einer technischen Zeichnung |
| Greifraum-Grafik | Seitenansicht | Silhouette mit Höhenzonen und Dichtefläche der Handpositionen in `--data-ink` |
| Partnerhinweis | ein Satz mit Icon | "Herstellerneutral" als wiederkehrendes Vertrauenselement |
| Formular | Eingabe, Auswahl, Checkbox, Textfeld | Labels immer sichtbar, Fehler unter dem Feld |
| Navigation | Desktop, mobil | Mobil: Vollbildmenü, CTA "Pilot anfragen" immer sichtbar |
| Footer | dunkel | Links, Rechtliches, Hinweis "Server in der EU" |

**Icons:** eine Linien-Icon-Bibliothek mit offener Lizenz (z.B. Lucide), 1,5 px Strichstärke, nicht gemischt mit anderen Sets.

---

## 5. Seitenlayouts

### Startseite

| Sektion | Layout | Hintergrund |
|---|---|---|
| Hero | Text links (6 Spalten), Skelett rechts (6 Spalten), aus dem drei Werte entstehen: Zeit, Kosten, Belastung | weiß |
| Problem | Drei Karten in einer Reihe | `--bg-subtle` |
| Eine Messung, drei Empfehlungen | Entscheidungsweg groß über die volle Breite, unter jedem Ausgang ein Satz. Darunter Leitsatz "Erst verstehen, dann automatisieren." | weiß |
| Beispiel-Steckbrief | Steckbrief-Vorschau über die volle Breite mit Umschalter zwischen den vier Beispielen | `--bg-inverse` (dunkel) |
| Beweis | Große KPI-Zahlen (4.800 Drehungen, 57 Min) mit Methodenhinweis und Label "Empfehlung: Verbessern" | weiß, Zahlen sehr groß |
| Drei Perspektiven | Drei Karten: Kapazität, Automatisierung, Gesundheit | `--bg-subtle` |
| Kapazität berechnen | Kompakter Rechner | weiß |
| So funktioniert es | Vier Schritte (01 bis 04 in Mono), Schritt 03 "Experte bewertet" betont | weiß |
| Herstellerneutral | Ein großer Satz, kleiner Link für Robotik-Anbieter | `--primary-soft` |
| Betriebsrat | Zwei Spalten: Versprechen links, Nachweis rechts | `--bg-subtle` |
| Pakete | Paket-Karten | weiß |
| Abschluss-CTA | Zentrierter Satz und Button | `--bg-inverse` |

**Wichtigste Gestaltungsregeln:**
1. Der Entscheidungsweg ist die zentrale Idee der Seite. Wer nur diese Sektion sieht, muss verstehen, was Motavi tut.
2. Der Beispiel-Steckbrief ist der visuelle Höhepunkt. Er wirkt wie ein Dokument, das ein Werkleiter in die Investitionsrunde mitnimmt und ein Robotik-Ingenieur ernst nimmt.
3. Die Beweissektion zeigt bewusst ein Beispiel, bei dem die Antwort "Verbessern" lautete. Das macht die Neutralität glaubwürdig.

### Unterseiten

- Gemeinsamer Kopfbereich: Kategorie-Label, H1, Einleitung in `body-lg`, max. 8 Spalten breit.
- `/arbeitsplatz-steckbrief`: oben der Steckbrief mit erklärenden Markierungen (jede Kennzahl mit Nummer und kurzer Erklärung daneben, wie eine beschriftete technische Zeichnung), dann die Entscheidungsregel als 2×2-Matrix (Verbesserungs-Score gegen Automatisierungs-Score), darunter der Arbeitsplatz-Check als geführter Ablauf, eine Frage pro Ansicht.
- `/kapazitaet`, `/automatisierung`, `/gesundheit`: gleicher Seitenaufbau, jeweils mit eigener Kennfarbe im Kategorie-Label. Am Ende jeder Seite der kompakte Entscheidungsweg mit dem Hinweis "Alle drei Perspektiven stammen aus derselben Messung".
- `/fuer-robotik-anbieter`: nüchterner als die Startseite, mehr Datenblatt, weniger Marketing. Zeigt den JSON-Export als formatierten Codeausschnitt neben dem PDF-Steckbrief.
- `/kapazitaet`: zusätzlich der Rechner als Hauptelement über die volle Breite.
- `/betriebsrat`: viel Text, deshalb schmale Lesespalte (max. 720 px) und Seitennavigation am Desktop.

---

## 6. Bildsprache

- **Keine echten Personen**, keine Gesichter, keine Kundenvideos und keine Standbilder aus Kundenprojekten.
- **Arbeitsplatz-Illustrationen** als reduzierte Linienzeichnungen (Werkbank, Regal, Behälter, Maschine) in `--text-muted`, das Skelett darüber in `--data-ink`.
- **Stil technischer Zeichnungen:** Maßlinien, Hüllkurven, Bahnkurven, Rasterpapier als feiner Hintergrund in einzelnen Sektionen. Das verbindet Motavi visuell mit Engineering und Automatisierung, ohne Roboter zu zeigen.
- **Dashboard-Vorschau** aus echten Komponenten mit erfundenen Demo-Daten gebaut, nicht als Screenshot.
- **Keine Logos** von Kunden, Roboterherstellern oder Partnern, solange keine Freigabe vorliegt.

---

## 7. Bewegung und Interaktion

- Skelett im Hero: drei Greif- und Platzierzyklen in etwa 8 Sekunden, Handbahn zeichnet sich nach, danach erscheinen Zykluszeit und Greifraum-Hüllkurve. Danach Schleife.
- KPI-Zahlen zählen beim ersten Sichtbarwerden einmal hoch (max. 1,2 s).
- Übergänge: 150 bis 250 ms, Easing `ease-out`.
- Bei `prefers-reduced-motion` alles statisch, Zahlen sofort im Endwert.
- Keine Scroll-Effekte, die Inhalte verstecken oder springen lassen.

---

## 8. Qualitätskriterien

- Lighthouse Accessibility mindestens 95, Performance mindestens 90.
- Tastaturbedienung vollständig, sichtbarer Fokus überall.
- Mobil ab 360 px ohne horizontales Scrollen.
- Hero-Visual unter 50 KB (SVG, kein Video).
- Layout darf bei langen deutschen Wörtern nicht brechen ("Gefährdungsbeurteilung", "Betriebsvereinbarung"): Silbentrennung mit `hyphens: auto` und `lang="de"`.
- Keine Gedankenstriche in sichtbaren Texten.

---

## 9. Design-Phasen mit Prompts

### D0: Designrichtung festlegen

```
Lies docs/WEBSITE_PLAN.md und docs/DESIGN_BRIEF.md. Nutze den
frontend-design Skill, falls verfügbar. Vergleiche die Tokens aus
Abschnitt 3 mit dem, was im Repo bereits existiert. Wenn es Widersprüche
gibt, liste sie und frag mich, bevor du etwas änderst. Erstelle dann drei
Varianten des Hero-Bereichs als statische Seiten unter /_design/hero-a,
/_design/hero-b, /_design/hero-c. Alle drei nutzen die Tokens und das
Skelett-Motiv, unterscheiden sich aber in Komposition und Gewichtung.
Mach von jeder Variante einen Screenshot (Desktop und 390 px mobil) und
beschreibe in zwei Sätzen, was sie jeweils betont.
```

**Abnahme:** Ich wähle eine Hero-Variante.

### D1: Tokens und Komponentenbibliothek

```
Setze die Tokens aus Abschnitt 3 als CSS-Variablen und Tailwind-Theme um.
Baue alle Komponenten aus Abschnitt 4 und die Übersichtsseite
/_styleguide (noindex, nicht in Sitemap und Navigation). Jede Komponente
in allen Varianten und Zuständen (normal, Hover, Fokus, deaktiviert,
Fehler). Prüfe alle Farbkombinationen auf WCAG AA und liste die
Ergebnisse. Mach Screenshots der Styleguide-Seite.
```

**Abnahme:** Styleguide vollständig, Kontrastbericht ohne Verstöße.

### D2: Skelett-Visual

```
Baue das Skelett-Visual aus Abschnitt 2 als React-Komponente mit SVG.
Pose-Daten als Keyframes in einer eigenen Datei (Gelenkpositionen
normiert 0 bis 1). Bewegungen: Greif- und Platzierzyklus mit
Rumpfdrehung (Hero), Bücken (Gesundheitsseite). Die Handbahn zeichnet
sich als Linie nach, nach drei Zyklen erscheinen drei Werte im Stil
einer technischen Zeichnung (Maßlinien, Mono): Zeit (Zykluszeit),
Kosten (Euro pro Jahr), Belastung (REBA). Variante statisch für Abschnittstrenner.
prefers-reduced-motion beachten. Dateigröße unter 50 KB. Zeig mir
Screenshots von drei Zeitpunkten der Animation.
```

**Abnahme:** Bewegung wirkt natürlich, kein Gesicht, Werte lesbar.

### D2b: Steckbrief-Vorschau

```
Baue die Komponenten Entscheidungsweg, Empfehlungs-Label, Doppel-Score,
Steckbrief-Vorschau, Zyklus-Zeitleiste und Greifraum-Grafik aus
Abschnitt 4. Datenquelle: die vier Demo-Dateien nach
docs/STECKBRIEF_MODUL.md, Abschnitt 7. Prüfe, dass alle vier
Empfehlungen optisch gleichwertig wirken und keine wie ein
Warnsignal aussieht. Die Vorschau muss wie ein
technisches Datenblatt wirken, nicht wie ein Marketing-Widget. Gleiche
Struktur wie der spätere Dashboard-Tab, damit Website und Produkt
übereinstimmen. Variante hell für die Website, Variante dunkel für das
Dashboard. Screenshots beider Varianten in 1440 px und 390 px.
```

**Abnahme:** Ein Werkleiter versteht Empfehlung und Begründung ohne Erklärung, ein Robotik-Ingenieur findet die Werte, die er braucht, und "Beibehalten" wirkt nicht wie ein Misserfolg.

### D3: Klickbarer Prototyp der Startseite

```
Baue die Startseite nach Abschnitt 5 mit den finalen Komponenten und
Platzhaltertexten aus src/content/. Noch keine Rechenlogik, der
ROI-Teaser zeigt feste Beispielwerte. Mach Screenshots der kompletten
Seite in 1440 px und 390 px. Prüfe selbst kritisch gegen Abschnitt 1
"Vermeiden" und Abschnitt 8 und nenne mir drei Stellen, die du
verbessern würdest.
```

**Abnahme:** Startseite visuell freigegeben. Danach geht es mit Phase 2 des Website-Plans weiter.

---

## 10. Offene Designfragen

1. **Logo:** Gibt es bereits ein Motavi-Logo? Falls nicht, nutzt Claude Code vorerst eine reine Wortmarke in Space Grotesk. Ein echtes Logo sollte gestaltet werden, bevor die Seite öffentlich geht.
2. **Farbsystem:** Bisher existieren zwei Varianten (hell mit Lila, dunkel mit Teal). Dieses Briefing schlägt hell mit Lila plus Dashboard-Datenfarben vor. **Entschieden in Phase 0:** Tokens aus Abschnitt 3 übernommen (`src/styles/tokens.css`), Schriften selbst gehostet.
3. **Partnerseite:** Soll `/fuer-robotik-anbieter` schon im Prototyp gestaltet werden oder erst nach den Gesprächen mit Anbietern? Empfehlung: gestalten, aber nicht verlinken.
4. **Dashboard-Angleich:** Später sollte das Dashboard die gleichen Schriften und Datenfarben behalten, damit der Übergang von Website zu Produkt stimmig ist. Das ist ein eigener Schritt, nicht Teil dieses Relaunchs.
