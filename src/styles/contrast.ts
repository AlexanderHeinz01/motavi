/**
 * WCAG 2.x contrast helpers and a small parser for src/styles/tokens.css.
 * Used by the automated contrast test (tokens.test.ts).
 */

export type TokenMap = Record<string, string>

const HEX = /^#[0-9a-f]{6}$/i

function channels(hex: string): [number, number, number] {
  if (!HEX.test(hex)) throw new Error(`Not a 6-digit hex colour: ${hex}`)
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

export function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Colour `fg` at `alpha` opacity over `bg` (used for tinted label fills). */
export function blend(fg: string, alpha: number, bg: string): string {
  const f = channels(fg)
  const b = channels(bg)
  return (
    '#' +
    f
      .map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  )
}

/** Custom properties declared directly inside the first `selector { … }` block. */
export function parseBlock(css: string, selector: string): TokenMap {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`Block ${selector} not found`)
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  const tokens: TokenMap = {}
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens[m[1]] = m[2].trim().toLowerCase()
  return tokens
}

/** Resolves var(--x) references against `scope` (last wins) to hex values. */
export function resolve(value: string, ...scopes: TokenMap[]): string {
  const ref = value.match(/^var\((--[\w-]+)\)$/)
  if (!ref) return value
  for (const scope of [...scopes].reverse()) {
    if (scope[ref[1]] && scope[ref[1]] !== value) return resolve(scope[ref[1]], ...scopes)
  }
  throw new Error(`Unresolved ${value}`)
}
