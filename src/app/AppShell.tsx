import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { site } from '../content/site'
import { NOINDEX, absoluteUrl } from '../website/seo'
import Seo from '../website/layout/Seo'
import { AuthProvider } from './auth/AuthContext'

const appHead = {
  title: 'Analyse-App | Motavi',
  description: 'Ergonomie-Analyse von Arbeitsplatzvideos.',
  robots: NOINDEX,
  canonical: absoluteUrl('/app'),
  ogImage: absoluteUrl(site.ogImage),
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <p className="font-body text-sm text-neutral/50">Lädt…</p>
    </div>
  )
}

/**
 * Analysis app (dark theme): login context, lazy pages, never indexed.
 * .surface-inverse maps the ink tokens to the bright dashboard colours.
 */
export default function AppShell() {
  return (
    <AuthProvider>
      <Seo head={appHead} />
      <div className="surface-inverse">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </AuthProvider>
  )
}
