import { describe, expect, it, vi } from 'vitest'
import { anfrage, LEER, senden, validieren, zielgruppeAusUrl, type KontaktFormular } from './kontakt'

const GUT: KontaktFormular = { ...LEER, zielgruppe: 'hersteller', name: 'Erika Muster', unternehmen: 'Beispiel GmbH', email: 'erika@example.org' }

describe('Kontaktformular', () => {
  it('Pflichtfelder', () => {
    expect(validieren(LEER)).toEqual({ zielgruppe: true, name: true, unternehmen: true, email: true })
    expect(validieren(GUT)).toEqual({})
  })
  it('optionale Felder werden nur geprüft, wenn ausgefüllt', () => {
    expect(validieren({ ...GUT, telefon: 'bitte anrufen' })).toEqual({ telefon: true })
    expect(validieren({ ...GUT, telefon: '+49 (30) 123-456' })).toEqual({})
    expect(validieren({ ...GUT, anzahl: '0' })).toEqual({ anzahl: true })
    expect(validieren({ ...GUT, anzahl: '12' })).toEqual({})
    expect(validieren({ ...GUT, email: 'erika@example' })).toEqual({ email: true })
    expect(validieren({ ...GUT, nachricht: 'x'.repeat(4001) })).toEqual({ nachricht: true })
  })
  it('Anfrage ohne leere Felder, mit Honeypot', () => {
    expect(anfrage({ ...GUT, anzahl: ' 12 ', interesse: ['kapazitaet'] })).toEqual({
      zielgruppe: 'hersteller', name: 'Erika Muster', unternehmen: 'Beispiel GmbH', email: 'erika@example.org',
      interesse: ['kapazitaet'], website: '', anzahl_arbeitsplaetze: 12,
    })
  })
  it('Zielgruppe aus dem Link', () => {
    expect(zielgruppeAusUrl('?ich=anbieter')).toBe('anbieter')
    expect(zielgruppeAusUrl('?ich=presse')).toBe('')
    expect(zielgruppeAusUrl('')).toBe('')
  })
  it('Senden: Erfolg, zu viele, Fehler', async () => {
    const f = vi.fn().mockResolvedValue({ status: 202, ok: true })
    expect(await senden(GUT, 'https://api.example.org', f)).toBe('ok')
    expect(f.mock.calls[0][0]).toBe('https://api.example.org/api/v1/contact')
    expect(await senden(GUT, '', vi.fn().mockResolvedValue({ status: 429, ok: false }))).toBe('zu_viele')
    expect(await senden(GUT, '', vi.fn().mockResolvedValue({ status: 422, ok: false }))).toBe('fehler')
    expect(await senden(GUT, '', vi.fn().mockRejectedValue(new Error('offline')))).toBe('fehler')
  })
})
