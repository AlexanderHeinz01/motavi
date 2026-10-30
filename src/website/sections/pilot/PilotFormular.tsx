/**
 * Contact form /pilot (WEBSITE_PLAN Phase 6). Sends to POST
 * ${VITE_API_BASE_URL}/api/v1/contact (motavi-backend). Validation like the
 * backend; hidden honeypot field; on error the e-mail address as fallback.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formularText } from '../../../content/komponenten'
import { pilot } from '../../../content/pilot'
import { site } from '../../../content/site'
import { LEER, senden, validieren, zielgruppeAusUrl, type Fehler, type Interesse, type KontaktFormular, type SendeErgebnis, type Zielgruppe } from '../../../lib/kontakt'
import Button from '../../../ui/Button'
import { CheckboxField, FieldError, TextareaField, TextField } from '../../../ui/form/Formular'

const t = pilot.formular
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export default function PilotFormular() {
  const { search } = useLocation()
  // the prerendered page has no query, so the target group from the link is set after loading
  const [f, setF] = useState<KontaktFormular>(LEER)
  const [fehler, setFehler] = useState<Fehler>({})
  const [status, setStatus] = useState<'offen' | 'sendet' | SendeErgebnis>('offen')
  const [pruefung, setPruefung] = useState(0)
  const ergebnis = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const z = zielgruppeAusUrl(search)
    if (z) setF((alt) => (alt.zielgruppe ? alt : { ...alt, zielgruppe: z }))
  }, [search])

  // after a failed check: focus the first field with an error (once the errors are rendered)
  useEffect(() => {
    if (pruefung) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [pruefung])

  useEffect(() => {
    if (status === 'ok' || status === 'fehler' || status === 'zu_viele') ergebnis.current?.focus()
  }, [status])

  const set = (patch: Partial<KontaktFormular>) => setF((alt) => ({ ...alt, ...patch }))

  const absenden = async (e: FormEvent) => {
    e.preventDefault()
    const v = validieren(f)
    setFehler(v)
    if (Object.keys(v).length) {
      setPruefung((n) => n + 1)
      return
    }
    setStatus('sendet')
    setStatus(await senden(f, API_BASE))
  }

  if (status === 'ok') {
    return (
      <div ref={ergebnis} tabIndex={-1} role="status" className="rounded-card border border-line bg-page-subtle p-6 outline-none">
        <p className="t-h3 text-ink">{pilot.erfolg.titel}</p>
        <p className="t-body mt-2 text-ink-muted">{pilot.erfolg.text}</p>
      </div>
    )
  }

  const zielFehlerId = 'pilot-zielgruppe-fehler'
  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="space-y-6">
      {(status === 'fehler' || status === 'zu_viele') && (
        <div ref={ergebnis} tabIndex={-1} role="alert" className="rounded-card border-2 border-error-ink p-5 outline-none">
          <p className="font-body text-[16px] font-medium text-ink">{pilot.fehlschlag.titel}</p>
          <p className="t-body mt-1 text-ink">
            {status === 'zu_viele' ? `${pilot.fehlschlag.zuViele} ` : ''}
            {pilot.fehlschlag.text}{' '}
            <a href={`mailto:${site.contactEmail}`} className="text-primary underline underline-offset-4">
              {site.contactEmail}
            </a>
          </p>
        </div>
      )}

      <fieldset aria-describedby={fehler.zielgruppe ? zielFehlerId : undefined}>
        <legend className="mb-2 font-body text-[15px] font-medium text-ink">{t.zielgruppe.legende}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(t.zielgruppe.optionen) as Zielgruppe[]).map((z) => (
            <label
              key={z}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-btn border bg-page px-4 py-2.5 font-body text-[15px] text-ink is-focus-within:outline is-focus-within:outline-2 is-focus-within:outline-offset-2 is-focus-within:outline-primary ${
                fehler.zielgruppe ? 'border-error-ink' : f.zielgruppe === z ? 'border-primary shadow-[inset_0_0_0_1px_var(--primary)]' : 'border-line-strong'
              }`}
            >
              <input
                type="radio"
                name="zielgruppe"
                value={z}
                checked={f.zielgruppe === z}
                aria-invalid={fehler.zielgruppe ? true : undefined}
                onChange={() => set({ zielgruppe: z })}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              {t.zielgruppe.optionen[z]}
            </label>
          ))}
        </div>
        {fehler.zielgruppe && <FieldError id={zielFehlerId}>{pilot.fehler.zielgruppe}</FieldError>}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label={t.name} name="name" autoComplete="name" value={f.name} onChange={(e) => set({ name: e.target.value })} error={fehler.name && pilot.fehler.name} />
        <TextField label={t.unternehmen} name="unternehmen" autoComplete="organization" value={f.unternehmen} onChange={(e) => set({ unternehmen: e.target.value })} error={fehler.unternehmen && pilot.fehler.unternehmen} />
        <TextField label={t.funktion} name="funktion" autoComplete="organization-title" optional value={f.funktion} onChange={(e) => set({ funktion: e.target.value })} />
        <TextField label={t.email} name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set({ email: e.target.value })} error={fehler.email && pilot.fehler.email} />
        <TextField label={t.telefon} name="telefon" type="tel" autoComplete="tel" optional value={f.telefon} onChange={(e) => set({ telefon: e.target.value })} error={fehler.telefon && pilot.fehler.telefon} />
        <TextField label={t.anzahl} name="anzahl" inputMode="numeric" optional hint={t.anzahlHinweis} value={f.anzahl} onChange={(e) => set({ anzahl: e.target.value })} error={fehler.anzahl && pilot.fehler.anzahl} />
      </div>

      <fieldset>
        <legend className="mb-1 font-body text-[15px] font-medium text-ink">
          {t.interesse.legende} <span className="font-normal text-ink-muted">({formularText.optional})</span>
        </legend>
        <div className="flex flex-wrap gap-x-6">
          {(Object.keys(t.interesse.optionen) as Interesse[]).map((i) => (
            <CheckboxField
              key={i}
              label={t.interesse.optionen[i]}
              checked={f.interesse.includes(i)}
              onChange={(e) => set({ interesse: e.target.checked ? [...f.interesse, i] : f.interesse.filter((x) => x !== i) })}
            />
          ))}
        </div>
      </fieldset>

      <TextareaField label={t.nachricht} name="nachricht" optional rows={5} value={f.nachricht} onChange={(e) => set({ nachricht: e.target.value })} error={fehler.nachricht && pilot.fehler.nachricht} />

      {/* honeypot: hidden from people and assistive technology, bots fill it */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label>
          {t.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set({ website: e.target.value })} />
        </label>
      </div>

      <p className="t-body text-ink-muted">
        {t.datenschutz}{' '}
        <Link to="/datenschutz" className="text-primary underline underline-offset-4">
          {t.datenschutzLink}
        </Link>
        .
      </p>
      <Button type="submit" disabled={status === 'sendet'}>
        {status === 'sendet' ? t.sendet : t.senden}
      </Button>
    </form>
  )
}
