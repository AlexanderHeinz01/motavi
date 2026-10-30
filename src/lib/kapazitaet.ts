/**
 * ROI calculator "gewonnene Kapazität" (WEBSITE_PLAN §4.1):
 *
 *   minuten_frei  = nws_min * anteil / 100
 *   stunden_jahr  = arbeitsplaetze * minuten_frei * schichten * tage / 60
 *   euro_jahr     = stunden_jahr * stundensatz
 *   vollzeit_aeq  = stunden_jahr / 1650
 */
export interface KapazitaetEingaben {
  /** Number of workplaces */
  arbeitsplaetze: number
  /** Non value-adding movement per workplace and shift, minutes */
  nwsMinuten: number
  /** Share of it avoidable by design, percent */
  vermeidbarProzent: number
  schichtenProTag: number
  arbeitstageProJahr: number
  /** Full cost per hour, euro */
  stundensatz: number
}

/** Working hours of a full-time position per year (§4.1). */
export const STUNDEN_JE_VOLLZEITSTELLE = 1650

/** Defaults of §4.1. */
export const STANDARD_EINGABEN: KapazitaetEingaben = {
  arbeitsplaetze: 10,
  nwsMinuten: 45,
  vermeidbarProzent: 50,
  schichtenProTag: 2,
  arbeitstageProJahr: 220,
  stundensatz: 50,
}

export interface KapazitaetErgebnis {
  minutenFrei: number
  stundenJahr: number
  euroJahr: number
  vollzeitstellen: number
}

export function kapazitaet(e: KapazitaetEingaben): KapazitaetErgebnis {
  for (const [k, v] of Object.entries(e)) {
    if (!Number.isFinite(v) || v < 0) throw new Error(`Ungültiger Wert für ${k}: ${v}`)
  }
  if (e.vermeidbarProzent > 100) throw new Error('vermeidbarProzent höchstens 100')
  const minutenFrei = (e.nwsMinuten * e.vermeidbarProzent) / 100
  const stundenJahr = (e.arbeitsplaetze * minutenFrei * e.schichtenProTag * e.arbeitstageProJahr) / 60
  return {
    minutenFrei,
    stundenJahr,
    euroJahr: stundenJahr * e.stundensatz,
    vollzeitstellen: stundenJahr / STUNDEN_JE_VOLLZEITSTELLE,
  }
}
