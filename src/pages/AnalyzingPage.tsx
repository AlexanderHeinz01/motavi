import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAnalysis } from '../hooks/useAnalysis'

const STEPS = [
  'Video wird dekodiert & vorbereitet…',
  'Anonymisierung: Gesichtsbereich maskieren…',
  'MediaPipe Pose-Landmarks werden berechnet…',
  'REBA-Subscores pro Körperregion ermitteln…',
  'Bewegungsklassifikation (Bücken / Überkopf / Neutral)…',
  'Kritische Bewegungs-Peaks & Bericht zusammenstellen…',
]

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-bg-secondary animate-pulse ${className}`} />
}

export default function AnalyzingPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { status, error } = useAnalysis(jobId)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (status === 'done' && jobId) {
      const timeout = setTimeout(() => {
        navigate(`/app/dashboard/${jobId}`, { replace: true })
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [status, jobId, navigate])

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

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
          <div className="p-6 rounded-xl border border-accent/30 bg-accent/5 text-center">
            <p className="font-headline text-lg text-accent mb-1">Analyse fehlgeschlagen</p>
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
            {/* Animated scanner line */}
            <div className="relative w-full h-1.5 rounded-full bg-bg-secondary overflow-hidden">
              <div
                className="absolute top-0 h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-data to-transparent"
                style={{ animation: 'scan 1.8s ease-in-out infinite' }}
              />
            </div>

            {/* Current step */}
            <div className="text-center flex flex-col items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-data/10 border border-data/30 font-mono text-xs text-data">
                Schritt {stepIndex + 1} von {STEPS.length}
              </span>
              <p className="font-mono text-base text-white animate-pulse">
                {STEPS[stepIndex]}
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
        <p className="text-center font-body text-xs text-neutral/20">
          Die Analyse läuft browser- und serverseitig — diese Seite kann geöffnet bleiben.
        </p>
      </div>

      {/* Scan animation */}
      <style>{`
        @keyframes scan {
          0%   { left: -33%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
