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
import HeroAPage from './pages/design/HeroAPage'
import HeroBPage from './pages/design/HeroBPage'
import HeroCPage from './pages/design/HeroCPage'
import { entwuerfe, skelettEntwurf, steckbriefEntwurf } from '../content/heroEntwuerfe'
import SteckbriefDesignPage from './pages/design/SteckbriefPage'
import SkelettPage from './pages/design/SkelettPage'
import { styleguide } from '../content/styleguide'
import StyleguidePage from './pages/StyleguidePage'

export interface SiteRoute {
  path: string
  element: ReactElement
  meta: PageMeta
  /** Listed in sitemap.xml */
  inSitemap: boolean
  /** Always noindex, also after the release (internal pages) */
  noindex?: boolean
}

/** Public pages of the website. */
const oeffentlich: SiteRoute[] = [
  { path: '/', element: <StartseitePage />, meta: startseite.meta, inSitemap: true },
  { path: '/arbeitsplatz-steckbrief', element: <SteckbriefPage />, meta: steckbrief.meta, inSitemap: true },
  { path: '/kapazitaet', element: <KapazitaetPage />, meta: kapazitaet.meta, inSitemap: true },
  { path: '/automatisierung', element: <AutomatisierungPage />, meta: automatisierung.meta, inSitemap: true },
  { path: '/gesundheit', element: <GesundheitPage />, meta: gesundheit.meta, inSitemap: true },
  { path: '/so-funktionierts', element: <SoFunktioniertsPage />, meta: soFunktionierts.meta, inSitemap: true },
  // Not linked until providers confirm interest (WEBSITE_PLAN §7.1)
  // not linked, not in the sitemap and noindex until WEBSITE_PLAN §7.1 is met
  { path: '/fuer-robotik-anbieter', element: <RobotikAnbieterPage />, meta: robotikAnbieter.meta, inSitemap: false, noindex: true },
  { path: '/pakete', element: <PaketePage />, meta: pakete.meta, inSitemap: true },
  { path: '/betriebsrat', element: <BetriebsratPage />, meta: betriebsrat.meta, inSitemap: true },
  { path: '/pilot', element: <PilotPage />, meta: pilot.meta, inSitemap: true },
  { path: '/impressum', element: <ImpressumPage />, meta: impressum.meta, inSitemap: true },
  { path: '/datenschutz', element: <DatenschutzPage />, meta: datenschutz.meta, inSitemap: true },
]

/**
 * Internal pages: only in the development server, not in the production
 * build (E.2.12 of the review on 31.10.2026).
 */
const intern: SiteRoute[] = [
  // Design drafts D0 (DESIGN_BRIEF §9): internal, not linked
  { path: '/_design/hero-a', element: <HeroAPage />, meta: entwuerfe.a.meta, inSitemap: false, noindex: true },
  { path: '/_design/hero-b', element: <HeroBPage />, meta: entwuerfe.b.meta, inSitemap: false, noindex: true },
  { path: '/_design/hero-c', element: <HeroCPage />, meta: entwuerfe.c.meta, inSitemap: false, noindex: true },
  { path: '/_design/skelett', element: <SkelettPage />, meta: skelettEntwurf.meta, inSitemap: false, noindex: true },
  { path: '/_design/steckbrief', element: <SteckbriefDesignPage />, meta: steckbriefEntwurf.meta, inSitemap: false, noindex: true },
  // Component overview D1 (DESIGN_BRIEF §9): internal, not linked
  { path: '/_styleguide', element: <StyleguidePage />, meta: styleguide.meta, inSitemap: false, noindex: true },
]

export const siteRoutes: SiteRoute[] = import.meta.env.DEV ? [...oeffentlich, ...intern] : oeffentlich

export const notFoundMeta: PageMeta = notFound.meta

/** "/kapazitaet/" and "/kapazitaet" are the same page. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function findSiteRoute(pathname: string): SiteRoute | undefined {
  const path = normalizePath(pathname)
  return siteRoutes.find((r) => r.path === path)
}
