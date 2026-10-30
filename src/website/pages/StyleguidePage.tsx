import { Gauge } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import BodyHeatmap from '../../app/components/BodyHeatmap'
import REBAGauge from '../../app/components/REBAGauge'
import { annahmen, demoSteckbriefe } from '../../content/demo/steckbriefe'
import { empfehlungen, type Path } from '../../content/empfehlungen'
import { mainNav } from '../../content/site'
import { startseite } from '../../content/startseite'
import { styleguide as sg } from '../../content/styleguide'
import type { Accent } from '../../content/types'
import { euro, zahl } from '../../lib/format'
import { fmtRatio, hex, inverse, inverseOverrides, kombinationen, light, type Combo } from '../../styles/contrastReport'
import Button, { type ButtonVariant, type Force } from '../../ui/Button'
import ButtonLink from '../../ui/ButtonLink'
import DashboardVorschau from '../../ui/DashboardVorschau'
import DoppelScore from '../../ui/DoppelScore'
import EmpfehlungsLabel from '../../ui/EmpfehlungsLabel'
import Entscheidungsweg, { EntscheidungswegKompakt } from '../../ui/Entscheidungsweg'
import Fragenkarte, { FragenErgebnis } from '../../ui/Fragenkarte'
import GreifraumGrafik from '../../ui/GreifraumGrafik'
import Hinweisbox from '../../ui/Hinweisbox'
import KategorieLabel from '../../ui/KategorieLabel'
import KpiKachel from '../../ui/KpiKachel'
import NutzenKarte, { NutzenKarten } from '../../ui/NutzenKarte'
import PaketKarte from '../../ui/PaketKarte'
import Partnerhinweis from '../../ui/Partnerhinweis'
import RechnerPanel from '../../ui/RechnerPanel'
import SteckbriefVorschau, { SteckbriefUmschalter } from '../../ui/SteckbriefVorschau'
import Trennlinie from '../../ui/Trennlinie'
import Vergleichstabelle from '../../ui/Vergleichstabelle'
import ZyklusZeitleiste, { Legende } from '../../ui/ZyklusZeitleiste'
import { CheckboxField, SelectField, TextareaField, TextField } from '../../ui/form/Formular'
import Schieberegler from '../../ui/form/Schieberegler'
import { GridPaper } from '../../visuals/drawing'
import SkelettAnimation from '../../visuals/skeleton/SkelettAnimation'
import SkelettTrenner from '../../visuals/skeleton/SkelettTrenner'
import Skeleton from '../../visuals/skeleton/Skeleton'
import { bendPose } from '../../visuals/skeleton/pose'
import { footerLinkClass } from '../layout/Footer'
import { mobileNavLinkClass, navLinkClass } from '../layout/Header'

const z = sg.zustaende
const ACCENTS: Accent[] = ['data-ink', 'risk-ink', 'gain-ink', 'warn-ink', 'path-improve', 'path-automate', 'path-keep']
const PATHS: Path[] = ['improve', 'automate', 'keep', 'improve-then-automate']
const FORCED: { name: string; force?: Force; disabled?: boolean }[] = [
  { name: z.normal },
  { name: z.hover, force: 'hover' },
  { name: z.fokus, force: 'focus' },
  { name: z.deaktiviert, disabled: true },
]
const TYPO = ['t-display', 't-h1', 't-h2', 't-h3', 't-body-lg', 't-body', 't-label', 't-kpi']

const SECTIONS = [
  ['tokens', sg.tokens.titel],
  ['button', sg.button.titel],
  ['kategorie', sg.kategorie.titel],
  ['empfehlung', sg.empfehlung.titel],
  ['entscheidungsweg', sg.entscheidungsweg.titel],
  ['kpi', sg.kpi.titel],
  ['nutzen', sg.nutzen.titel],
  ['paket', sg.paket.titel],
  ['vergleich', sg.vergleich.titel],
  ['rechner', sg.rechner.titel],
  ['formular', sg.formular.titel],
  ['fragen', sg.fragen.titel],
  ['doppelscore', sg.doppelScore.titel],
  ['steckbrief', sg.steckbrief.titel],
  ['zeitleiste', sg.zeitleiste.titel],
  ['greifraum', sg.greifraum.titel],
  ['skelett', sg.skelett.titel],
  ['hinweis', sg.hinweis.titel],
  ['partner', sg.partner.titel],
  ['dashboard', sg.dashboard.titel],
  ['navigation', sg.navigation.titel],
  ['footer', sg.footer.titel],
  ['kontrast', sg.kontrast.titel],
] as const

type SectionId = (typeof SECTIONS)[number][0]

function Abschnitt({ id, children, hinweis }: { id: SectionId; children: ReactNode; hinweis?: string }) {
  const titel = SECTIONS.find(([s]) => s === id)?.[1]
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <h2 className="t-h2 text-ink">{titel}</h2>
      {hinweis && <p className="t-body mt-2 max-w-prose text-ink-muted">{hinweis}</p>}
      <div className="mt-8 space-y-10">{children}</div>
      <div className="mt-12">
        <Trennlinie />
      </div>
    </section>
  )
}

/** One demo with its state name above it. */
function Zustand({ name, children, className = '', inverse = false }: { name: string; children: ReactNode; className?: string; inverse?: boolean }) {
  return (
    <div className={className}>
      <p className={`t-label mb-3 ${inverse ? 'text-white/70' : 'text-ink-muted'}`}>{name}</p>
      {children}
    </div>
  )
}

function Raster({ children, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { children: ReactNode; cols?: string }) {
  return <div className={`grid gap-8 ${cols}`}>{children}</div>
}

function Swatch({ token, scope }: { token: string; scope: typeof light }) {
  const value = hex(scope, token)
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 shrink-0 rounded-btn border border-line" style={{ background: value }} />
      <span className="min-w-0">
        <span className="block break-all font-mono text-[13px]">{token}</span>
        <span className="block font-mono text-[12px] opacity-75">{value}</span>
      </span>
    </div>
  )
}

function Kontrastzeile({ c }: { c: Combo }) {
  const ok = c.ratio >= c.min
  return (
    <tr className="border-t border-line align-top">
      <td className="py-2 pr-4 font-body text-[14px] text-ink">{c.name}</td>
      <td className="py-2 pr-4">
        <span
          className="inline-flex h-8 min-w-[56px] items-center justify-center rounded-btn border border-line px-2 font-body text-[14px] font-medium"
          style={{ color: c.fg, background: c.bg }}
          aria-hidden="true"
        >
          {sg.tokens.vorschau}
        </span>
      </td>
      <td className="py-2 pr-4 text-right font-mono text-[14px] text-ink">{fmtRatio(c.ratio)}</td>
      <td className="py-2 pr-4 text-right font-mono text-[14px] text-ink-muted">{fmtRatio(c.min)}</td>
      <td className={`py-2 font-body text-[14px] font-medium ${ok ? 'text-gain-ink' : 'text-error-ink'}`}>
        {ok ? sg.kontrast.bestanden : sg.kontrast.nichtBestanden}
      </td>
    </tr>
  )
}

function Kontrastbericht() {
  const liste = kombinationen()
  const gruppen = [...new Set(liste.map((c) => c.gruppe))]
  const ok = liste.filter((c) => c.ratio >= c.min).length
  const s = sg.kontrast.spalten
  return (
    <>
      <p className="t-body-lg font-medium text-ink">{sg.kontrast.zusammenfassung(ok, liste.length)}</p>
      {gruppen.map((g) => (
        <div key={g} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <caption className="t-h3 pb-3 text-left text-ink">{g}</caption>
            <thead>
              <tr className="t-label text-left text-ink-muted">
                <th className="pb-2 pr-4 font-medium">{s.kombination}</th>
                <th className="pb-2 pr-4 font-medium">{s.vorschau}</th>
                <th className="pb-2 pr-4 text-right font-medium">{s.wert}</th>
                <th className="pb-2 pr-4 text-right font-medium">{s.minimum}</th>
                <th className="pb-2 font-medium">{s.ergebnis}</th>
              </tr>
            </thead>
            <tbody>
              {liste
                .filter((c) => c.gruppe === g)
                .map((c) => (
                  <Kontrastzeile key={c.name} c={c} />
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}

function RechnerDemo() {
  const [zyklen, setZyklen] = useState(690)
  const [verlust, setVerlust] = useState(5.6)
  const [satz, setSatz] = useState(annahmen.stundensatz)
  const minuten = (zyklen * verlust) / 60
  const stundenJahr = (minuten * annahmen.schichtenProTag * annahmen.arbeitstage) / 60
  const r = sg.rechner
  return (
    <RechnerPanel
      eingaben={
        <>
          <Schieberegler label={r.zyklen} min={100} max={1500} step={10} value={zyklen} onChange={setZyklen} />
          <Schieberegler label={r.verlust} min={0} max={20} step={0.1} value={verlust} onChange={setVerlust} einheit="s" format={(v) => zahl(v, 1)} />
          <Schieberegler label={r.stundensatz} min={20} max={120} step={1} value={satz} onChange={setSatz} einheit="€" />
        </>
      }
      ergebnisse={[
        { label: r.minuten, value: zahl(minuten), unit: r.proSchicht, accent: 'data-ink' },
        { label: r.stunden, value: zahl(stundenJahr), unit: r.proJahr, accent: 'data-ink' },
        { label: r.euro, value: euro(stundenJahr * satz), unit: r.proJahr, accent: 'gain-ink' },
      ]}
    />
  )
}

function FragenDemo() {
  const [value, setValue] = useState<number | undefined>(undefined)
  return (
    <Fragenkarte nummer={2} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} value={value} onChange={setValue} />
  )
}

export default function StyleguidePage() {
  const f = sg.formular
  const [beispiel] = demoSteckbriefe
  const ohneZyklus = (demoSteckbriefe.find((d) => d.data.zykluszeit_median_s === null) ?? beispiel).data
  return (
    <div className="site-container py-12 md:py-16">
      <KategorieLabel accent="path-keep">{sg.label}</KategorieLabel>
      <h1 className="t-h1 mt-4 text-ink">{sg.title}</h1>
      <p className="t-body-lg mt-4 max-w-prose text-ink-muted">{sg.intro}</p>

      <nav aria-label={sg.inhalt} className="mt-8">
        <p className="t-label text-ink-muted">{sg.inhalt}</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {SECTIONS.map(([id, titel]) => (
            <li key={id}>
              <a href={`#${id}`} className="inline-flex min-h-[32px] items-center font-body text-[15px] text-primary underline-offset-4 is-hover:underline">
                {titel}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Abschnitt id="tokens">
        <Zustand name={sg.tokens.hell}>
          <div className="grid gap-4 rounded-card border border-line bg-page p-6 text-ink sm:grid-cols-2 lg:grid-cols-4">
            {Object.keys(light)
              .filter((t) => !t.startsWith('--font'))
              .map((t) => (
                <Swatch key={t} token={t} scope={light} />
              ))}
          </div>
        </Zustand>
        <Zustand name={sg.tokens.dunkel}>
          <div className="surface-inverse grid gap-4 rounded-card bg-page-inverse p-6 text-ink-inverse sm:grid-cols-2 lg:grid-cols-4">
            {Object.keys(inverseOverrides).map((t) => (
              <Swatch key={t} token={t} scope={inverse} />
            ))}
          </div>
        </Zustand>
        <Zustand name={sg.tokens.typo}>
          <div className="space-y-4">
            {TYPO.map((t) => (
              <div key={t} className="grid gap-2 border-t border-line pt-4 md:grid-cols-[160px_1fr]">
                <span className="font-mono text-[13px] text-ink-muted">.{t}</span>
                <span className={`${t} text-ink`}>{t === 't-kpi' ? sg.tokens.kpiBeispiel : sg.tokens.typoBeispiel}</span>
              </div>
            ))}
          </div>
        </Zustand>
        <Zustand name={sg.tokens.formen}>
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex h-12 items-center rounded-btn border border-line-strong px-4 font-body text-[14px] text-ink">{sg.tokens.radiusButton}</span>
            <span className="inline-flex h-20 items-center rounded-card border border-line px-6 font-body text-[14px] text-ink">{sg.tokens.radiusKarte}</span>
          </div>
          <p className="mt-6 font-body text-[14px] text-ink-muted">{sg.tokens.trennlinie}</p>
          <div className="mt-2">
            <Trennlinie />
          </div>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="button" hinweis={z.keinFehler.button}>
        {(Object.keys(sg.button.varianten) as ButtonVariant[]).map((v) => (
          <Zustand key={v} name={sg.button.varianten[v]}>
            <Raster>
              {FORCED.map((s) => (
                <Zustand key={s.name} name={s.name}>
                  <Button variant={v} force={s.force} disabled={s.disabled}>
                    {sg.button.beschriftung}
                  </Button>
                </Zustand>
              ))}
            </Raster>
          </Zustand>
        ))}
        <Zustand name={sg.button.link}>
          <Raster>
            {FORCED.filter((s) => !s.disabled).map((s) => (
              <Zustand key={s.name} name={s.name}>
                <ButtonLink to="/pilot" variant="secondary" force={s.force}>
                  {sg.button.beschriftung}
                </ButtonLink>
              </Zustand>
            ))}
          </Raster>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="kategorie">
        <Zustand name={sg.tokens.hell}>
          <div className="flex flex-wrap gap-6">
            {ACCENTS.map((a) => (
              <KategorieLabel key={a} accent={a}>
                {a}
              </KategorieLabel>
            ))}
          </div>
        </Zustand>
        <Zustand name={sg.tokens.dunkel}>
          <div className="surface-inverse flex flex-wrap gap-6 rounded-card bg-page-inverse p-6 text-ink-inverse">
            {ACCENTS.map((a) => (
              <KategorieLabel key={a} accent={a} inverse>
                {a}
              </KategorieLabel>
            ))}
          </div>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="empfehlung">
        {(['ruhig', 'kraeftig'] as const).map((v) => (
          <Zustand key={v} name={v === 'ruhig' ? sg.empfehlung.ruhig : sg.empfehlung.kraeftig}>
            <div className="flex flex-wrap items-center gap-4">
              {PATHS.map((p) => (
                <EmpfehlungsLabel key={p} path={p} variant={v} />
              ))}
            </div>
          </Zustand>
        ))}
        <Zustand name={sg.empfehlung.gross}>
          <div className="flex flex-wrap items-center gap-4">
            <EmpfehlungsLabel path="improve" variant="kraeftig" size="lg" vorrangig />
            <EmpfehlungsLabel path="improve-then-automate" variant="kraeftig" size="lg" vorrangig />
          </div>
        </Zustand>
        <Zustand name={sg.empfehlung.dunkel}>
          <div className="surface-inverse space-y-4 rounded-card bg-page-inverse p-6 text-ink-inverse">
            {(['ruhig', 'kraeftig'] as const).map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-4">
                {PATHS.map((p) => (
                  <EmpfehlungsLabel key={p} path={p} variant={v} />
                ))}
              </div>
            ))}
          </div>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="entscheidungsweg">
        <Zustand name={sg.entscheidungsweg.gross}>
          <Entscheidungsweg
            wege={startseite.entscheidung.wege}
            messung={
              <>
                <p className="t-label text-ink">{startseite.entscheidung.messung}</p>
                <p className="mt-1 font-body text-[14px] text-ink-muted">{startseite.entscheidung.messungText}</p>
              </>
            }
          />
        </Zustand>
        <Zustand name={sg.entscheidungsweg.kompakt}>
          <div className="space-y-4">
            {PATHS.map((p) => (
              <EntscheidungswegKompakt key={p} aktiv={p} />
            ))}
          </div>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="kpi">
        <div className="grid gap-6 md:grid-cols-3">
          {sg.kpi.kacheln.map((k) => (
            <KpiKachel key={k.label} {...k} />
          ))}
        </div>
      </Abschnitt>

      <Abschnitt id="nutzen" hinweis={z.keinFehler.karte}>
        <NutzenKarten>
          {FORCED.filter((s) => !s.disabled).map((s) => (
            <Zustand key={s.name} name={s.name} className="flex flex-col [&>div]:flex-1">
              <NutzenKarte icon={Gauge} {...sg.nutzen.karte} force={s.force} />
            </Zustand>
          ))}
        </NutzenKarten>
      </Abschnitt>

      <Abschnitt id="paket">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {sg.paket.karten.map((k) => (
            <PaketKarte key={k.name} {...k} />
          ))}
        </div>
      </Abschnitt>

      <Abschnitt id="vergleich">
        <Vergleichstabelle caption={sg.vergleich.caption} pakete={sg.vergleich.pakete} zeilen={sg.vergleich.zeilen} />
      </Abschnitt>

      <Abschnitt id="rechner" hinweis={z.keinFehler.regler}>
        <RechnerDemo />
        <Zustand name={sg.rechner.reglerZustaende}>
          <Raster>
            {FORCED.map((s) => (
              <Zustand key={s.name} name={s.name}>
                <Schieberegler label={sg.rechner.regler} min={1} max={3} defaultValue={2} force={s.force} disabled={s.disabled} />
              </Zustand>
            ))}
          </Raster>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="formular">
        <Zustand name={f.textfeld}>
          <Raster cols="sm:grid-cols-2 lg:grid-cols-3">
            {FORCED.map((s) => (
              <Zustand key={s.name} name={s.name}>
                <TextField label={f.name} placeholder={f.namePlatzhalter} force={s.force} disabled={s.disabled} />
              </Zustand>
            ))}
            <Zustand name={z.fehler}>
              <TextField label={f.email} type="email" defaultValue="name@beispiel" hint={f.emailHinweis} error={f.emailFehler} />
            </Zustand>
            <Zustand name={z.ausgefuellt}>
              <TextField label={f.email} type="email" defaultValue="name@beispiel.de" hint={f.emailHinweis} optional />
            </Zustand>
          </Raster>
        </Zustand>
        <Zustand name={f.mehrzeilig}>
          <Raster cols="sm:grid-cols-2 lg:grid-cols-3">
            {FORCED.map((s) => (
              <Zustand key={s.name} name={s.name}>
                <TextareaField label={f.nachricht} rows={3} force={s.force} disabled={s.disabled} />
              </Zustand>
            ))}
            <Zustand name={z.fehler}>
              <TextareaField label={f.nachricht} rows={3} error={f.nachrichtFehler} />
            </Zustand>
          </Raster>
        </Zustand>
        <Zustand name={f.auswahl}>
          <Raster cols="sm:grid-cols-2 lg:grid-cols-3">
            {FORCED.map((s) => (
              <Zustand key={s.name} name={s.name}>
                <SelectField label={f.branche} options={f.branchen} force={s.force} disabled={s.disabled} />
              </Zustand>
            ))}
            <Zustand name={z.fehler}>
              <SelectField label={f.branche} options={f.branchen} error={f.brancheFehler} />
            </Zustand>
          </Raster>
        </Zustand>
        <Zustand name={f.checkbox}>
          <Raster cols="sm:grid-cols-2 lg:grid-cols-3">
            {FORCED.map((s) => (
              <Zustand key={s.name} name={s.name}>
                <CheckboxField label={f.zustimmung} force={s.force} disabled={s.disabled} />
              </Zustand>
            ))}
            <Zustand name={z.ausgewaehlt}>
              <CheckboxField label={f.zustimmung} defaultChecked />
            </Zustand>
            <Zustand name={z.fehler}>
              <CheckboxField label={f.zustimmung} error={f.zustimmungFehler} />
            </Zustand>
          </Raster>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="fragen">
        <Raster cols="lg:grid-cols-2">
          <Zustand name={z.bedienbar}>
            <FragenDemo />
          </Zustand>
          <Zustand name={z.ausgewaehlt}>
            <Fragenkarte nummer={2} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} value={0} />
          </Zustand>
          <Zustand name={`${z.hover}, ${z.ersteAntwort}`}>
            <Fragenkarte nummer={2} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} force="hover" />
          </Zustand>
          <Zustand name={`${z.fokus}, ${z.ersteAntwort}`}>
            <Fragenkarte nummer={2} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} force="focus" />
          </Zustand>
          <Zustand name={z.fehler}>
            <Fragenkarte nummer={6} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} fehler={sg.fragen.fehler} />
          </Zustand>
          <Zustand name={z.deaktiviert}>
            <Fragenkarte nummer={2} gesamt={6} frage={sg.fragen.frage} optionen={sg.fragen.optionen} value={1} disabled />
          </Zustand>
        </Raster>
        <Zustand name={sg.fragen.ergebnis}>
          <Raster cols="lg:grid-cols-2">
            <FragenErgebnis path="improve-then-automate" verbesserung={72} automatisierung={68} />
            <FragenErgebnis path="keep" verbesserung={31} automatisierung={24} />
          </Raster>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="doppelscore">
        <Raster cols="md:grid-cols-2">
          {demoSteckbriefe.map(({ data, path }) => (
            <Zustand key={path} name={empfehlungen[path]}>
              <DoppelScore verbesserung={data.verbesserungs_score} automatisierung={data.automatisierungs_score} />
            </Zustand>
          ))}
        </Raster>
      </Abschnitt>

      <Abschnitt id="steckbrief">
        <Zustand name={sg.steckbrief.vollstaendig}>
          <SteckbriefUmschalter />
        </Zustand>
        <Zustand name={sg.steckbrief.kompakt}>
          <Raster cols="lg:grid-cols-2">
            {demoSteckbriefe.map(({ data, path }) => (
              <SteckbriefVorschau key={path} data={data} path={path} variante="kompakt" />
            ))}
          </Raster>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="zeitleiste">
        <Zustand name={sg.zeitleiste.einzeln}>
          <ZyklusZeitleiste schritte={beispiel.data.ablaufschritte} zykluszeit={beispiel.data.zykluszeit_median_s} />
        </Zustand>
        <Zustand name={sg.zeitleiste.folge}>
          <ZyklusZeitleiste schritte={beispiel.data.ablaufschritte} zykluszeit={beispiel.data.zykluszeit_median_s} variante="folge" />
        </Zustand>
        <Zustand name={sg.zeitleiste.ohneZyklus}>
          <ZyklusZeitleiste schritte={ohneZyklus.ablaufschritte} zykluszeit={null} />
        </Zustand>
        <Legende />
      </Abschnitt>

      <Abschnitt id="greifraum">
        <div className="max-w-xl">
          <GreifraumGrafik hoehenzonen={beispiel.data.hoehenzonen} ausserhalb={beispiel.data.griffe_ausserhalb_greifraum} />
        </div>
      </Abschnitt>

      <Abschnitt id="skelett" hinweis={sg.skelett.hinweis}>
        <Raster cols="md:grid-cols-2">
          <Zustand name={sg.skelett.greifen}>
            <div className="overflow-hidden rounded-card border border-line">
              <SkelettAnimation szene="greifen" />
            </div>
          </Zustand>
          <Zustand name={sg.skelett.buecken}>
            <div className="overflow-hidden rounded-card border border-line">
              <SkelettAnimation szene="buecken" />
            </div>
          </Zustand>
          <Zustand name={sg.skelett.trenner} className="md:col-span-2">
            <SkelettTrenner />
          </Zustand>
          <Zustand name={sg.skelett.gebueckt}>
            <div className="surface-inverse rounded-card bg-page-inverse p-4">
              <svg viewBox="0 0 400 320" className="h-auto w-full" role="img" aria-label={sg.skelett.gebuecktLabel}>
                <GridPaper id="grid-styleguide-dunkel" />
                <Skeleton pose={bendPose} background="var(--bg-inverse)" />
              </svg>
            </div>
          </Zustand>
        </Raster>
      </Abschnitt>

      <Abschnitt id="hinweis">
        <Raster cols="md:grid-cols-2">
          <Hinweisbox title={sg.hinweis.methodeTitel}>{sg.hinweis.methode}</Hinweisbox>
          <Hinweisbox variant="datenschutz" title={sg.hinweis.datenschutzTitel}>
            {sg.hinweis.datenschutz}
          </Hinweisbox>
        </Raster>
      </Abschnitt>

      <Abschnitt id="partner">
        <Partnerhinweis />
      </Abschnitt>

      <Abschnitt id="dashboard" hinweis={sg.dashboard.hinweis}>
        <DashboardVorschau>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="t-label text-white/70">{sg.dashboard.reba}</p>
              <REBAGauge score={5.8} level="MEDIUM" />
            </div>
            <div>
              <p className="t-label text-white/70">{sg.dashboard.regionen}</p>
              <div className="mx-auto max-w-[220px]">
                <BodyHeatmap regions={{ lumbar: 5.6, shoulder_l: 3.1, shoulder_r: 6.4, neck: 2.8, forearm: 2.2, knee_l: 1.5, knee_r: 1.8 }} />
              </div>
            </div>
          </div>
        </DashboardVorschau>
      </Abschnitt>

      <Abschnitt id="navigation" hinweis={sg.navigation.live}>
        <Zustand name={sg.navigation.desktop}>
          <Raster>
            {[...FORCED.filter((s) => !s.disabled), { name: z.aktiv, force: undefined, aktiv: true }].map((s) => (
              <Zustand key={s.name} name={s.name}>
                <a href="#navigation" data-force={s.force} className={navLinkClass('aktiv' in s)} aria-current={'aktiv' in s ? 'page' : undefined}>
                  {mainNav[0].label}
                </a>
              </Zustand>
            ))}
          </Raster>
        </Zustand>
        <Zustand name={sg.navigation.mobil}>
          <div className="max-w-sm rounded-card border border-line bg-page px-6 py-2">
            <ul>
              {mainNav.map((item, i) => (
                <li key={item.to} className="border-b border-line last:border-b-0">
                  <span className={mobileNavLinkClass(i === 0)}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Zustand>
      </Abschnitt>

      <Abschnitt id="footer" hinweis={sg.footer.live}>
        <Zustand name={sg.footer.links}>
          <div className="surface-inverse grid gap-6 rounded-card bg-page-inverse p-6 text-ink-inverse sm:grid-cols-3">
            {FORCED.filter((s) => !s.disabled).map((s) => (
              <Zustand key={s.name} name={s.name} inverse>
                <a href="#footer" data-force={s.force} className={footerLinkClass}>
                  {mainNav[1].label}
                </a>
              </Zustand>
            ))}
          </div>
        </Zustand>
      </Abschnitt>

      <section id="kontrast" className="scroll-mt-24 py-12">
        <h2 className="t-h2 text-ink">{sg.kontrast.titel}</h2>
        <p className="t-body mt-2 max-w-prose text-ink-muted">{sg.kontrast.intro}</p>
        <div className="mt-8 space-y-10">
          <Kontrastbericht />
        </div>
      </section>
    </div>
  )
}
