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
    expect(w.euroAuto).toEqual([49000, 69000])
    expect(euroGerundet(w.euroVerbesserung!)).toBe('15.000 €')
  })

  it('REBA-Stufen', () => {
    expect(rebaStufe(3.4)).toBe('niedrig')
    expect(rebaStufe(5.8)).toBe('mittel')
    expect(rebaStufe(9.1)).toBe('hoch')
  })
})
