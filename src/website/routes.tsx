/**
 * Website routes (WEBSITE_PLAN §3). Single source for the router, the
 * prerender step and the sitemap.
 */
import type { ReactElement } from 'react'
import { automatisierung } from '../content/automatisierung'
import { betriebsrat } from '../content/betriebsrat'
import { gesundheit } from '../content/gesundheit'
import { kapazitaet } from '../content/kapazitaet'
import { pakete } from '../content/pakete'
import { pilot } from '../content/pilot'
import { datenschutz, impressum } from '../content/rechtliches'
import { robotikAnbieter } from '../content/robotikAnbieter'
import { notFound } from '../content/site'
import { soFunktionierts } from '../content/soFunktionierts'
import { startseite } from '../content/startseite'
import { steckbrief } from '../content/steckbrief'
import type { PageMeta } from '../content/types'
import AutomatisierungPage from './pages/AutomatisierungPage'
import BetriebsratPage from './pages/BetriebsratPage'
import DatenschutzPage from './pages/DatenschutzPage'
import GesundheitPage from './pages/GesundheitPage'
import ImpressumPage from './pages/ImpressumPage'
import KapazitaetPage from './pages/KapazitaetPage'
import PaketePage from './pages/PaketePage'
import PilotPage from './pages/PilotPage'
import RobotikAnbieterPage from './pages/RobotikAnbieterPage'
import SoFunktioniertsPage from './pages/SoFunktioniertsPage'
import StartseitePage from './pages/StartseitePage'
import SteckbriefPage from './pages/SteckbriefPage'

export interface SiteRoute {
  path: string
  element: ReactElement
  meta: PageMeta
  /** Listed in sitemap.xml */
  inSitemap: boolean
}

export const siteRoutes: SiteRoute[] = [
  { path: '/', element: <StartseitePage />, meta: startseite.meta, inSitemap: true },
  { path: '/arbeitsplatz-steckbrief', element: <SteckbriefPage />, meta: steckbrief.meta, inSitemap: true },
  { path: '/kapazitaet', element: <KapazitaetPage />, meta: kapazitaet.meta, inSitemap: true },
  { path: '/automatisierung', element: <AutomatisierungPage />, meta: automatisierung.meta, inSitemap: true },
  { path: '/gesundheit', element: <GesundheitPage />, meta: gesundheit.meta, inSitemap: true },
  { path: '/so-funktionierts', element: <SoFunktioniertsPage />, meta: soFunktionierts.meta, inSitemap: true },
  // Not linked until providers confirm interest (WEBSITE_PLAN §7.1)
  { path: '/fuer-robotik-anbieter', element: <RobotikAnbieterPage />, meta: robotikAnbieter.meta, inSitemap: false },
  { path: '/pakete', element: <PaketePage />, meta: pakete.meta, inSitemap: true },
  { path: '/betriebsrat', element: <BetriebsratPage />, meta: betriebsrat.meta, inSitemap: true },
  { path: '/pilot', element: <PilotPage />, meta: pilot.meta, inSitemap: true },
  { path: '/impressum', element: <ImpressumPage />, meta: impressum.meta, inSitemap: true },
  { path: '/datenschutz', element: <DatenschutzPage />, meta: datenschutz.meta, inSitemap: true },
]

export const notFoundMeta: PageMeta = notFound.meta

/** "/kapazitaet/" and "/kapazitaet" are the same page. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function findSiteRoute(pathname: string): SiteRoute | undefined {
  const path = normalizePath(pathname)
  return siteRoutes.find((r) => r.path === path)
}
