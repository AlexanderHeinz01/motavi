/**
 * All checked token combinations (DESIGN_BRIEF §3): text at least 4.5:1,
 * lines, symbols and graphics at least 3:1. Single source for the contrast
 * test (tokens.test.ts) and the report on /_styleguide.
 */
import css from './tokens.css?raw'
import { blend, contrast, parseBlock, resolve, type TokenMap } from './contrast'

export const light: TokenMap = parseBlock(css, ':root')
export const inverseOverrides: TokenMap = parseBlock(css, '.surface-inverse')
export const inverse: TokenMap = { ...light, ...inverseOverrides }

/** Hex value of `token` in a context (light or .surface-inverse). */
export const hex = (scope: TokenMap, token: string) => resolve(scope[token], light, scope)

export const TEXT_MIN = 4.5
export const GRAPHIC_MIN = 3
/** Label variant "ruhig": tint of the path colour at 10 to 12 % */
const TINTS = [0.1, 0.12]

export const INK = ['--data-ink', '--risk-ink', '--gain-ink', '--warn-ink']
export const PATHS = ['--path-improve', '--path-automate', '--path-keep']
export const BRIGHT = ['--data', '--risk', '--gain', '--warn']

export interface Combo {
  gruppe: string
  name: string
  fg: string
  bg: string
  /** Required minimum: 4.5 for text, 3 for graphics */
  min: number
  ratio: number
}

export function kombinationen(): Combo[] {
  const list: Combo[] = []
  const add = (gruppe: string, name: string, fg: string, bg: string, min = TEXT_MIN) =>
    list.push({ gruppe, name, fg, bg, min, ratio: contrast(fg, bg) })

  for (const surface of ['--bg', '--bg-subtle']) {
    const bg = hex(light, surface)
    for (const t of ['--text', '--text-muted', '--primary', ...INK, ...PATHS]) {
      add('Text auf hellem Grund', `${t} auf ${surface}`, hex(light, t), bg)
    }
    // Label "ruhig": text in --text on the tint, path colour for icon, dot and border
    for (const p of PATHS) {
      for (const a of TINTS) {
        const tint = blend(hex(light, p), a, bg)
        add('Empfehlungs-Label ruhig', `--text auf ${p}-Tönung ${a * 100} % über ${surface}`, hex(light, '--text'), tint)
        add('Empfehlungs-Label ruhig', `${p} (Icon, Rahmen) auf eigener Tönung ${a * 100} % über ${surface}`, hex(light, p), tint, GRAPHIC_MIN)
      }
    }
    // Form elements: only on --bg and --bg-subtle
    add('Formularelemente', `--border-strong (Rahmen, Schieberegler-Spur) auf ${surface}`, hex(light, '--border-strong'), bg, GRAPHIC_MIN)
    add('Formularelemente', `--text-muted (Rahmen bei Hover) auf ${surface}`, hex(light, '--text-muted'), bg, GRAPHIC_MIN)
    add('Formularelemente', `--primary (Rahmen bei Fokus) auf ${surface}`, hex(light, '--primary'), bg, GRAPHIC_MIN)
    add('Formularelemente', `--error-ink (Fehlertext) auf ${surface}`, hex(light, '--error-ink'), bg)
    add('Formularelemente', `--error-ink (Fehlerrahmen, Icon) auf ${surface}`, hex(light, '--error-ink'), bg, GRAPHIC_MIN)
  }
  for (const t of ['--text', '--primary']) {
    add('Buttons und Hervorhebung', `${t} auf --primary-soft`, hex(light, t), hex(light, '--primary-soft'))
  }
  for (const fill of ['--primary', '--primary-hover']) {
    add('Buttons und Hervorhebung', `--text-inverse auf ${fill}-Fläche`, hex(light, '--text-inverse'), hex(light, fill))
  }
  for (const p of PATHS) add('Empfehlungs-Label kräftig', `--on-path auf ${p}-Fläche (hell)`, hex(light, '--on-path'), hex(light, p))

  const dark = hex(inverse, '--bg-inverse')
  for (const t of ['--text-inverse', ...INK, ...PATHS]) add('Dunkler Grund (.surface-inverse)', `${t} auf --bg-inverse`, hex(inverse, t), dark)
  for (const p of PATHS) {
    for (const a of TINTS) {
      const tint = blend(hex(inverse, p), a, dark)
      add('Dunkler Grund (.surface-inverse)', `Label ruhig: --text-inverse auf ${p}-Tönung ${a * 100} %`, hex(inverse, '--text-inverse'), tint)
      add('Dunkler Grund (.surface-inverse)', `Label ruhig: ${p} (Icon, Rahmen) auf eigener Tönung ${a * 100} %`, hex(inverse, p), tint, GRAPHIC_MIN)
    }
    // Never white on bright cyan: --on-path switches to dark text
    add('Dunkler Grund (.surface-inverse)', `Label kräftig: --on-path auf ${p}-Fläche`, hex(inverse, '--on-path'), hex(inverse, p))
  }

  for (const t of [...INK, ...PATHS]) {
    add('Grafik (Linien, Symbole, Skelett)', `${t} auf --bg`, hex(light, t), hex(light, '--bg'), GRAPHIC_MIN)
    add('Grafik (Linien, Symbole, Skelett)', `${t} auf --bg-subtle`, hex(light, t), hex(light, '--bg-subtle'), GRAPHIC_MIN)
    add('Grafik (Linien, Symbole, Skelett)', `${t} auf --bg-inverse`, hex(inverse, t), dark, GRAPHIC_MIN)
  }
  return list
}

/** 4.946 -> "4,95:1" */
export const fmtRatio = (r: number) => r.toFixed(2).replace('.', ',') + ':1'
