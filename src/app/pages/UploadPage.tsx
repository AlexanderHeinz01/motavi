import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadVideoWithProgress, type UploadMeta } from '../api/motavi'
import { useAuth } from '../auth/AuthContext'
import UploadZone from '../components/UploadZone'

type Phase = 'idle' | 'selected' | 'uploading' | 'error'

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-bg-primary border border-bg-secondary ' +
  'focus:outline-none focus:border-data/50 font-body text-sm text-white ' +
  'placeholder:text-neutral/25 transition-colors disabled:opacity-50'

export default function UploadPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<UploadMeta>({ shift_duration_min: 480 })

  const setField = <K extends keyof UploadMeta>(k: K, v: UploadMeta[K]) =>
    setMeta((m) => ({ ...m, [k]: v }))

  const handleFile = (f: File) => {
    setFile(f)
    setPhase('selected')
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setPhase('uploading')
    setError(null)
    setProgress(0)
    try {
      const { job_id } = await uploadVideoWithProgress(file, setProgress, meta)
      navigate(`/app/analyzing/${job_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen.')
      setPhase('error')
    }
  }

  const formatSize = (bytes: number) =>
    bytes >= 1_048_576
      ? `${(bytes / 1_048_576).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`

  const uploading = phase === 'uploading'

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-10 relative">
      {/* Account / logout & Marketing Link */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="font-body text-xs text-neutral/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-bg-secondary"
        >
          Zur Startseite
        </button>
        {user && (
          <span className="font-body text-xs text-neutral/40 hidden sm:inline">{user.email}</span>
        )}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="font-body text-xs text-neutral/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-bg-secondary"
        >
          Abmelden
        </button>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center font-display font-bold text-white text-base">
              M
            </div>
            <h1 className="font-headline text-3xl font-bold text-white tracking-tight">MOTAVI</h1>
          </div>
          <p className="font-body text-base text-neutral/50">
            KI-gestützte Ergonomie-Analyse für produzierende Unternehmen
          </p>
        </div>

        {/* Quick demo banner */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-brand/30 flex items-center justify-between gap-4">
          <div>
            <div className="font-headline text-xs font-semibold text-brand-light flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
              Sofort-Demo ausprobieren
            </div>
            <p className="font-body text-xs text-neutral/60 mt-0.5">
              Beispielanalyse mit erfundenen Demodaten aus der Logistik-Kommissionierung
            </p>
          </div>
          <button
            onClick={() => navigate('/app/dashboard/demo-logistik')}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white font-body text-xs font-semibold transition-colors shadow-sm"
          >
            Demo laden →
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-bg-secondary" />

        {/* Metadata form */}
        <div className="flex flex-col gap-3">
          <p className="font-body text-xs text-neutral/40 uppercase tracking-widest">
            Analyseparameter
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs text-neutral/50">Unternehmensname</span>
              <input
                type="text"
                value={meta.company_name ?? ''}
                onChange={(e) => setField('company_name', e.target.value || undefined)}
                placeholder="z. B. Automotive Werk 1"
                disabled={uploading}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs text-neutral/50">Bereich / Abteilung</span>
              <input
                type="text"
                value={meta.department ?? ''}
                onChange={(e) => setField('department', e.target.value || undefined)}
                placeholder="z. B. Montage Linie 4"
                disabled={uploading}
                className={inputCls}
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="font-body text-xs text-neutral/50">Aufgabenbeschreibung</span>
              <textarea
                value={meta.task_description ?? ''}
                onChange={(e) => setField('task_description', e.target.value || undefined)}
                placeholder='z. B. „Kommissionierung von Motorkomponenten, repetitive Bückhaltung"'
                rows={2}
                disabled={uploading}
                className={`${inputCls} resize-none`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs text-neutral/50">
                Schichtdauer (Min)<span className="text-accent ml-0.5">*</span>
              </span>
              <input
                type="number"
                value={meta.shift_duration_min}
                onChange={(e) =>
                  setField('shift_duration_min', Math.max(1, Number(e.target.value) || 480))
                }
                min={1}
                max={720}
                disabled={uploading}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs text-neutral/50">Körpergröße (cm)</span>
              <input
                type="number"
                value={meta.worker_height_cm ?? ''}
                onChange={(e) =>
                  setField('worker_height_cm', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="optional (z. B. 178)"
                min={100}
                max={220}
                disabled={uploading}
                className={inputCls}
              />
            </label>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-bg-secondary" />

        {/* Upload zone */}
        <UploadZone onFile={handleFile} disabled={uploading} />

        {/* Selected file preview */}
        {file && phase !== 'idle' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-secondary border border-bg-secondary">
            <svg
              className="w-8 h-8 text-data flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-white truncate">{file.name}</p>
              <p className="font-mono text-xs text-neutral/40">{formatSize(file.size)}</p>
            </div>
            {!uploading && (
              <button
                onClick={() => {
                  setFile(null)
                  setPhase('idle')
                }}
                className="text-neutral/30 hover:text-neutral/70 transition-colors"
                aria-label="Datei entfernen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Progress bar */}
        {uploading && (
          <div className="flex flex-col gap-2">
            <div className="w-full h-1.5 rounded-full bg-bg-secondary overflow-hidden">
              <div
                className="h-full bg-data rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-neutral/40">Analyse wird gestartet…</span>
              <span className="font-mono text-xs text-data">{progress} %</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center font-body text-sm text-accent">{error}</p>}

        {/* CTA button */}
        {(phase === 'selected' || phase === 'error') && (
          <button
            onClick={handleUpload}
            className="w-full py-3.5 rounded-xl font-headline font-semibold text-base
              bg-accent hover:bg-accent/90 text-white transition-colors duration-150"
          >
            Analyse starten →
          </button>
        )}

        {/* Footer note */}
        <p className="text-center font-body text-xs text-neutral/25">
          DSGVO-konform · Automatische Gesichtsanonymisierung · DIN EN ISO 10075 konform
        </p>
      </div>
    </div>
  )
}
