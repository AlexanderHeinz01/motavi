import { pakete as t, paketListe } from '../../content/pakete'
import KategorieLabel from '../../ui/KategorieLabel'
import PaketKarte from '../../ui/PaketKarte'
import Vergleichstabelle from '../../ui/Vergleichstabelle'
import BetriebsratHinweis from '../layout/BetriebsratHinweis'
import PageHeader from '../layout/PageHeader'

/** /pakete (WEBSITE_PLAN Phase 5): three package cards and the comparison. */
export default function PaketePage() {
  return (
    <div className="site-container site-section">
      <PageHeader label={t.label} accent={t.accent} title={t.title} intro={t.intro} />
      <h2 className="sr-only">{t.kartenTitel}</h2>
      <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
        {paketListe.map((p) => (
          <PaketKarte
            key={p.id}
            name={p.name}
            preis={p.preis}
            preisHinweis={t.preisHinweis}
            leistungen={[p.kurz, ...p.leistungen]}
            cta={t.cta}
            empfohlen={p.empfohlen}
          />
        ))}
      </div>
      <p className="t-body mt-6 max-w-[720px] text-ink-muted">{t.umfang}</p>
      <section className="mt-16" aria-labelledby="vergleich">
        <h2 id="vergleich" className="t-h2 text-ink">
          {t.vergleich.titel}
        </h2>
        <div className="mt-8">
          <Vergleichstabelle caption={t.vergleich.caption} pakete={paketListe.map((p) => ({ name: p.name, empfohlen: p.empfohlen }))} zeilen={t.vergleich.zeilen} />
        </div>
      </section>
      <div className="mt-8 space-y-4">
        <KategorieLabel accent="warn-ink">{t.hinweisPilot}</KategorieLabel>
        <BetriebsratHinweis />
      </div>
    </div>
  )
}
