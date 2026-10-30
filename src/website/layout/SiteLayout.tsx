import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { navText } from '../../content/site'
import { findSiteRoute, normalizePath, notFoundMeta } from '../routes'
import { headFor } from '../seo'
import Footer from './Footer'
import Header from './Header'
import Seo from './Seo'

/** Shared layout of all website pages (light theme). */
export default function SiteLayout() {
  const { pathname } = useLocation()
  const head = useMemo(() => {
    const route = findSiteRoute(pathname)
    return route
      ? headFor(route.path, route.meta, { noindex: route.noindex })
      : headFor(normalizePath(pathname), notFoundMeta, { noindex: true })
  }, [pathname])

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
