import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DATENWEG, datenwegText } from '../../content/datenweg'
import { useAnalysis } from '../hooks/useAnalysis'

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-bg-secondary animate-pulse ${className}`} />
}

export default function AnalyzingPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { status, error, progress, stage } = useAnalysis(jobId)
  const pct = Math.max(0, Math.min(100, progress ?? 0))

  useEffect(() => {
    if (status === 'done' && jobId) {
      const timeout = setTimeout(() => {
        navigate(`/app/dashboard/${jobId}`, { replace: true })
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [status, jobId, navigate])

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-display font-bold text-white text-lg">
              M
            </div>
            <h1 className="font-headline text-3xl font-bold text-white">MOTAVI</h1>
          </div>
          <p className="font-body text-sm text-neutral/40 font-mono">
            Job-ID: {jobId?.slice(0, 16)}…
          </p>
        </div>

        {/* Status */}
        {status === 'error' ? (
          <div className="p-6 rounded-xl border border-risk-ink/30 bg-risk-ink/5 text-center">
            <p className="font-headline text-lg text-risk-ink mb-1">Analyse fehlgeschlagen</p>
            <p className="font-body text-sm text-neutral/60">{error}</p>
            <button
              onClick={() => navigate('/app')}
              className="mt-4 px-5 py-2 rounded-lg bg-bg-secondary text-neutral/80
                hover:text-white transition-colors font-body text-sm"
            >
              ← Neues Video hochladen
            </button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div
              className="relative w-full h-1.5 rounded-full bg-bg-secondary overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-data-ink transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Current stage */}
            <div className="text-center flex flex-col items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-data-ink/10 border border-data-ink/30 font-mono text-xs text-data-ink">
                {Math.round(pct)} %
              </span>
              <p className="font-mono text-base text-white">
                {stage || 'Analyse wird vorbereitet…'}
              </p>
            </div>

            {/* Dashboard skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <SkeletonBlock className="col-span-1 h-52" />
              <SkeletonBlock className="col-span-1 h-52" />
              <SkeletonBlock className="col-span-2 h-36" />
              <SkeletonBlock className="col-span-2 h-28" />
            </div>
          </>
        )}

        {/* Footer */}
        <p className="text-center font-body text-xs text-neutral/40">
          {datenwegText[DATENWEG]}
        </p>
      </div>
    </div>
  )
}
