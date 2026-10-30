/**
 * Automated contrast test for all token combinations (DESIGN_BRIEF.md §3):
 * text at least 4.5:1 (also for large numbers), lines, symbols and graphics
 * at least 3:1; components use only --*-ink and --path-* tokens.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseBlock, resolve } from './contrast'
import { BRIGHT, INK, PATHS, fmtRatio, hex, inverse, inverseOverrides, kombinationen, light } from './contrastReport'

const root = fileURLToPath(new URL('../..', import.meta.url))

describe('Token-Werte entsprechen docs/DESIGN_BRIEF.md §3', () => {
  const brief = readFileSync(join(root, 'docs/DESIGN_BRIEF.md'), 'utf8')
  const block = brief.split('```css')[1].split('```')[0]
  const briefLight = parseBlock(block, ':root')
  const briefInverse = { ...briefLight, ...parseBlock(block, '.surface-inverse') }

  it.each(Object.keys(briefLight))('hell: %s', (token) => {
    expect(hex(light, token)).toBe(resolve(briefLight[token], briefLight))
  })
  it.each(Object.keys(parseBlock(block, '.surface-inverse')))('dunkel (.surface-inverse): %s', (token) => {
    expect(hex(inverse, token)).toBe(resolve(briefInverse[token], briefLight, briefInverse))
  })
})

describe('.surface-inverse schaltet alle ink- und path-Tokens um', () => {
  it.each([...INK, ...PATHS])('%s', (token) => {
    expect(inverseOverrides[token]).toBeDefined()
  })
})

describe('Kontraste: Text ≥ 4,5:1, Grafik ≥ 3:1', () => {
  it.each(kombinationen().map((c) => [`${c.gruppe}: ${c.name} (${fmtRatio(c.ratio)}, min. ${fmtRatio(c.min)})`, c] as const))(
    '%s',
    (_name, c) => {
      expect(c.ratio).toBeGreaterThanOrEqual(c.min)
    },
  )
})

describe('Komponenten nutzen nur ink- und path-Tokens', () => {
  const brightHex = BRIGHT.map((t) => hex(light, t))
  const files: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(tsx?|css)$/.test(name) && !/\.test\.ts$/.test(name)) files.push(p)
    }
  }
  walk(join(root, 'src'))
  const rel = (p: string) => relative(root, p).replace(/\\/g, '/')
  // Exceptions: the token definition itself and the old start page (kept
  // only for comparison until the relaunch replaces it).
  const checked = files.filter((p) => !['src/styles/tokens.css'].includes(rel(p)) && !rel(p).startsWith('src/marketing/'))

  it.each(checked.map(rel))('%s: keine var(--data|risk|gain|warn)', (file) => {
    const text = readFileSync(join(root, file), 'utf8')
    expect(text.match(/var\(--(data|risk|gain|warn)\)/g) ?? []).toEqual([])
  })

  // Form errors use --error-ink, never --risk-ink (DESIGN_BRIEF §3 "Regeln")
  const forms = checked.filter((p) => rel(p).startsWith('src/ui/form/'))
  it.each(forms.map(rel))('%s: Formularfehler nie mit risk-ink', (file) => {
    expect(readFileSync(join(root, file), 'utf8').match(/risk-ink/g) ?? []).toEqual([])
  })

  // The dashboard (src/app) still draws its charts with fixed hex colours;
  // aligning it is a separate step (DESIGN_BRIEF §10.4). Website code must not.
  const website = checked.filter((p) => /^src\/(website|ui|content|visuals|styles)\//.test(rel(p)))
  it.each(website.map(rel))('%s: keine festen bright-Hexwerte', (file) => {
    const text = readFileSync(join(root, file), 'utf8').toLowerCase()
    expect(brightHex.filter((h) => text.includes(h))).toEqual([])
  })
})
