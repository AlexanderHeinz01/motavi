/**
 * Cookieless reach measurement (WEBSITE_PLAN §2 guideline 9, Phase 7):
 * off by default. Only when VITE_ANALYTICS_SRC is set at build time, the
 * website loads that script (a cookieless, EU-hosted service of the
 * "script with data-domain" kind) with data-domain = VITE_ANALYTICS_DOMAIN.
 * The analysis app under /app is never measured.
 */
export interface AnalyticsConfig {
  src: string
  domain: string
}

export function analyticsConfig(env: Record<string, string | undefined>): AnalyticsConfig | null {
  const src = env.VITE_ANALYTICS_SRC?.trim()
  const domain = env.VITE_ANALYTICS_DOMAIN?.trim()
  if (!src || !domain) return null
  // only https, so that no mixed or unexpected sources slip in
  if (!/^https:\/\/[^\s"'<>]+$/.test(src)) return null
  return { src, domain }
}

/** Adds the script once (browser only). */
export function analyticsEinbinden(cfg: AnalyticsConfig | null, doc: Document = document): boolean {
  if (!cfg || doc.querySelector('script[data-motavi-analytics]')) return false
  const s = doc.createElement('script')
  s.defer = true
  s.src = cfg.src
  s.dataset.domain = cfg.domain
  s.dataset.motaviAnalytics = ''
  doc.head.appendChild(s)
  return true
}
