/** Site-wide content: name, URL, navigation, footer. */

export const site = {
  name: 'Motavi',
  /** Absolute base URL for canonical links, sitemap and Open Graph. TODO: confirm domain (WEBSITE_PLAN §7.5). */
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://motavi.ai',
  /**
   * The whole website stays noindex until it is released (WEBSITE_PLAN §6, Phase 1).
   * Set VITE_SITE_INDEXABLE=true at build time to allow indexing.
   */
  indexable: import.meta.env.VITE_SITE_INDEXABLE === 'true',
  /** Leitsatz (WEBSITE_PLAN §1) */
  leitsatz: 'Erst verstehen, dann entscheiden.',
  ogImage: '/og/motavi.png',
  contactEmail: 'hello@motavi.ai',
}

export interface NavItem {
  label: string
  to: string
}

/** Main navigation (WEBSITE_PLAN §3). */
export const mainNav: NavItem[] = [
  { label: 'Steckbrief', to: '/arbeitsplatz-steckbrief' },
  { label: 'Kapazität', to: '/kapazitaet' },
  { label: 'Automatisierung', to: '/automatisierung' },
  { label: 'Gesundheit', to: '/gesundheit' },
  { label: 'Pakete', to: '/pakete' },
  { label: 'Betriebsrat', to: '/betriebsrat' },
]

export const navCta: NavItem = { label: 'Pilot anfragen', to: '/pilot' }

export const navText = {
  homeLabel: 'Motavi, zur Startseite',
  openMenu: 'Menü öffnen',
  closeMenu: 'Menü schließen',
  skipToContent: 'Zum Inhalt springen',
}

/**
 * Footer. The partner page /fuer-robotik-anbieter is intentionally not linked
 * until at least two providers confirm interest (WEBSITE_PLAN §7.1).
 * TODO: Hint "Server in Deutschland" only once the hosting of the website is
 * confirmed (decision 31.10.2026); until then the start page says
 * "Analyse auf Servern in Deutschland".
 */
export const footer = {
  claim: 'Motavi macht jede Bewegung im Arbeitsablauf messbar: als Zeit, als Kosten und als Belastung.',
  groups: [
    {
      title: 'Perspektiven',
      links: [
        { label: 'Kapazität', to: '/kapazitaet' },
        { label: 'Automatisierung', to: '/automatisierung' },
        { label: 'Gesundheit', to: '/gesundheit' },
      ],
    },
    {
      title: 'Motavi',
      links: [
        { label: 'Arbeitsplatz-Steckbrief', to: '/arbeitsplatz-steckbrief' },
        { label: 'So funktioniert es', to: '/so-funktionierts' },
        { label: 'Pakete', to: '/pakete' },
        { label: 'Datenschutz und Betriebsrat', to: '/betriebsrat' },
        { label: 'Pilot anfragen', to: '/pilot' },
      ],
    },
    {
      title: 'Rechtliches',
      links: [
        { label: 'Impressum', to: '/impressum' },
        { label: 'Datenschutz', to: '/datenschutz' },
      ],
    },
    {
      title: 'Analyse-App',
      links: [{ label: 'Anmelden', to: '/login' }],
    },
  ] satisfies { title: string; links: NavItem[] }[],
}

/** Texts shared by the placeholder pages of Phase 1. */
export const placeholderText = {
  label: 'Platzhalter',
  plannedTitle: 'Geplante Inhalte',
  phasePrefix: 'Inhalt folgt in',
  pilotLabel: 'Pilotphase',
  betriebsratHint: 'Wie Motavi mit Daten, Mitbestimmung und Automatisierung umgeht, lesen Sie unter',
  betriebsratLink: 'Datenschutz und Betriebsrat',
}

export const notFound = {
  meta: {
    title: 'Seite nicht gefunden',
    description: 'Die angeforderte Seite gibt es nicht.',
  },
  label: 'Fehler 404',
  title: 'Seite nicht gefunden',
  intro: 'Die angeforderte Seite gibt es nicht oder nicht mehr.',
  back: 'Zur Startseite',
}
