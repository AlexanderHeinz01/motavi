import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { downloadReport, getFrameUrl } from '../api/motavi'
import ActionItems from '../components/ActionItems'
import BodyHeatmap from '../components/BodyHeatmap'
import MovementChart from '../components/MovementChart'
import REBAGauge from '../components/REBAGauge'
import TimelineChart from '../components/TimelineChart'
import { useAnalysis } from '../hooks/useAnalysis'

function Card({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl bg-bg-secondary p-5 flex flex-col gap-4 border border-white/5 ${className}`}>
      <h3 className="font-headline text-xs font-semibold uppercase tracking-widest text-neutral/40">
        {title}
      </h3>
      {children}
    </div>
  )
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return <div className={`rounded-2xl bg-bg-secondary animate-pulse ${className}`} />
}

export default function DashboardPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { status, result, error } = useAnalysis(jobId)
  const [downloading, setDownloading] = useState(false)

  const loading = status === 'processing'
  const failed = status === 'error'

  const handleExportPdf = () => {
    if (!result) return
    setDownloading(true)
    try {
      downloadReport(result)
    } finally {
      setTimeout(() => setDownloading(false), 500)
    }
  }

  if (failed) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-bg-secondary text-center border border-accent/20">
          <p className="font-headline text-xl text-accent mb-2">Analyse nicht gefunden</p>
          <p className="font-body text-sm text-neutral/60 mb-6">
            {error || 'Der gesuchte Analyse-Job konnte nicht geladen werden.'}
          </p>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-body text-sm hover:bg-accent/90 transition-colors"
          >
            Neues Video analysieren
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {/* Top bar */}
      <header className="border-b border-bg-secondary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="text-neutral/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-bg-secondary"
            aria-label="Zurück zum Upload"
            title="Zurück zum Upload"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center font-display font-bold text-white text-xs">
              M
            </div>
            <h1 className="font-headline text-xl font-bold tracking-tight">MOTAVI</h1>
          </div>
          {jobId && (
            <span className="font-mono text-xs text-neutral/40 hidden sm:block">
              {jobId.slice(0, 12)}…
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary text-neutral/60 hover:text-white text-xs font-body transition-colors border border-white/5"
          >
            + Neue Analyse
          </button>

          {/* PDF Export */}
          {result && (
            <button
              onClick={handleExportPdf}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover
                transition-colors font-body text-sm text-white font-medium shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {downloading ? 'Wird erstellt…' : 'PDF-Report herunterladen'}
            </button>
          )}
        </div>
      </header>

      {/* Dashboard grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkeletonCard className="h-72" />
            <SkeletonCard className="h-72" />
            <SkeletonCard className="h-52" />
            <SkeletonCard className="h-52" />
            <SkeletonCard className="h-40 md:col-span-2" />
          </div>
        )}

        {result && (
          <>
            {/* Context meta strip */}
            <div className="mb-4 p-4 rounded-xl bg-bg-secondary/60 border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-body text-xs text-neutral/40">Unternehmen & Bereich</span>
                <span className="font-body text-sm font-semibold text-white">
                  {result.company_name || 'Standard-Unternehmen'} · {result.department || 'Produktionsbereich'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-xs text-neutral/40">Tätigkeit</span>
                <span className="font-body text-sm text-neutral/80">
                  {result.task_description || 'Regulärer Arbeitszyklus'}
                </span>
              </div>
              {result.worker_height_cm && (
                <div className="flex flex-col">
                  <span className="font-body text-xs text-neutral/40">Körpergröße</span>
                  <span className="font-mono text-sm text-neutral/80">{result.worker_height_cm} cm</span>
                </div>
              )}
              {result.analysis_info && (
                <div className="flex flex-col">
                  <span className="font-body text-xs text-neutral/40">Messgrundlage</span>
                  <span
                    className={`font-mono text-sm ${
                      result.analysis_info.detected_frames < result.analysis_info.sampled_frames * 0.5
                        ? 'text-accent'
                        : 'text-neutral/80'
                    }`}
                    title={result.analysis_info.model}
                  >
                    Person in {result.analysis_info.detected_frames} von {result.analysis_info.sampled_frames} Bildern
                    erkannt · {Math.floor(result.analysis_info.video_duration_sec / 60)}:
                    {String(Math.floor(result.analysis_info.video_duration_sec % 60)).padStart(2, '0')} min Video
                  </span>
                </div>
              )}
            </div>

            {/* Summary strip */}
            <div className="mb-6 flex flex-wrap gap-4 items-center p-4 rounded-xl bg-bg-secondary border border-white/5">
              <div className="flex flex-col">
                <span
                  className="font-mono text-3xl font-bold"
                  style={{
                    color:
                      result.reba_score <= 4
                        ? '#22c55e'
                        : result.reba_score <= 6
                        ? '#eab308'
                        : '#e63946',
                  }}
                >
                  {result.reba_score.toFixed(1)}
                </span>
                <span className="font-body text-xs text-neutral/40">REBA-Score</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-mono text-base font-semibold text-neutral/80">
                  {result.reba_level === 'LOW'
                    ? 'Geringes Risiko'
                    : result.reba_level === 'MEDIUM'
                    ? 'Mittleres Risiko'
                    : result.reba_level === 'HIGH'
                    ? 'Hohes Handlungsrisiko'
                    : 'Kritisches Risiko'}
                </span>
                <span className="font-body text-xs text-neutral/40">Risikostufe</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-mono text-base font-semibold text-neutral/70">
                  {result.shift_duration_min} min
                </span>
                <span className="font-body text-xs text-neutral/40">Analysierte Schicht</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-mono text-base font-semibold text-accent">
                  {result.action_items.filter((i) => i.priority === 'CRITICAL').length} kritisch
                </span>
                <span className="font-body text-xs text-neutral/40">Handlungsfelder</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1 — REBA Gauge */}
              <Card title="REBA-Score & Belastungsgrad">
                <REBAGauge score={result.reba_score} level={result.reba_level} />
              </Card>

              {/* 2 — Body Heatmap */}
              <Card title="Körperregionen-Heatmap (Subscores)">
                <BodyHeatmap regions={result.body_regions} />
              </Card>

              {/* 3 — Movement chart */}
              <Card title="Bewegungsklassifikation">
                <MovementChart
                  movements={result.movements}
                  shiftMin={result.shift_duration_min}
                />
              </Card>

              {/* 4 — Timeline */}
              <Card title="Bewegungszeitverlauf (Observation Window)">
                <TimelineChart timeline_frames={result.timeline_frames ?? []} />
              </Card>

              {/* 5 — Action items (full width) */}
              <Card title="Priorisierte Handlungsfelder & Empfehlungen" className="md:col-span-2">
                <ActionItems items={result.action_items} />
              </Card>
            </div>

            {/* 6 — Critical frames */}
            {result.critical_frames && result.critical_frames.length > 0 && (
              <div className="mt-5">
                <Card title="Kritische Bewegungsmomente (DSGVO-anonymisiert)">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {result.critical_frames.map((cf) => {
                      const mm = String(Math.floor(cf.second / 60)).padStart(2, '0')
                      const ss = String(Math.round(cf.second % 60)).padStart(2, '0')
                      const mvLabel =
                        cf.movement === 'overhead'
                          ? 'Überkopfarbeit'
                          : cf.movement === 'bending'
                          ? 'Rumpfbeugung'
                          : 'Schulterbelastung'
                      const imgSource = cf.imageUrl || getFrameUrl(result.job_id, `critical_${cf.rank}.jpg`)
                      return (
                        <div
                          key={cf.rank}
                          className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-bg-primary shadow-sm"
                        >
                          {imgSource ? (
                            <img
                              src={imgSource}
                              alt={`Kritischer Frame #${cf.rank}`}
                              className="w-full aspect-video object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-video bg-bg-secondary flex items-center justify-center text-xs text-neutral/40 font-mono">
                              Frame #{cf.rank} ({mm}:{ss})
                            </div>
                          )}
                          <div className="p-3 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-neutral/50">
                                Zeitstempel: {mm}:{ss}
                              </span>
                              <span className="font-mono text-sm font-bold" style={{ color: '#e63946' }}>
                                REBA {cf.reba.toFixed(1)}
                              </span>
                            </div>
                            <span className="font-body text-xs text-neutral/40">{mvLabel}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-bg-secondary px-6 py-6 text-center">
        <p className="font-body text-xs text-neutral/30">
          Erstellt durch Motavi Video-Ergonomie-System · DSGVO-konform anonymisiert · Gemäß DIN EN ISO 10075 / ArbSchG §5
        </p>
      </footer>
    </div>
  )
}
