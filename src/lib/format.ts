/** German number formats (WEBSITE_PLAN §6, Phase 4: "deutsche Zahlenformate"). */

const de = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat('de-DE', opts)

export function zahl(value: number, digits = 0): string {
  return de({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

/** 0.14 -> "14 %" */
export function prozent(anteil: number, digits = 0): string {
  return `${zahl(anteil * 100, digits)} %`
}

/** 15033 -> "15.033 €" */
export function euro(value: number): string {
  return `${zahl(Math.round(value))} €`
}
