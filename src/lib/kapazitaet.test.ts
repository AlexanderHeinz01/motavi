import { describe, expect, it } from 'vitest'
import { euro, zahl } from './format'
import { kapazitaet, STANDARD_EINGABEN } from './kapazitaet'

describe('ROI-Rechner (WEBSITE_PLAN §4.1), von Hand nachgerechnet', () => {
  it('Standardwerte: 10 Plätze, 45 min, 50 %, 2 Schichten, 220 Tage, 50 €', () => {
    // 45 * 50 / 100 = 22,5 min; 10 * 22,5 * 2 * 220 / 60 = 1.650 h; * 50 = 82.500 €; / 1.650 = 1,0
    const r = kapazitaet(STANDARD_EINGABEN)
    expect(r.minutenFrei).toBe(22.5)
    expect(r.stundenJahr).toBe(1650)
    expect(r.euroJahr).toBe(82500)
    expect(r.vollzeitstellen).toBe(1)
  })
  it('ein Platz, eine Schicht: 30 min, 80 %, 250 Tage, 42 €', () => {
    // 30 * 0,8 = 24 min; 1 * 24 * 1 * 250 / 60 = 100 h; * 42 = 4.200 €; / 1.650 = 0,0606
    const r = kapazitaet({ arbeitsplaetze: 1, nwsMinuten: 30, vermeidbarProzent: 80, schichtenProTag: 1, arbeitstageProJahr: 250, stundensatz: 42 })
    expect(r.stundenJahr).toBeCloseTo(100, 9)
    expect(r.euroJahr).toBeCloseTo(4200, 9)
    expect(r.vollzeitstellen).toBeCloseTo(100 / 1650, 9)
  })
  it('drei Schichten, 25 Plätze: 60 min, 40 %, 230 Tage, 55 €', () => {
    // 24 min; 25 * 24 * 3 * 230 / 60 = 6.900 h; * 55 = 379.500 €; / 1.650 = 4,18
    const r = kapazitaet({ arbeitsplaetze: 25, nwsMinuten: 60, vermeidbarProzent: 40, schichtenProTag: 3, arbeitstageProJahr: 230, stundensatz: 55 })
    expect(r.stundenJahr).toBeCloseTo(6900, 9)
    expect(r.euroJahr).toBeCloseTo(379500, 9)
    expect(zahl(r.vollzeitstellen, 1)).toBe('4,2')
  })
  it('null vermeidbar ergibt null', () => {
    expect(kapazitaet({ ...STANDARD_EINGABEN, vermeidbarProzent: 0 }).stundenJahr).toBe(0)
  })
  it('ungültige Eingaben werden abgelehnt', () => {
    expect(() => kapazitaet({ ...STANDARD_EINGABEN, arbeitsplaetze: -1 })).toThrow()
    expect(() => kapazitaet({ ...STANDARD_EINGABEN, vermeidbarProzent: 120 })).toThrow()
    expect(() => kapazitaet({ ...STANDARD_EINGABEN, stundensatz: Number.NaN })).toThrow()
  })
  it('deutsche Zahlenformate', () => {
    const r = kapazitaet(STANDARD_EINGABEN)
    expect(zahl(r.stundenJahr)).toBe('1.650')
    expect(euro(r.euroJahr)).toBe('82.500 €')
    expect(zahl(r.vollzeitstellen, 1)).toBe('1,0')
  })
})
