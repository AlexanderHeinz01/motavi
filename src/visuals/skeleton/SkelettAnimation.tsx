import { Pause, Play } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { skelettText, type SkelettSzeneText } from '../../content/skelett'
import Icon from '../../ui/Icon'
import { GridPaper } from '../drawing'
import { buecken, greifen, type Keyframe, type Szene } from './keyframes'
import { poseAt, px, rumpfAt, streuung, toDrawing } from './motion'
import type { Pose } from './pose'
import Skeleton from './Skeleton'

/**
 * Animated skeleton visual (DESIGN_BRIEF §2 and §7, phase D2).
 *
 * Timeline (loop of five cycles): during the first three cycles the hand path
 * draws itself, then reach envelope and the three values appear as in a
 * technical drawing; the figure keeps working, everything fades before the
 * loop starts again. Without motion (prefers-reduced-motion, no JavaScript)
 * the drawing shows the final state with all values.
 */

const SZENEN = {
  // kostenAnker: where the leader of the cost label points (the side station, top left)
  greifen: { ...greifen, standbild: 0.4, teil: [0.44, 0.8] as const, kostenAnker: 'griff' as const },
  buecken: { ...buecken, standbild: 0.34, teil: [0.38, 0.78] as const, kostenAnker: 'ablage' as const },
}
export type SzeneName = keyof typeof SZENEN

const ZYKLUS = 2.7 // s, three cycles in about 8 s (DESIGN_BRIEF §7)
const MESSZYKLEN = 3
const LOOP = 5 * ZYKLUS
const AUSBLENDEN = LOOP - 0.5
const FADE = 0.25 // s, transitions 150 to 250 ms
const SAMPLES = 90
/** px per metre in the drawing, see scripts/skelett-posen.mjs; arm reach 0.58 m */
const GREIFWEITE = 0.58 * 128

const MONO = 'var(--font-mono)'
/** Light outline behind texts that may sit on lines */
const HALO = { paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 3, strokeLinejoin: 'round' } as const
const BODY = 'var(--font-body)'

// Layout of the drawing (400 x 320)
const ACHSE = { x0: 24, x1: 264, y: 40 }
const SPALTE = 298
const LINKS = 20
const LABEL_BREITE = 96

const rampe = (zeit: number, start: number) => Math.min(1, Math.max(0, (zeit - start) / FADE))

/** Wrist of cycle k with a small, smooth deviation (repetitions are never identical). */
function variiert(pose: Pose, zyklus: number, phase: number): Pose {
  const [dx, dy] = streuung(zyklus % MESSZYKLEN)
  const w = Math.sin(Math.PI * phase)
  return {
    ...pose,
    wristR: [pose.wristR[0] + dx * w, pose.wristR[1] + dy * w],
    elbowR: [pose.elbowR[0] + (dx * w) / 2, pose.elbowR[1] + (dy * w) / 2],
  }
}

function bahn(frames: Keyframe[], zyklus: number): [number, number][] {
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const phase = i / SAMPLES
    return px(variiert(poseAt(frames, phase), zyklus, phase).wristR)
  })
}

const punkte = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

function Szenerie({ szene, teilAbgelegt }: { szene: Szene; teilAbgelegt: boolean }) {
  const [tx0, tx1] = szene.tisch.x.map((x) => x * 400)
  const ty = szene.tisch.y * 320
  const boden = szene.boden * 320
  const [bx0, bx1] = szene.behaelter.x.map((x) => x * 400)
  const [by0, by1] = szene.behaelter.y.map((y) => y * 320)
  const [ax, ay] = px(szene.ablage)
  return (
    <g stroke="var(--text-muted)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1={boden} x2="384" y2={boden} />
      <path d={`M${tx0} ${ty}H${tx1}M${tx0 + 8} ${ty}V${boden}M${tx1 - 8} ${ty}V${boden}`} />
      <path d={`M${tx0 + 8} ${ty + (boden - ty) * 0.3}H${tx1 - 8}`} strokeWidth={1} />
      <path d={`M${bx0} ${Math.max(by0, by1)}V${Math.min(by0, by1)}M${bx1} ${Math.min(by0, by1)}V${Math.max(by0, by1)}H${bx0}`} />
      <path d={`M${bx0 + 4} ${Math.min(by0, by1) + 5}H${bx1 - 4}`} strokeWidth={1} />
      {/* raised bin: stand down to the floor */}
      {Math.max(by0, by1) < boden - 2 && <path d={`M${bx0 + 6} ${Math.max(by0, by1)}V${boden}M${bx1 - 6} ${Math.max(by0, by1)}V${boden}`} strokeWidth={1} />}
      {/* the part lies on the bench only while it is not in the hand */}
      {teilAbgelegt && <rect x={ax - 7} y={ay - 2} width="14" height="9" rx="2" strokeWidth={1} fill="var(--bg)" />}
    </g>
  )
}

function Wertlabel({ x = SPALTE, y, wert, opacity }: { x?: number; y: number; wert: SkelettSzeneText['werte'][number]; opacity: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={x + 3} cy={y - 4} r="3" fill={`var(--${wert.accent})`} />
      <text x={x + 11} y={y} fill="var(--text-muted)" style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>
        {wert.label.toUpperCase()}
      </text>
      <text x={x} y={y + 20} fill="var(--text)" style={{ fontFamily: MONO, fontSize: 17, fontWeight: 500 }}>
        {wert.wert}
      </text>
      <text x={x} y={y + 36} fill="var(--text-muted)" style={{ fontFamily: BODY, fontSize: 12 }}>
        {wert.einheit}
      </text>
    </g>
  )
}

/** Leader line from a feature in the drawing to a value label. */
function Hinweislinie({ von, nach, knick = [nach[0] - 14, nach[1]], opacity }: { von: [number, number]; nach: [number, number]; knick?: [number, number]; opacity: number }) {
  return (
    <g opacity={opacity} stroke="var(--text)" strokeWidth={1} fill="none">
      <circle cx={von[0]} cy={von[1]} r="2.5" fill="var(--text)" stroke="none" />
      <polyline points={punkte([von, knick, nach])} />
    </g>
  )
}

export default function SkelettAnimation({
  szene: name = 'greifen',
  text = skelettText[name],
  fixeZeit,
}: {
  szene?: SzeneName
  text?: SkelettSzeneText
  /** Fixed point in time in seconds (screenshots, styleguide); no animation */
  fixeZeit?: number
}) {
  const { frames, szene, standbild, teil, kostenAnker } = SZENEN[name]
  const ende = (4 + standbild) * ZYKLUS
  const [zeit, setZeit] = useState(fixeZeit ?? ende)
  const [bewegung, setBewegung] = useState(false)
  const [pausiert, setPausiert] = useState(false)
  const [sichtbar, setSichtbar] = useState(true)
  const zeitRef = useRef(zeit)
  const rahmen = useRef<HTMLDivElement>(null)
  const grid = `raster-${useId().replace(/:/g, '')}`

  const bahnen = useMemo(() => Array.from({ length: MESSZYKLEN }, (_, k) => bahn(frames, k)), [frames])

  // Motion only without prefers-reduced-motion; the drawing otherwise stays at its final state
  useEffect(() => {
    if (fixeZeit !== undefined) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setBewegung(!mq.matches)
      if (mq.matches) {
        zeitRef.current = ende
        setZeit(ende)
      }
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [fixeZeit, ende])

  // Pause outside the viewport
  useEffect(() => {
    const el = rahmen.current
    if (!el || !bewegung || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [bewegung])

  // Start only once the page is idle, so the animation does not compete with loading
  const [bereit, setBereit] = useState(false)
  useEffect(() => {
    if (!bewegung || bereit) return
    const start = () => setBereit(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(start, 1500)
    return () => window.clearTimeout(id)
  }, [bewegung, bereit])

  useEffect(() => {
    if (!bewegung || !bereit || pausiert || !sichtbar) return
    let raf = 0
    let last = performance.now()
    let offen = 0
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000
      last = now
      zeitRef.current = (zeitRef.current + dt) % LOOP
      // about 30 frames per second are enough for a line drawing
      offen += dt
      if (offen >= 1 / 30) {
        offen = 0
        setZeit(zeitRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [bewegung, bereit, pausiert, sichtbar])

  const zyklus = Math.floor(zeit / ZYKLUS)
  const phase = zeit / ZYKLUS - zyklus
  const pose = toDrawing(variiert(poseAt(frames, phase), zyklus, phase))
  const ausblenden = 1 - Math.min(1, Math.max(0, (zeit - AUSBLENDEN) / 0.5))
  const messEnde = MESSZYKLEN * ZYKLUS
  const [w1, w2, w3] = text.werte

  // Trunk angle: arc at the pelvis, readout in degrees
  const becken: [number, number] = [(pose.hipL[0] + pose.hipR[0]) / 2, (pose.hipL[1] + pose.hipR[1]) / 2]
  const rumpfWinkel = Math.atan2(pose.neck[0] - becken[0], becken[1] - pose.neck[1])
  const R = 30
  const bogenEnde: [number, number] = [becken[0] + R * Math.sin(rumpfWinkel), becken[1] - R * Math.cos(rumpfWinkel)]
  // readout on the side away from the trunk
  const links = rumpfWinkel >= 0
  const winkelText: [number, number] = [becken[0] + (links ? -8 : 8), becken[1] - R + 4]

  const ruhe = px(frames[0].pose.shoulderR)
  const greifraum = (deg: number): [number, number] => [ruhe[0] + GREIFWEITE * Math.cos((deg * Math.PI) / 180), ruhe[1] + GREIFWEITE * Math.sin((deg * Math.PI) / 180)]
  const [g0, g1, gMitte] = [greifraum(-62), greifraum(48), greifraum(0)]

  const imGriff = phase >= teil[0] && phase <= teil[1]
  const kostenPunkt = px(szene[kostenAnker])
  const zeitX = (t: number) => ACHSE.x0 + ((ACHSE.x1 - ACHSE.x0) * t) / messEnde

  return (
    <div ref={rahmen} className="relative">
      <svg viewBox="0 0 400 320" className="block h-auto w-full" role="img" aria-label={text.ariaLabel}>
        <GridPaper id={grid} />
        <Szenerie szene={szene} teilAbgelegt={!imGriff} />

        {/* time axis: three measured cycles */}
        <g stroke="var(--text-muted)" strokeWidth={1}>
          <line x1={ACHSE.x0} y1={ACHSE.y} x2={ACHSE.x1} y2={ACHSE.y} />
          {Array.from({ length: MESSZYKLEN + 1 }, (_, k) => (
            <line key={k} x1={zeitX(k * ZYKLUS)} y1={ACHSE.y - 4} x2={zeitX(k * ZYKLUS)} y2={ACHSE.y + 4} opacity={k === 0 || zeit >= k * ZYKLUS ? 1 : 0.35} />
          ))}
        </g>
        {Array.from({ length: MESSZYKLEN }, (_, k) => (
          <text key={k} x={zeitX((k + 0.5) * ZYKLUS)} y={ACHSE.y + 15} textAnchor="middle" fill="var(--text-muted)" style={{ fontFamily: MONO, fontSize: 10 }}>
            {k + 1}
          </text>
        ))}
        {zeit < messEnde && <circle cx={zeitX(zeit)} cy={ACHSE.y} r="3" fill="var(--data-ink)" />}

        {/* value 1: cycle time as a dimension line over the second cycle */}
        <g opacity={rampe(zeit, messEnde + 0.2) * ausblenden} stroke="var(--text)" strokeWidth={1} fill="none">
          {(() => {
            const [x1, x2, y] = [zeitX(ZYKLUS), zeitX(2 * ZYKLUS), ACHSE.y - 14]
            return (
              <>
                <path d={`M${x1} ${y - 5}V${y + 5}M${x2} ${y - 5}V${y + 5}M${x1} ${y}H${x2}`} />
                <path d={`M${x1 + 6} ${y - 3}L${x1} ${y}L${x1 + 6} ${y + 3}M${x2 - 6} ${y - 3}L${x2} ${y}L${x2 - 6} ${y + 3}`} />
                <circle cx={x2 + 12} cy={y - 1} r="3" fill={`var(--${w1.accent})`} stroke="none" />
                <text x={x2 + 20} y={y + 3} fill="var(--text)" stroke="none" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 500 }}>
                  {`${w1.wert} ${w1.einheit}`}
                </text>
              </>
            )
          })()}
        </g>

        {/* reach envelope */}
        <g opacity={rampe(zeit, messEnde) * ausblenden}>
          <path
            d={`M${g0[0].toFixed(1)} ${g0[1].toFixed(1)}A${GREIFWEITE} ${GREIFWEITE} 0 0 1 ${g1[0].toFixed(1)} ${g1[1].toFixed(1)}`}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text x={gMitte[0] + 5} y={gMitte[1] - 4} fill="var(--text-muted)" style={{ ...HALO, fontFamily: MONO, fontSize: 10 }}>
            {skelettText.greifraum}
          </text>
        </g>

        {/* hand paths of the three measured cycles */}
        <g fill="none" stroke="var(--data-ink)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={ausblenden}>
          {bahnen.map((b, k) => {
            const start = k * ZYKLUS
            if (zeit < start) return null
            const anteil = Math.min(1, (zeit - start) / ZYKLUS)
            const n = Math.floor(anteil * SAMPLES)
            const sichtbarePunkte = anteil < 1 ? [...b.slice(0, n + 1), px(variiert(poseAt(frames, anteil), k, anteil).wristR)] : b
            return <polyline key={k} points={punkte(sichtbarePunkte)} opacity={0.55 + 0.15 * k} />
          })}
        </g>

        {/* trunk angle */}
        <g>
          <line x1={becken[0]} y1={becken[1]} x2={becken[0]} y2={becken[1] - R - 12} stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="3 3" />
          <path
            d={`M${becken[0]} ${becken[1] - R}A${R} ${R} 0 0 1 ${bogenEnde[0].toFixed(1)} ${bogenEnde[1].toFixed(1)}`}
            fill="none"
            stroke="var(--risk-ink)"
            strokeWidth={1.5}
          />
          <text x={winkelText[0]} y={winkelText[1]} textAnchor={links ? 'end' : 'start'} fill="var(--text)" style={{ ...HALO, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
            {skelettText.grad(Math.round(rumpfAt(frames, phase)))}
          </text>
        </g>

        <Skeleton pose={pose} />
        {imGriff && <rect x={pose.wristR[0] - 7} y={pose.wristR[1] - 2} width="14" height="9" rx="2" fill="var(--bg)" stroke="var(--text-muted)" strokeWidth={1} />}

        {/* values 2 and 3 with leader lines */}
        <Hinweislinie von={kostenPunkt} knick={[LINKS + LABEL_BREITE, 148]} nach={[LINKS, 148]} opacity={rampe(zeit, messEnde + 0.5) * ausblenden} />
        <Wertlabel x={LINKS} y={104} wert={w2} opacity={rampe(zeit, messEnde + 0.5) * ausblenden} />
        <Hinweislinie von={[becken[0], becken[1] - R - 12]} nach={[SPALTE - 4, 162]} opacity={rampe(zeit, messEnde + 0.8) * ausblenden} />
        <Wertlabel y={154} wert={w3} opacity={rampe(zeit, messEnde + 0.8) * ausblenden} />

        <text x="392" y="314" textAnchor="end" fill="var(--text-muted)" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em' }}>
          {skelettText.beispielwerte.toUpperCase()}
        </text>
      </svg>
      {bewegung && (
        <button
          type="button"
          onClick={() => setPausiert((p) => !p)}
          aria-label={pausiert ? skelettText.fortsetzen : skelettText.anhalten}
          className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-page text-ink-muted transition-colors duration-150 ease-out is-hover:text-ink"
        >
          <Icon icon={pausiert ? Play : Pause} size={16} />
        </button>
      )}
    </div>
  )
}
