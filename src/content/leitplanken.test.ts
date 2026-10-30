/**
 * Guidelines of WEBSITE_PLAN §2 for all visible website texts in src/content
 * (internal design drafts and the styleguide excluded).
 */
import { describe, expect, it } from 'vitest'
import { config } from '../lib/scoring'
import { automatisierung } from './automatisierung'
import { betriebsrat } from './betriebsrat'
import { gesundheit } from './gesundheit'
import { kapazitaet } from './kapazitaet'
import { pakete } from './pakete'
import { perspektiven } from './perspektiven'
import { pilot } from './pilot'
import { robotikAnbieter } from './robotikAnbieter'
import { soFunktionierts } from './soFunktionierts'
import { startseite } from './startseite'
import { steckbrief } from './steckbrief'

const SEITEN = { startseite, steckbrief, kapazitaet, automatisierung, gesundheit, perspektiven, soFunktionierts, robotikAnbieter, pakete, betriebsrat, pilot }

function texte(x: unknown): string[] {
  if (typeof x === 'string') return [x]
  if (typeof x === 'function') {
    try {
      return [String((x as (...a: unknown[]) => string)(50, 220, 50))]
    } catch {
      return []
    }
  }
  if (Array.isArray(x)) return x.flatMap(texte)
  if (x && typeof x === 'object') return Object.values(x).flatMap(texte)
  return []
}

/** Well-known robot and automation manufacturers; none may appear (guideline 3). */
const HERSTELLER = /\b(KUKA|ABB|Fanuc|Yaskawa|Universal Robots|Stäubli|Kawasaki|Denso|Franka|Boston Dynamics|Figure AI|Tesla|Agility|Siemens|Bosch Rexroth|Festo|Omron|Epson|Doosan|Techman|Neura)\b/i
const VERBOTEN = /Personal einsparen|Mitarbeiter ersetzen|Leistung messen|schneller arbeiten|freisetz|DSGVO-konform/i

describe.each(Object.entries(SEITEN))('Leitplanken: %s', (_name, inhalt) => {
  const alle = texte(inhalt)
  it('keine Gedankenstriche (1)', () => expect(alle.filter((s) => /[—–]/.test(s))).toEqual([]))
  it('keine Herstellernamen (3)', () => expect(alle.filter((s) => HERSTELLER.test(s))).toEqual([]))
  it('keine verbotenen Formulierungen (6)', () => expect(alle.filter((s) => VERBOTEN.test(s))).toEqual([]))
})

describe('Automatisierung', () => {
  it('jeder Typ der Konfiguration hat eine Beschreibung, keine überzählige', () => {
    expect(Object.keys(automatisierung.typen.beschreibung).sort()).toEqual(config.automatisierungstypen.regeln.map((r) => r.id).sort())
  })
})
