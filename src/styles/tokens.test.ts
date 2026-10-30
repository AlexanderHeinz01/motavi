/**
 * Automated contrast test for all token combinations (DESIGN_BRIEF.md §3):
 * text at least 4.5:1 (also for large numbers), lines, symbols and graphics
 * at least 3:1; components use only --*-ink and --path-* tokens.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { blend, contrast, parseBlock, resolve, type TokenMap } from './contrast'

const root = fileURLToPath(new URL('../..', import.meta.url))
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8')
const light: TokenMap = parseBlock(css, ':root')
const inverseOverrides: TokenMap = parseBlock(css, '.surface-inverse')
const inverse: TokenMap = { ...light, ...inverseOverrides }

/** Hex value of `token` in a context. */
const hex = (scope: TokenMap, token: string) => resolve(scope[token], light, scope)

const TEXT_MIN = 4.5
const GRAPHIC_MIN = 3
/** Label variant "ruhig": tint of the path colour at 10 to 12 % (§3 "Empfehlungs-Labels"). */
const TINTS = [0.1, 0.12]

const INK = ['--data-ink', '--risk-ink', '--gain-ink', '--warn-ink']
const PATHS = ['--path-improve', '--path-automate', '--path-keep']
const BRIGHT = ['--data', '--risk', '--gain', '--warn']

const fmt = (r: number) => r.toFixed(2).replace('.', ',') + ':1'

interface Combo {
  name: string
  fg: string
  bg: string
  min: number
}

function combos(): Combo[] {
  const list: Combo[] = []
  const add = (name: string, fg: string, bg: string, min = TEXT_MIN) => list.push({ name, fg, bg, min })

  // Light ground: --bg and --bg-subtle
  for (const surface of ['--bg', '--bg-subtle']) {
    const bg = hex(light, surface)
    for (const t of ['--text', '--text-muted', '--primary', ...INK, ...PATHS]) {
      add(`hell: ${t} auf ${surface}`, hex(light, t), bg)
    }
    // Label "ruhig": text in --text on the tint, path colour for icon, dot and border
    for (const p of PATHS) {
      for (const a of TINTS) {
        const tint = blend(hex(light, p), a, bg)
        add(`hell, Label ruhig: --text auf ${p}-Tönung ${a * 100} % über ${surface}`, hex(light, '--text'), tint)
        add(`hell, Label ruhig: ${p} (Icon, Rahmen) auf eigener Tönung ${a * 100} % über ${surface}`, hex(light, p), tint, GRAPHIC_MIN)
      }
    }
  }
  // Highlight background
  for (const t of ['--text', '--primary']) add(`hell: ${t} auf --primary-soft`, hex(light, t), hex(light, '--primary-soft'))
  // White text on filled buttons
  for (const fill of ['--primary', '--primary-hover']) {
    add(`hell: --text-inverse auf ${fill}-Fläche`, hex(light, '--text-inverse'), hex(light, fill))
  }
  // Label "kräftig": --on-path on the full path fill
  for (const p of PATHS) add(`hell, Label kräftig: --on-path auf ${p}-Fläche`, hex(light, '--on-path'), hex(light, p))

  // Dark ground: .surface-inverse on --bg-inverse
  const dark = hex(inverse, '--bg-inverse')
  for (const t of ['--text-inverse', ...INK, ...PATHS]) add(`dunkel: ${t} auf --bg-inverse`, hex(inverse, t), dark)
  for (const p of PATHS) {
    for (const a of TINTS) {
      const tint = blend(hex(inverse, p), a, dark)
      add(`dunkel, Label ruhig: --text-inverse auf ${p}-Tönung ${a * 100} %`, hex(inverse, '--text-inverse'), tint)
      add(`dunkel, Label ruhig: ${p} (Icon, Rahmen) auf eigener Tönung ${a * 100} %`, hex(inverse, p), tint, GRAPHIC_MIN)
    }
    // Never white on bright cyan: --on-path switches to dark text
    add(`dunkel, Label kräftig: --on-path auf ${p}-Fläche`, hex(inverse, '--on-path'), hex(inverse, p))
  }

  // Graphics (lines, symbols, skeleton): 3:1 on every ground they appear on
  for (const t of [...INK, ...PATHS]) {
    add(`Grafik hell: ${t} auf --bg`, hex(light, t), hex(light, '--bg'), GRAPHIC_MIN)
    add(`Grafik hell: ${t} auf --bg-subtle`, hex(light, t), hex(light, '--bg-subtle'), GRAPHIC_MIN)
    add(`Grafik dunkel: ${t} auf --bg-inverse`, hex(inverse, t), dark, GRAPHIC_MIN)
  }
  return list
}

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
  it.each(combos().map((c) => [`${c.name} (${fmt(contrast(c.fg, c.bg))}, min. ${fmt(c.min)})`, c] as const))(
    '%s',
    (_name, c) => {
      expect(contrast(c.fg, c.bg)).toBeGreaterThanOrEqual(c.min)
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

  // The dashboard (src/app) still draws its charts with fixed hex colours;
  // aligning it is a separate step (DESIGN_BRIEF §10.4). Website code must not.
  const website = checked.filter((p) => /^src\/(website|ui|content|visuals|styles)\//.test(rel(p)))
  it.each(website.map(rel))('%s: keine festen bright-Hexwerte', (file) => {
    const text = readFileSync(join(root, file), 'utf8').toLowerCase()
    expect(brightHex.filter((h) => text.includes(h))).toEqual([])
  })
})
