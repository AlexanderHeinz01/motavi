import type { Path } from './empfehlungen'
import type { Accent, PageMeta } from './types'

/**
 * Hero drafts for design phase D0 (DESIGN_BRIEF §9). Internal pages,
 * noindex, not in navigation or sitemap.
 */

export interface HeroWert {
  label: string
  accent: Accent
  value: string
  unit: string
}

/** The three values of the brand promise (DESIGN_BRIEF §2), invented example values. */
export const heroWerte: HeroWert[] = [
  { label: 'Zeit', accent: 'data-ink', value: '38,4 s', unit: 'je Zyklus' },
  { label: 'Kosten', accent: 'gain-ink', value: '23.400 €', unit: 'pro Jahr' },
  { label: 'Belastung', accent: 'risk-ink', value: 'REBA 5,8', unit: 'Mittelwert' },
]

/** Guideline 5: example numbers are marked as such. */
export const beispielHinweis = 'Beispielwerte'

export const zeichnung = {
  ariaLabel:
    'Technische Zeichnung: anonymisiertes Bewegungsskelett an einer Werkbank, mit Bahnkurve der Hand, Greifraum und Zykluszeit.',
  zykluszeit: '38,4 s je Zyklus',
  zykluszeitKurz: '38,4 s',
  potenzial: 'Potenzial',
  schicht: 'Schicht',
  // Trunk inclination of bendPose (shoulder midpoint against hip midpoint)
  rumpfwinkel: '51°',
}

export const entscheidung = {
  messung: 'Eine Messung',
  messungText: 'Zeit, Kosten und Belastung je Arbeitsplatz',
  wege: [
    { path: 'improve', text: 'Verschwendung und Belastung lassen sich durch Gestaltung lösen.' },
    { path: 'automate', text: 'Hohe Wiederholung, gleichförmige Zyklen, wenige Varianten.' },
    { path: 'keep', text: 'Viele Varianten, kurze Zyklen ohne Muster, geringe Belastung.' },
  ] satisfies { path: Path; text: string }[],
}

export const entwuerfe: Record<'a' | 'b' | 'c', { meta: PageMeta; name: string; note: string }> = {
  a: {
    meta: { title: 'Entwurf Hero A: Datenblatt', description: 'Interner Designentwurf.' },
    name: 'Entwurf A: Datenblatt',
    note: 'Text links, technische Zeichnung rechts. Die drei Werte stehen wie in einem Datenblatt unter der Zeichnung.',
  },
  b: {
    meta: { title: 'Entwurf Hero B: Entscheidungsweg', description: 'Interner Designentwurf.' },
    name: 'Entwurf B: Entscheidungsweg',
    note: 'Zentrierter Text, darunter eine Messung, die sich in drei gleichwertige Wege teilt.',
  },
  c: {
    meta: { title: 'Entwurf Hero C: Messwerte', description: 'Interner Designentwurf.' },
    name: 'Entwurf C: Messwerte',
    note: 'Kurzer Kopf, darunter drei große Messwerte, jeder mit seinem Bewegungsdetail.',
  },
}

/** D2 review page for the skeleton visual (internal, noindex). */
export const skelettEntwurf = {
  meta: { title: 'Entwurf Skelett-Visual', description: 'Interner Designentwurf.' } satisfies PageMeta,
  name: 'D2: Skelett-Visual',
  note: 'Beide Bewegungen live und zu drei festen Zeitpunkten, darunter die statische Variante für Abschnittstrenner.',
  szenen: { greifen: 'Greifen und Platzieren (Hero)', buecken: 'Bücken (Gesundheit)' },
  live: 'Live, Schleife aus fünf Zyklen',
  zeitpunkte: [
    { sekunden: 1.1, text: '1,1 s: erster Zyklus, die Hand greift in den Behälter, die Bahn zeichnet sich nach.' },
    { sekunden: 6.6, text: '6,6 s: dritter Zyklus, zwei Bahnen liegen schon, leicht verschieden wie echte Wiederholungen.' },
    { sekunden: 10.4, text: '10,4 s: nach drei Zyklen stehen Zeit, Kosten und Belastung als Maßangaben.' },
  ],
  trenner: 'Statisch: Abschnittstrenner',
}

/** D2b review page for the Steckbrief preview (internal, noindex). */
export const steckbriefEntwurf = {
  meta: { title: 'Entwurf Steckbrief-Vorschau', description: 'Interner Designentwurf.' } satisfies PageMeta,
  name: 'D2b: Steckbrief-Vorschau',
  note: 'Hell für die Website, dunkel für den Dashboard-Tab. Gleiche Struktur, gleiche Komponenten.',
  hell: 'Hell (Website), vollständig mit Umschalter',
  dunkel: 'Dunkel (Dashboard-Tab), vollständig mit Umschalter',
  vergleich: 'Alle vier Empfehlungen nebeneinander, kompakt',
  vergleichDunkel: 'Alle vier Empfehlungen, kompakt, dunkel',
  labels: 'Empfehlungs-Labels im Vergleich',
}
