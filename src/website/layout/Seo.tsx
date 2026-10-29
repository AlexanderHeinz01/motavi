import { useEffect } from 'react'
import type { HeadData } from '../seo'

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const meta = (key: 'name' | 'property', name: string) => () => {
  const el = document.createElement('meta')
  el.setAttribute(key, name)
  return el
}

/** Updates the head on client-side navigation (prerendered pages already ship it). */
export default function Seo({ head }: { head: HeadData }) {
  useEffect(() => {
    document.title = head.title
    setTag('meta[name="description"]', meta('name', 'description'), 'content', head.description)
    setTag('meta[name="robots"]', meta('name', 'robots'), 'content', head.robots)
    setTag(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      },
      'href',
      head.canonical,
    )
    setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', head.title)
    setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', head.description)
    setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', head.canonical)
    setTag('meta[property="og:image"]', meta('property', 'og:image'), 'content', head.ogImage)
  }, [head])
  return null
}
