/**
 * Prerender the website routes after `vite build` (WEBSITE_PLAN §5, SEO).
 *
 * Reads the client build (dist/index.html) and the server build
 * (dist-ssr/entry-server.js), writes one HTML file per website route with its
 * own head tags, plus sitemap.xml, robots.txt and 404.html. The analysis app
 * (/login, /app/...) stays client-rendered.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const HEAD = /<!--head:start-->[\s\S]*?<!--head:end-->/
const ROOT = '<div id="root"></div>'
if (!HEAD.test(template) || !template.includes(ROOT)) {
  throw new Error('dist/index.html: head markers or root element not found')
}

const entry = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

function page(appHtml, head, prerenderedPath) {
  const attr = prerenderedPath ? ` data-prerendered="${prerenderedPath}"` : ''
  return template.replace(HEAD, head).replace(ROOT, `<div id="root"${attr}>${appHtml}</div>`)
}

async function write(relative, content) {
  const file = path.join(dist, relative)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content)
}

// Each page is written as /route.html and /route/index.html, so that hosts
// resolving either extensions or directory indexes serve the prerendered HTML.
for (const { path: route, head } of entry.pages) {
  const html = page(entry.render(route), head, route)
  if (route === '/') {
    await write('index.html', html)
  } else {
    await write(`${route.slice(1)}.html`, html)
    await write(path.join(route.slice(1), 'index.html'), html)
  }
}
await write('404.html', page(entry.render('/404'), entry.notFoundHead, null))
await write('sitemap.xml', entry.sitemap)
await write('robots.txt', entry.robots)

await fs.rm(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${entry.pages.length} Seiten, 404.html, sitemap.xml, robots.txt`)
