/**
 * Go-live check of the built website (dist/), docs/GO_LIVE_CHECKLISTE.md.
 * Checks what a machine can check; the rest of the checklist is manual.
 *
 *   npm run build && node scripts/golive-check.mjs
 *
 * Exit code 1 if a hard condition fails. Environment (the same values as for the build):
 *   VITE_API_BASE_URL              address of the backend for the contact form
 *   PARTNERSEITE_FREIGEGEBEN=true  links to /fuer-robotik-anbieter are allowed (WEBSITE_PLAN §7.1)
 *   VITE_ANALYTICS_SRC             must stay unset: no audience measurement at launch (decision 31.10.2026)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const seiten = []
;(function sammeln(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) sammeln(p)
    else if (n.endsWith('.html')) seiten.push(p)
  }
})(DIST)
const html = Object.fromEntries(seiten.map((p) => [p, readFileSync(p, 'utf-8')]))
const oeffentlich = seiten.filter((p) => !/_design|_styleguide|_alt-startseite|404/.test(p))
const js = readdirSync(join(DIST, 'assets')).filter((n) => n.endsWith('.js')).map((n) => readFileSync(join(DIST, 'assets', n), 'utf-8')).join('\n')

const ergebnisse = []
const pruefe = (name, ok, detail = '') => ergebnisse.push({ name, ok, detail })

const mitPlatzhalter = oeffentlich.filter((p) => /impressum|datenschutz/.test(p) && html[p].includes('Platzhalter'))
pruefe('Impressum und Datenschutzerklärung ohne Platzhalter', mitPlatzhalter.length === 0, mitPlatzhalter.join(', '))
const sonstigePlatzhalter = oeffentlich.filter((p) => !/impressum|datenschutz/.test(p) && html[p].includes('Platzhalter'))
pruefe('Keine Platzhalter auf den übrigen Seiten (z. B. Fehlzeiten auf /gesundheit)', sonstigePlatzhalter.length === 0, sonstigePlatzhalter.join(', '))

const noindex = oeffentlich.filter((p) => !p.includes('fuer-robotik-anbieter') && /<meta name="robots" content="noindex/.test(html[p]))
pruefe('Seiten indexierbar (VITE_SITE_INDEXABLE=true)', noindex.length === 0, noindex.length ? `${noindex.length} Seiten noindex` : '')

const dsgvo = seiten.filter((p) => html[p].includes('DSGVO-konform'))
pruefe('kein "DSGVO-konform" ohne juristische Prüfung', dsgvo.length === 0 && !js.includes('DSGVO-konform'), dsgvo.join(', '))

if (process.env.PARTNERSEITE_FREIGEGEBEN !== 'true') {
  const links = seiten.filter((p) => !p.includes('fuer-robotik-anbieter') && html[p].includes('href="/fuer-robotik-anbieter"'))
  const partner = Object.entries(html).find(([p]) => p.includes('fuer-robotik-anbieter'))
  pruefe('Partnerseite nicht verlinkt (§7.1)', links.length === 0, links.join(', '))
  pruefe('Partnerseite noindex (§7.1)', !!partner && /content="noindex/.test(partner[1]))
}

pruefe('Keine Reichweitenmessung zum Start (Entscheidung 31.10.2026)', !process.env.VITE_ANALYTICS_SRC, 'VITE_ANALYTICS_SRC ist gesetzt')
pruefe('Erkennungsmodell selbst gehostet', !js.includes('storage.googleapis.com'), 'Build lädt von storage.googleapis.com')

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8')
pruefe('Sitemap mit Domain statt Platzhalter', !/localhost|example/.test(sitemap) && /<loc>https:\/\//.test(sitemap))

const api = process.env.VITE_API_BASE_URL?.replace(/\/$/, '')
pruefe('Backend-Adresse für das Formular (VITE_API_BASE_URL, https, im Build enthalten)', !!api && api.startsWith('https://') && js.includes(api), api ? `${api} nicht im Build` : 'VITE_API_BASE_URL nicht gesetzt')

let fehler = 0
for (const e of ergebnisse) {
  if (!e.ok) fehler++
  console.log(`${e.ok ? 'OK    ' : 'FEHLT '} ${e.name}${!e.ok && e.detail ? `: ${e.detail}` : ''}`)
}
console.log(fehler ? `\n${fehler} Bedingung(en) nicht erfüllt.` : '\nAlle maschinell prüfbaren Bedingungen erfüllt.')
process.exit(fehler ? 1 : 0)
