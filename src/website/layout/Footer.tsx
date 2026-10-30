import { Link } from 'react-router-dom'
import { footer, site } from '../../content/site'

/** Footer link on dark ground; exported for the styleguide (states). */
export const footerLinkClass = 't-body inline-flex min-h-[32px] items-center text-white/90 is-hover:text-white is-hover:underline'

/** Dark footer with links and legal pages (DESIGN_BRIEF §4). */
export default function Footer() {
  return (
    <footer className="surface-inverse bg-page-inverse text-ink-inverse">
      <div className="site-container py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <p className="font-headline text-[22px] font-semibold tracking-tight">motavi</p>
            <p className="t-body mt-3 text-white/70">{footer.claim}</p>
          </div>
          {footer.groups.map((group) => (
            <div key={group.title}>
              <p className="t-label text-white/70">{group.title}</p>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <p className="t-body text-white/70">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}
          </p>
          <a href={`mailto:${site.contactEmail}`} className="t-body text-white/90 hover:text-white hover:underline">
            {site.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}
