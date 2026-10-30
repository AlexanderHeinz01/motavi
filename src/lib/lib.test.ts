import { describe, expect, it } from 'vitest'
import { empfehlungAus, istVorrangig } from './empfehlung'
import { euro, prozent, zahl } from './format'

describe('empfehlungAus (STECKBRIEF_MODUL §5.3)', () => {
  it.each([
    [62, 71, 'improve-then-automate'],
    [50, 60, 'improve-then-automate'],
    [55, 40, 'improve'],
    [30, 75, 'automate'],
    [49, 59, 'keep'],
  ] as const)('Verbesserung %i, Automatisierung %i -> %s', (v, a, expected) => {
    expect(empfehlungAus(v, a)).toBe(expected)
  })

  it('markiert hohe Belastung als vorrangig', () => {
    expect(istVorrangig(8)).toBe(true)
    expect(istVorrangig(7.9)).toBe(false)
  })
})

describe('deutsche Zahlenformate', () => {
  it('Zahlen', () => {
    expect(zahl(38.4, 1)).toBe('38,4')
    expect(zahl(23400)).toBe('23.400')
  })
  it('Prozent, untrennbar', () => expect(prozent(0.14)).toBe('14\u00a0%'))
  it('Euro, untrennbar', () => expect(euro(15033.3)).toBe('15.033\u00a0€'))
})
