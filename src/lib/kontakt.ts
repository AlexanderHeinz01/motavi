/**
 * Contact form /pilot: validation and request body for POST /api/v1/contact
 * (motavi-backend: backend/app/schemas/kontakt.py, the same rules).
 */
export type Zielgruppe = 'hersteller' | 'anbieter'
export type Interesse = 'kapazitaet' | 'automatisierung' | 'gesundheit'

export interface KontaktFormular {
  zielgruppe: Zielgruppe | ''
  name: string
  unternehmen: string
  funktion: string
  email: string
  telefon: string
  anzahl: string
  interesse: Interesse[]
  nachricht: string
  /** honeypot, hidden from people */
  website: string
}

export type Fehler = Partial<Record<'zielgruppe' | 'name' | 'unternehmen' | 'email' | 'telefon' | 'anzahl' | 'nachricht', true>>

export const LEER: KontaktFormular = {
  zielgruppe: '', name: '', unternehmen: '', funktion: '', email: '', telefon: '', anzahl: '', interesse: [], nachricht: '', website: '',
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/
const TELEFON = /^[0-9 +()/.-]{5,40}$/

export function validieren(f: KontaktFormular): Fehler {
  const e: Fehler = {}
  if (!f.zielgruppe) e.zielgruppe = true
  if (f.name.trim().length < 2) e.name = true
  if (f.unternehmen.trim().length < 2) e.unternehmen = true
  if (!EMAIL.test(f.email.trim())) e.email = true
  if (f.telefon.trim() && !TELEFON.test(f.telefon.trim())) e.telefon = true
  if (f.anzahl.trim() && !/^[1-9][0-9]{0,5}$/.test(f.anzahl.trim())) e.anzahl = true
  if (f.nachricht.length > 4000) e.nachricht = true
  return e
}

/** Request body: empty optional fields are left out. */
export function anfrage(f: KontaktFormular): Record<string, unknown> {
  const body: Record<string, unknown> = {
    zielgruppe: f.zielgruppe,
    name: f.name.trim(),
    unternehmen: f.unternehmen.trim(),
    email: f.email.trim(),
    interesse: f.interesse,
    website: f.website,
  }
  if (f.funktion.trim()) body.funktion = f.funktion.trim()
  if (f.telefon.trim()) body.telefon = f.telefon.trim()
  if (f.anzahl.trim()) body.anzahl_arbeitsplaetze = Number(f.anzahl.trim())
  if (f.nachricht.trim()) body.nachricht = f.nachricht.trim()
  return body
}

/** Target group from the link, e.g. /pilot?ich=anbieter from the partner page. */
export function zielgruppeAusUrl(search: string): Zielgruppe | '' {
  const ich = new URLSearchParams(search).get('ich')
  return ich === 'anbieter' || ich === 'hersteller' ? ich : ''
}

export type SendeErgebnis = 'ok' | 'zu_viele' | 'fehler'

export async function senden(f: KontaktFormular, basis: string, fetchFn: typeof fetch = fetch): Promise<SendeErgebnis> {
  try {
    const r = await fetchFn(`${basis}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anfrage(f)),
    })
    if (r.status === 202 || r.ok) return 'ok'
    return r.status === 429 ? 'zu_viele' : 'fehler'
  } catch {
    return 'fehler'
  }
}
