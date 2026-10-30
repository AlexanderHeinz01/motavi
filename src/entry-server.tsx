/**
 * Server entry for the prerender step (scripts/prerender.mjs).
 * Renders the website routes to static HTML at build time.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AppRoutes } from './App'
import { notFoundMeta, siteRoutes } from './website/routes'
import { headFor, headHtml, robotsTxt, sitemapXml } from './website/seo'

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}

export const pages = siteRoutes.map((r) => ({
  path: r.path,
  head: headHtml(headFor(r.path, r.meta, { noindex: r.noindex })),
}))

export const notFoundHead = headHtml(headFor('/404', notFoundMeta, { noindex: true }))

export const sitemap = sitemapXml(siteRoutes.filter((r) => r.inSitemap).map((r) => r.path))

export const robots = robotsTxt()
