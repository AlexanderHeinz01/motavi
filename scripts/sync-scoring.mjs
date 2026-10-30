/**
 * Copies the shared scoring configuration from the backend repo (the source,
 * motavi-backend: config/workplace_scoring.json) into this repo, so the
 * static website can read it at build time (WEBSITE_PLAN §5).
 *
 *   npm run sync:scoring           copy
 *   npm run sync:scoring -- --check  only compare, exit code 1 if different
 *
 * Backend repo: next to this one (../motavi-backend) or MOTAVI_BACKEND_REPO.
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const backend = resolve(process.env.MOTAVI_BACKEND_REPO ?? '../motavi-backend')
const quelle = resolve(backend, 'config/workplace_scoring.json')
const ziel = resolve('config/workplace_scoring.json')

if (!existsSync(quelle)) {
  console.error(`Quelle nicht gefunden: ${quelle} (MOTAVI_BACKEND_REPO setzen)`)
  process.exit(2)
}
const gleich = existsSync(ziel) && readFileSync(quelle).equals(readFileSync(ziel))
if (process.argv.includes('--check')) {
  console.log(gleich ? 'Konfiguration aktuell.' : 'Konfiguration veraltet: npm run sync:scoring')
  process.exit(gleich ? 0 : 1)
}
if (gleich) {
  console.log('Konfiguration bereits aktuell.')
} else {
  copyFileSync(quelle, ziel)
  console.log(`Kopiert: ${quelle} -> ${ziel}`)
}
