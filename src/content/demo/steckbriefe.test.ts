import { describe, expect, it } from 'vitest'
import { empfehlungen } from '../empfehlungen'
import { empfehlungAus, istVorrangig } from '../../lib/empfehlung'
import { demoSteckbriefe } from './steckbriefe'

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

describe.each(demoSteckbriefe.map((d) => [d.data.arbeitsplatz, d] as const))('%s', (_name, { path, data }) => {
  it('Empfehlung folgt aus den Scores (§5.3) und passt zum Umschalter', () => {
    expect(empfehlungAus(data.verbesserungs_score, data.automatisierungs_score)).toBe(path)
    expect(data.empfehlung).toBe(empfehlungen[path])
    expect(data.empfehlung_id).toBe(path)
  })
  it('ist als Beispiel im Exportformat 1.0 gekennzeichnet', () => {
    expect(data.beispiel).toBe(true)
    expect(data.format).toBe('motavi-arbeitsplatz-steckbrief')
    expect(data.schema_version).toBe('1.0')
    expect(data.arbeitsplatz.startsWith('Beispiel')).toBe(true)
  })
  it('Vorrang-Markierung folgt aus REBA', () => {
    expect(data.vorrangig).toBe(istVorrangig(data.reba_mittel))
  })
  it('Ablaufschritte ergeben 100 % und passen zu den Anteilen je Klasse', () => {
    expect(sum(data.ablaufschritte.map((s) => s.anteil))).toBeCloseTo(1, 5)
    for (const klasse of ['wertschoepfend', 'notwendig', 'verschwendung'] as const) {
      const s = sum(data.ablaufschritte.filter((x) => x.klasse === klasse).map((x) => x.anteil))
      expect(s).toBeCloseTo(data.anteile_ablauf[klasse], 5)
    }
  })
  it('Höhenzonen ergeben 100 %', () => {
    expect(sum(Object.values(data.hoehenzonen))).toBeCloseTo(1, 5)
  })
  it('Zyklen passen in eine Schicht (8 h)', () => {
    if (data.zykluszeit_median_s !== null && data.zyklen_pro_schicht !== null) {
      expect(data.zykluszeit_median_s * data.zyklen_pro_schicht).toBeLessThanOrEqual(8 * 3600)
    }
  })
})
