import { describe, expect, it } from 'vitest'
import { analyticsConfig, analyticsEinbinden } from './analytics'

/** Minimal document: enough for createElement, head.appendChild and the duplicate check. */
function fakeDocument() {
  const scripts: Record<string, unknown>[] = []
  return {
    scripts,
    createElement: () => ({ dataset: {} as Record<string, string> }),
    querySelector: () => (scripts.length ? scripts[0] : null),
    head: { appendChild: (s: Record<string, unknown>) => scripts.push(s) },
  }
}

describe('cookieloses Analytics', () => {
  it('standardmäßig aus', () => {
    expect(analyticsConfig({})).toBeNull()
    expect(analyticsConfig({ VITE_ANALYTICS_SRC: 'https://stats.example.eu/script.js' })).toBeNull()
  })
  it('nur https-Quellen', () => {
    expect(analyticsConfig({ VITE_ANALYTICS_SRC: 'http://stats.example.eu/s.js', VITE_ANALYTICS_DOMAIN: 'motavi.ai' })).toBeNull()
    expect(analyticsConfig({ VITE_ANALYTICS_SRC: 'https://stats.example.eu/s.js', VITE_ANALYTICS_DOMAIN: 'motavi.ai' })).toEqual({
      src: 'https://stats.example.eu/s.js',
      domain: 'motavi.ai',
    })
  })
  it('bindet das Skript einmal ein, ohne Konfiguration gar nicht', () => {
    const doc = fakeDocument()
    const cfg = { src: 'https://stats.example.eu/s.js', domain: 'motavi.ai' }
    expect(analyticsEinbinden(null, doc as unknown as Document)).toBe(false)
    expect(doc.scripts).toHaveLength(0)
    expect(analyticsEinbinden(cfg, doc as unknown as Document)).toBe(true)
    expect(analyticsEinbinden(cfg, doc as unknown as Document)).toBe(false)
    expect(doc.scripts).toHaveLength(1)
    expect(doc.scripts[0]).toMatchObject({ src: cfg.src, defer: true, dataset: { domain: 'motavi.ai' } })
  })
})
