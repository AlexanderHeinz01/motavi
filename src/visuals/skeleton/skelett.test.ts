import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { skelettText } from '../../content/skelett'
import { buecken, greifen } from './keyframes'
import { poseAt, px } from './motion'
import { BONES } from './pose'
import SkelettAnimation from './SkelettAnimation'
import SkelettTrenner from './SkelettTrenner'

const szenen = { greifen, buecken }
const laenge = (pose: ReturnType<typeof poseAt>, [a, b]: (typeof BONES)[number]) => {
  const [ax, ay] = px(pose[a])
  const [bx, by] = px(pose[b])
  return Math.hypot(ax - bx, ay - by)
}

describe.each(Object.entries(szenen))('Keyframes %s', (_name, { frames }) => {
  it('Gelenkpositionen sind auf 0 bis 1 normiert', () => {
    for (const f of frames) for (const [x, y] of Object.values(f.pose)) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(1)
    }
  })

  it('Zeiten steigen an und bleiben im Zyklus', () => {
    frames.forEach((f, i) => i > 0 && expect(f.t).toBeGreaterThan(frames[i - 1].t))
    expect(frames[0].t).toBe(0)
    expect(frames[frames.length - 1].t).toBeLessThan(1)
  })

  it('der Zyklus schließt nahtlos', () => {
    expect(poseAt(frames, 0.9999).wristR[0]).toBeCloseTo(poseAt(frames, 0).wristR[0], 3)
  })

  // Natural motion: the legs keep their length, the projected trunk and arms
  // only change by foreshortening (3/4 view), never jump.
  it('Unterschenkel behalten zwischen den Keyframes ihre Länge', () => {
    const shank = BONES.filter(([a]) => a === 'kneeL' || a === 'kneeR')
    for (const bone of shank) {
      const ref = laenge(poseAt(frames, 0), bone)
      for (let t = 0; t < 1; t += 0.01) expect(Math.abs(laenge(poseAt(frames, t), bone) - ref) / ref).toBeLessThan(0.12)
    }
  })

  it('keine Sprünge: Gelenke bewegen sich je 1/100 Zyklus höchstens 3 % der Zeichnung', () => {
    for (let t = 0; t < 1; t += 0.01) {
      const a = poseAt(frames, t)
      const b = poseAt(frames, t + 0.01)
      for (const joint of Object.keys(a) as (keyof typeof a)[]) {
        expect(Math.hypot(a[joint][0] - b[joint][0], a[joint][1] - b[joint][1])).toBeLessThan(0.03)
      }
    }
  })
})

describe('Endzustand ohne Bewegung (Server, reduzierte Bewegung)', () => {
  it.each(['greifen', 'buecken'] as const)('%s zeigt alle drei Werte und den Hinweis Beispielwerte', (szene) => {
    const html = renderToString(createElement(SkelettAnimation, { szene }))
    for (const w of skelettText[szene].werte) expect(html).toContain(w.wert)
    expect(html).toContain(skelettText.beispielwerte.toUpperCase())
    // no pause button without motion
    expect(html).not.toContain(skelettText.anhalten)
  })

  it('Trenner rendert sechs Figuren ohne Gesicht (nur Kopfkontur)', () => {
    const html = renderToString(createElement(SkelettTrenner))
    expect(html.match(/<g stroke=/g)?.length).toBe(6)
  })
})
