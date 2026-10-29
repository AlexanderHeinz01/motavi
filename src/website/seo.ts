/**
 * Head data per page (title, description, robots, canonical, Open Graph).
 * Used by the prerender step (HTML string) and by <Seo> on client navigation.
 */
import { site } from '../content/site'
import type { PageMeta } from '../content/types'

export interface HeadData {
  title: string
  description: string
  robots: string
  canonical: string
  ogImage: string
}

export const NOINDEX = 'noindex, nofollow'

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`
}

export function headFor(path: string, meta: PageMeta, opts: { noindex?: boolean } = {}): HeadData {
  return {
    title: path === '/' ? `${site.name} | ${meta.title}` : `${meta.title} | ${site.name}`,
    description: meta.description,
    robots: site.indexable && !opts.noindex ? 'index, follow' : NOINDEX,
    canonical: absoluteUrl(path),
    ogImage: absoluteUrl(site.ogImage),
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Head tags as HTML, inserted into index.html by scripts/prerender.mjs. */
export function headHtml(h: HeadData): string {
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<meta name="robots" content="${h.robots}" />`,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="de_DE" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.canonical)}" />`,
    `<meta property="og:image" content="${esc(h.ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ')
}

export function sitemapXml(paths: string[]): string {
  const urls = paths.map((p) => `  <url><loc>${esc(absoluteUrl(p))}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function robotsTxt(): string {
  if (site.indexable) {
    return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
  }
  // Crawling stays allowed so that search engines can read the noindex meta tag.
  return '# Website bis zur Freigabe auf noindex (Meta-Tag robots auf jeder Seite).\nUser-agent: *\nAllow: /\n'
}
