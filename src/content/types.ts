/** Shape of the website content files in src/content/. */

/**
 * Colour of the category label dot (docs/DESIGN_BRIEF.md §3). Only ink and
 * path tokens: they adapt to light ground and to .surface-inverse.
 */
export type Accent =
  | 'data-ink'
  | 'risk-ink'
  | 'gain-ink'
  | 'warn-ink'
  | 'path-improve'
  | 'path-automate'
  | 'path-keep'

export interface PageMeta {
  /** Page title without the site suffix. */
  title: string
  /** Meta description, at most about 155 characters. */
  description: string
}

export interface PageContent {
  meta: PageMeta
  /** Category label above the H1, without the dot. */
  label: string
  accent: Accent
  /** H1 */
  title: string
  /** Introduction below the H1 (body-lg). */
  intro: string
  /** Placeholder: sections planned for this page. */
  planned: string[]
  /** Phase of docs/WEBSITE_PLAN.md that fills the page. */
  phase: string
  /** Guideline 7: mark functions that are not validated yet. */
  pilot?: boolean
  /** Guideline 6: pages on capacity or automation link to /betriebsrat. */
  betriebsratLink?: boolean
}
