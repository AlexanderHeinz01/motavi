# Motavi Website Relaunch: Implementierungsplan für Claude Code

Stand: 29.10.2026 (Version 3: eine Messung, drei Empfehlungen)
Ablage im Repo: `docs/WEBSITE_PLAN.md`
Zugehörig: `docs/DESIGN_BRIEF.md` (Gestaltung), `docs/STECKBRIEF_MODUL.md` (Analysemodul Arbeitsplatz-Steckbrief)

So nutzt du diesen Plan:
1. Alle drei Dateien unter `docs/` ins Repo legen.
2. Claude Code pro Phase den jeweiligen Prompt geben.
3. Nach jeder Phase die Abnahmekriterien prüfen, erst dann weiter.

Reihenfolge der Arbeit:

| Schritt | Dokument | Inhalt |
|---|---|---|
| 1 | Website-Plan | Phase 0 und 1: Bestandsaufnahme, Grundgerüst |
| 2 | Design-Briefing | D0 bis D3: Designrichtung, Komponenten, Prototyp |
| 3 | Steckbrief-Modul | S0 bis S2: Datengrundlage, Zykluserkennung, Greifraum |
| 4 | Website-Plan | Phase 2 bis 7: Inhalte, Rechner, Formular, Qualität |
| 5 | Steckbrief-Modul | S3 bis S6: Ablaufschritte, Bewertung, Report, Validierung |

Die Website darf nichts versprechen, was das Modul nicht kann. Unfertige Funktionen werden als Pilotphase gekennzeichnet.

---

## 1. Positionierung

### Markenversprechen

**Motavi macht jede Bewegung messbar: als Zeit, als Kosten und als Belastung.**

### Nutzen für den Kunden

**Motavi zeigt, welche Arbeit verbessert, welche automatisiert und welche beibehalten werden sollte, und wie viel Zeit darin steckt.**

### Die Logik: eine Messung, drei Empfehlungen

Jeder Arbeitsplatz wird gleich gemessen. Daraus folgt eine Empfehlung:

| Empfehlung | Wann | Nutzen |
|---|---|---|
| **Verbessern** | Verschwendung und Belastung durch Gestaltung lösbar (Greifwege, Höhen, Layout, Materialbereitstellung) | Kapazität und Entlastung, schnell und günstig |
| **Automatisieren** | Hohe Wiederholung, gleichförmige Zyklen, hohe Belastung, wenig Varianten | Physical AI am richtigen Ort |
| **Beibehalten** | Hohe Variantenvielfalt, kurze Zyklen ohne Muster, geringe Belastung | Keine Fehlinvestition |

Häufig lautet die Empfehlung **"Erst verbessern, dann automatisieren"**: Wer Verschwendung automatisiert, bezahlt einen Roboter für unnötige Bewegungen.

### Drei Perspektiven auf dasselbe Ergebnis

| Perspektive | Zielgruppe | Frage |
|---|---|---|
| Kapazität | Werkleiter, Produktionsleiter, GF | Wie viele Stunden stecken in nicht wertschöpfender Bewegung? |
| Automatisierung (Physical AI) | Werkleiter, Industrial Engineering, Innovation | Welcher Arbeitsplatz lohnt sich für einen Roboter, welcher nicht? |
| Gesundheit und Compliance | HSE, Betriebsrat, Personal | Wo ist die Belastung am höchsten, und was hilft am schnellsten? |

Das sind keine getrennten Produkte, sondern drei Einstiege in dieselbe Analyse.

### Headline und Subline Startseite

**Headline:** Verbessern, automatisieren oder beibehalten? Motavi misst, was sich an jedem Arbeitsplatz lohnt.

**Subline:** Motavi macht jede Bewegung messbar: als Zeit, als Kosten und als Belastung. Für jeden Arbeitsplatz erhalten Sie eine klare Empfehlung, ob Sie ihn gestalten, automatisieren oder beibehalten sollten. Herstellerneutral, ohne Sensoren, DSGVO-konform.

**Wiederkehrender Leitsatz für Abschnitte und LinkedIn:** Erst verstehen, dann automatisieren.

### Zweite Zielgruppe

Robotik-Anbieter und Integratoren erhalten über Motavi Arbeitsplätze, die nachweislich passen, mit bereinigten Abläufen und standardisierten Daten. Eigene Seite, auf der Startseite nur als Hinweis.

### Nicht versprechen

Liquidität und Bestandsreduktion. Konkrete Hersteller oder Produkte. Genauigkeitswerte vor abgeschlossener Validierung.

---

## 2. Leitplanken (gelten für jede Phase)

Diese Regeln gehören zusätzlich in die `CLAUDE.md` des Repos.

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

---

## 3. Informationsarchitektur

| Route | Seite | Zweck |
|---|---|---|
| `/` | Startseite | Markenversprechen, eine Messung und drei Empfehlungen, Beispiel-Steckbrief, Beweis, Pakete |
| `/arbeitsplatz-steckbrief` | Der Steckbrief | Jede Kennzahl erklärt, Entscheidungslogik, Arbeitsplatz-Check |
| `/kapazitaet` | Perspektive Kapazität | Zeit in nicht wertschöpfender Bewegung, ROI-Rechner |
| `/automatisierung` | Perspektive Automatisierung | Physical-AI-Kontext, "Erst verstehen, dann automatisieren", Kriterien |
| `/gesundheit` | Perspektive Gesundheit | REBA, LMM, CSRD, Fehltage |
| `/so-funktionierts` | Ablauf | Video, Messung, Expertenbewertung, Steckbrief und Report |
| `/fuer-robotik-anbieter` | Partnerseite | Angebot für Robotik-Anbieter und Integratoren |
| `/pakete` | Pakete und Preise | Pakete, alle mit Steckbrief |
| `/betriebsrat` | Datenschutz und Betriebsrat | Anonymisierung, § 87 BetrVG, Zweckbindung, Umgang mit Automatisierung |
| `/pilot` | Pilot anfragen | Formular mit Auswahl Hersteller oder Robotik-Anbieter |
| `/impressum`, `/datenschutz` | Pflichtseiten | Platzhalter, Texte durch Anwalt oder Generator |

Navigation: Steckbrief, Kapazität, Automatisierung, Gesundheit, Pakete, Betriebsrat, CTA "Pilot anfragen".

### Startseite: Sektionen in Reihenfolge

1. **Hero:** Headline und Subline aus Abschnitt 1. CTA "Pilot anfragen", zweiter CTA "Beispiel-Steckbrief ansehen". Visual: Bewegungsskelett, aus dem Zeit, Kosten und Belastung entstehen.
2. **Problem:** "Jeder Arbeitsplatz verliert Zeit. Niemand weiß genau, wo und warum." Drei Kacheln: Fachkräftemangel (Arbeit bleibt liegen), Automatisierungsdruck (Investitionen ohne Datengrundlage), Fehlzeiten (Belastung kostet).
3. **Eine Messung, drei Empfehlungen:** Grafik: Messung in der Mitte, drei Wege (Verbessern, Automatisieren, Beibehalten) mit je einem Satz, wann er passt. Darunter: "Erst verstehen, dann automatisieren."
4. **Beispiel-Steckbrief:** Interaktive Vorschau mit Demo-Daten.
5. **Beweis:** Fallbeispiel Abfülllinie: 4.800 Drehbewegungen pro Schicht, 57 Minuten Potenzial pro Schicht, Ursache im Prozessschritt erkannt und durch Gestaltung gelöst. Mit Methodenhinweis. Botschaft: Hier lautete die Antwort "Verbessern".
6. **Drei Perspektiven:** Drei Karten (Kapazität, Automatisierung, Gesundheit) mit Kernfrage und Link.
7. **Kapazität berechnen:** Mini-Rechner.
8. **So funktioniert es:** 01 Video aufnehmen, 02 KI misst, 03 Experte bewertet, 04 Steckbrief und Empfehlung.
9. **Herstellerneutral:** "Wir verkaufen keine Roboter. Wir sagen Ihnen, wo sich einer lohnt, und wo nicht." Kleiner Link für Robotik-Anbieter.
10. **Betriebsrat als Partner:** Kurzfassung, Link.
11. **Pakete.**
12. **Abschluss-CTA:** "Finden Sie heraus, was sich an Ihren Arbeitsplätzen lohnt."

### `/fuer-robotik-anbieter`

1. Kopf: "Arbeitsplätze, die wirklich passen. Mit Daten, die Sie für ein Angebot brauchen."
2. Nutzen: vorqualifizierte Arbeitsplätze, bereinigte Abläufe (weniger Projektrisiko), Zykluszeiten, Greifräume und Ablaufschritte als strukturierte Daten.
3. Datenformat: JSON- und PDF-Steckbrief.
4. Zusammenarbeit und Neutralität: Gegenüber Endkunden bleibt Motavi neutral, auch "nicht automatisieren" ist ein mögliches Ergebnis.
5. CTA "Partnergespräch vereinbaren".

---

## 4. Interaktive Elemente

### 4.1 ROI-Rechner (`/kapazitaet`)

| Feld | Standard | Einheit |
|---|---|---|
| Anzahl Arbeitsplätze | 10 | Stück |
| Nicht wertschöpfende Bewegung je Schicht | 45 | Minuten |
| Davon durch Gestaltung vermeidbar | 50 | Prozent |
| Schichten pro Tag | 2 | Anzahl |
| Arbeitstage pro Jahr | 220 | Tage |
| Vollkosten pro Stunde | 50 | Euro |

```
minuten_frei  = nws_min * anteil / 100
stunden_jahr  = arbeitsplaetze * minuten_frei * schichten * tage / 60
euro_jahr     = stunden_jahr * stundensatz
vollzeit_aeq  = stunden_jahr / 1650
```

Ausgabe: Stunden, Euro und Vollzeitäquivalente pro Jahr als "freisetzbare Kapazität". Pflichthinweis: "Beispielrechnung auf Basis Ihrer Annahmen. Die tatsächlichen Werte ermittelt die Analyse."

### 4.2 Arbeitsplatz-Check (`/arbeitsplatz-steckbrief`)

Selbsttest mit 8 Fragen. Ergebnis ist eine der drei Empfehlungen (oder "Erst verbessern, dann automatisieren"), dazu die beiden Teilwerte als Balken. Gewichte und Entscheidungsregeln stammen aus `config/workplace_scoring.json`, derselben Datei, die das Analysemodul nutzt (siehe `docs/STECKBRIEF_MODUL.md`, Abschnitt 5).

Fragen (Selbsteinschätzung):
1. Wie oft wiederholt sich die Tätigkeit pro Schicht?
2. Wie gleichförmig läuft jeder Durchgang ab?
3. Wie viele Teile- oder Produktvarianten gibt es?
4. Wie schwer und handlich sind die Teile?
5. Wie viel Gehen, Suchen und Warten gehört zum Ablauf?
6. Wie oft wird gebückt, über Kopf oder mit Drehung gearbeitet?
7. Wie hoch ist der Zeitanteil dieser Tätigkeit an der Schicht?
8. Wie schwer ist die Stelle zu besetzen?

Ergebnis wird nicht gespeichert. Hinweis: "Im Steckbrief messen wir diese Kriterien objektiv im Video."

---

## 5. Technik

- Bestehendes React + Vite + Tailwind, Routing mit `react-router-dom`.
- SEO: Vorab-Generierung, Titel und Meta-Description pro Seite, `sitemap.xml`, `robots.txt`, Open-Graph-Bilder. Suchbegriffe: Automatisierungspotenzial, Arbeitsplatzanalyse, Ergonomie Analyse Video, Zykluszeitanalyse, Physical AI Produktion, Lean Automatisierung.
- Texte in `src/content/*.ts`.
- Scoring-Konfiguration als gemeinsame JSON-Datei für Website und Analysemodul.
- Formular: `POST /api/v1/contact`, Honeypot, Rate-Limit, Zugangsdaten aus Umgebungsvariablen. Offen: welcher Server den Endpunkt bereitstellt (das Repo hat bisher keinen).
- Website und Analyse-App getrennt deployen. Stand Phase 0: vorerst eine Vite-App (Bereitstellung über Google AI Studio), Website vorgerendert, App unter `/app` nachgeladen; die Ordnerstruktur erlaubt die spätere Trennung.
- Lighthouse mindestens 90, mobil ab 360 px, WCAG AA.

---

## 6. Phasen mit Prompts

### Phase 0: Bestandsaufnahme

```
Lies docs/WEBSITE_PLAN.md, docs/DESIGN_BRIEF.md und docs/STECKBRIEF_MODUL.md
vollständig. Analysiere das Repo, ohne Dateien zu ändern: Wo liegt die
Marketing-Website, welcher Stack, welche Routen, welche Design-Tokens,
welche Komponenten sind wiederverwendbar? Speichert die Analyse-Pipeline
Pose-Daten pro Frame dauerhaft? Liste alle Texte, die Abschnitt 1 und 2
widersprechen. Bericht und Vorschlag für die Ordnerstruktur. Keine
Umsetzung.
```

**Abnahme:** Bericht liegt vor, Designsystem entschieden, Ordnerstruktur freigegeben.

### Phase 1: Grundgerüst

```
Setze Phase 1 aus docs/WEBSITE_PLAN.md um: Routen und Navigation aus
Abschnitt 3, gemeinsames Layout, Inhaltsdateien unter src/content/,
SEO-Grundlagen aus Abschnitt 5. Seiten mit Überschrift und
Platzhaltertext. Leitplanken aus Abschnitt 2 in CLAUDE.md ergänzen.
Gesamte Website auf noindex. Neuer Branch website-relaunch.
```

**Abnahme:** Alle Routen erreichbar, Navigation mobil und Desktop, Build fehlerfrei.

Danach: Design-Phasen D0 bis D3, dann Modul-Phasen S0 bis S2.

### Phase 2: Startseite

```
Setze die Startseite nach Abschnitt 3 in genau dieser Reihenfolge um.
Die Sektion "Eine Messung, drei Empfehlungen" nutzt die Komponente
Entscheidungsweg aus dem Design-Briefing. Beispiel-Steckbrief mit den
Demo-Daten aus docs/STECKBRIEF_MODUL.md, Abschnitt 7. Prüfe jede
sichtbare Zeile gegen Abschnitt 2, besonders Leitplanke 4 und 6, und
liste Formulierungen, bei denen du unsicher bist.
```

**Abnahme:** Alle drei Empfehlungen sichtbar gleichwertig, Texte geprüft.

### Phase 3: Steckbrief-Seite und Arbeitsplatz-Check

```
Baue /arbeitsplatz-steckbrief: Aufbau des Steckbriefs mit Erklärung jeder
Kennzahl, Entscheidungslogik (wann verbessern, wann automatisieren, wann
beibehalten, wann erst verbessern und dann automatisieren), danach der
Arbeitsplatz-Check nach Abschnitt 4.2. Scoring als getestete Funktion,
die config/workplace_scoring.json liest. Nicht validierte Funktionen mit
"Pilotphase" kennzeichnen.
```

**Abnahme:** Vier Testprofile ergeben jeweils eine andere Empfehlung: verschwendungsreich, repetitiv und bereinigt, repetitiv mit Verschwendung, hochvariabel.

### Phase 4: Perspektivseiten

```
Baue /kapazitaet mit dem ROI-Rechner nach Abschnitt 4.1 (getestete
Rechenfunktion, deutsche Zahlenformate, Pflichthinweis, Mini-Version für
die Startseite), /automatisierung mit Physical-AI-Kontext und dem
Grundsatz "Erst verstehen, dann automatisieren", /gesundheit mit REBA,
Leitmerkmalmethode, CSRD. Jede Perspektivseite endet mit dem Hinweis,
dass alle drei Perspektiven aus derselben Messung stammen, und verlinkt
auf den Steckbrief. Keine Herstellernamen.
```

**Abnahme:** Rechner von Hand nachgerechnet, Seiten gegen Leitplanken geprüft.

### Phase 5: Restliche Seiten

```
Setze /so-funktionierts, /fuer-robotik-anbieter, /pakete und /betriebsrat
um. Pakete: Paket 1 Komplettbegleitung 3.350 €, Paket 2 Analyse und
Validierung 2.150 €, Paket 3 Video-Check 990 €, netto. Paket 1 und 2
enthalten den Arbeitsplatz-Steckbrief mit Empfehlung, Paket 3 die
Messwerte ohne Expertenbewertung (TODO: bestätigen). Betriebsrat-Seite
mit Abschnitt "Automatisierung und Beschäftigung" nach Leitplanke 6.
Keine Rechtsberatung formulieren. Liste alle TODO-Stellen.
```

**Abnahme:** TODO-Liste vorhanden, Paketpreise korrekt, Partnerseite neutral.

### Phase 6: Formular und Pflichtseiten

```
Formular auf /pilot mit Auswahl "Ich bin: Hersteller / Robotik-Anbieter
oder Integrator". Felder: Name, Unternehmen, Funktion, E-Mail, Telefon
optional, Anzahl Arbeitsplätze, Interesse (Kapazität, Automatisierung,
Gesundheit), Freitext. Backend POST /api/v1/contact mit Validierung,
Honeypot, Rate-Limit. /impressum und /datenschutz mit markierten
Platzhaltern.
```

**Abnahme:** Testanfragen aus beiden Zielgruppen kommen an.

### Phase 7: Qualität und Go-live-Vorbereitung

```
Lighthouse für alle Seiten, alles unter 90 beheben. Mobil ab 360 px,
Kontraste, Alt-Texte, Tastaturbedienung. Cookieloses Analytics per
Umgebungsvariable, standardmäßig aus. noindex bleibt bis zur Freigabe.
Go-live-Checkliste erstellen.
```

**Abnahme:** Lighthouse-Bericht und Checkliste.

---

## 7. Offene Entscheidungen

1. **Markttest:** Gespräche mit drei bis fünf Robotik-Anbietern oder Integratoren. Partnerseite erst verlinken, wenn mindestens zwei Interesse bestätigen.
2. **Rolle gegenüber Anbietern:** Empfehlungsprovision, Auftragsanalyse oder rein neutral. Muss gegenüber Endkunden offengelegt werden.
3. **Paket 3:** Enthält es eine automatische Empfehlung ohne Expertenbewertung oder nur Messwerte? Empfehlung: nur Messwerte plus Arbeitsplatz-Check, die Empfehlung gibt es ab Paket 2.
4. **Veröffentlichung:** noindex, bis Name und Projekt intern geklärt sind.
5. **Domain und Designsystem:** siehe Design-Briefing.
6. **Rechtstexte:** durch Anwalt oder Generator.
7. **Robotik-Trainingsdaten:** nicht auf der Website. Widerspricht dem Betriebsrat-Versprechen und bräuchte eigene Rechtsgrundlage und Einwilligung.
