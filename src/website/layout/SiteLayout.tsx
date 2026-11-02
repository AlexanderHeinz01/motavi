import { useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { navText } from '../../content/site'
import { analyticsConfig, analyticsEinbinden } from '../../lib/analytics'
import { findSiteRoute, normalizePath, notFoundMeta } from '../routes'
import { headFor } from '../seo'
import Footer from './Footer'
import Header from './Header'
import Seo from './Seo'

/** Shared layout of all website pages (light theme). */
export default function SiteLayout() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const head = useMemo(() => {
    const route = findSiteRoute(pathname)
    return route
      ? headFor(route.path, route.meta, { noindex: route.noindex })
      : headFor(normalizePath(pathname), notFoundMeta, { noindex: true })
  }, [pathname])

  // Internal links open the new page at the top (feedback 02.11.2026). A link
  // with an anchor (e.g. /kapazitaet#rechner) jumps to that section instead.
  // Back and forward (POP) keep the position the browser restores.
  useEffect(() => {
    if (navigationType === 'POP') return
    const ziel = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (ziel) ziel.scrollIntoView()
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, navigationType])

  // cookieless reach measurement, only if configured at build time (default off)
  useEffect(() => {
    analyticsEinbinden(analyticsConfig(import.meta.env))
  }, [])

  return (
    <div className="site-root flex min-h-screen flex-col bg-page font-body text-ink">
      <Seo head={head} />
      <a
        href="#inhalt"
        className="t-body sr-only z-50 rounded-btn bg-page px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {navText.skipToContent}
      </a>
      <Header />
      <main id="inhalt" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
