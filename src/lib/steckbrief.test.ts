import { describe, expect, it } from 'vitest'
import { annahmen, demoSteckbriefe } from '../content/demo/steckbriefe'
import { empfehlungAus } from './empfehlung'
import { begruendung, euroGerundet, rebaStufe, wirtschaft } from './steckbrief'

describe('Steckbrief: abgeleitete Aussagen', () => {
  it.each(demoSteckbriefe.map((d) => [d.path, d] as const))('%s: Begründung hat zwei bis drei Punkte mit Messwert', (_p, { data, path }) => {
    const g = begruendung(data, path)
    expect(g.length).toBeGreaterThanOrEqual(2)
    expect(g.length).toBeLessThanOrEqual(3)
    // every reason rests on a number or on the measured absence of a cycle
    for (const z of g) expect(/\d|Zyklus/.test(z)).toBe(true)
  })

  it.each(demoSteckbriefe.map((d) => [d.path, d] as const))('%s: Empfehlung folgt aus den Scores', (_p, { data, path }) => {
    expect(empfehlungAus(data.verbesserungs_score, data.automatisierungs_score)).toBe(path)
  })

  it('Wirtschaftlichkeit nach §5.5', () => {
    const [ita] = demoSteckbriefe
    const w = wirtschaft(ita.data, annahmen)
    // 41 min x 2 shifts x 220 days / 60 x 50 €
    expect(w.euroVerbesserung).toBeCloseTo(15033.33, 1)
    // 980 to 1,380 h x 50 €, net of the running costs of Pick and Place (15 to 25 %)
    expect(w.euroAuto).toEqual([980 * 50 * 0.75, 1380 * 50 * 0.85])
    expect(euroGerundet(w.euroVerbesserung!)).toBe('15.000 €')
  })

  it('Stufen des Haltungsindex (1 bis 10)', () => {
    expect(rebaStufe(3.4)).toBe('niedrig')
    expect(rebaStufe(5.8)).toBe('mittel')
    expect(rebaStufe(6.0)).toBe('hoch')
    expect(rebaStufe(7.99)).toBe('hoch')
    expect(rebaStufe(9.1)).toBe('sehr hoch')
  })
})
