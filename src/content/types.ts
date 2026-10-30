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
