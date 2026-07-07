import { useEffect, useRef, useMemo } from 'react'
import styles from './VisualizerShell.module.css'
import { classifyComplexity, COMPLEXITY_COLORS, BIG_O_TIERS } from './complexityUtils.js'

/** Right panel — step info, pseudocode, stats, legend, complexity */
export default function RightPanel({ hook, code, activeCodeLine, stats, legend, complexity }) {
  const step = hook?.step
  const currentStep = hook?.currentStep ?? -1
  const totalSteps = hook?.totalSteps ?? 0
  const activeLineRef = useRef(null)

  // Scroll active code line into view whenever it changes
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeCodeLine])

  return (
    <aside className={styles.right}>
      {/* Step info */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Current Step</h3>
        <div className={styles.stepBox}>
          <div className={styles.stepCounter}>
            {currentStep === -1
              ? 'Not started'
              : `Step ${currentStep + 1} of ${totalSteps}`}
          </div>
          <div className={styles.stepDesc}>
            {step?.description ?? 'Press Play or Next to begin.'}
          </div>
        </div>
      </section>

      {/* Pseudocode */}
      {code.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Code</h3>
          <div className={styles.codeBlock}>
            {code.map((line, i) => (
              <div
                key={i}
                ref={activeCodeLine === i ? activeLineRef : null}
                className={`${styles.codeLine} ${activeCodeLine === i ? styles.codeLineActive : ''}`}
              >
                {line}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      {Object.keys(stats).length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Statistics</h3>
          <div className={styles.statsGrid}>
            {Object.entries(stats).map(([label, value]) => (
              <div key={label} className={styles.statItem}>
                <div className={styles.statValue}>{value ?? 0}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legend */}
      {legend.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Legend</h3>
          <div className={styles.legend}>
            {legend.map(item => (
              <div key={item.token} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: `var(--color-${item.token})` }}
                />
                <span className={styles.legendLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live complexity chart + static badge */}
      {(complexity?.time || complexity?.space) && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Time Complexity</h3>
          <LiveComplexityChart
            hook={hook}
            stats={stats}
            timeComplexity={complexity.time}
          />
          {/* static space badge */}
          {complexity.space && (
            <div className={styles.spaceRow}>
              <span className={styles.spaceLabel}>Space</span>
              <SpaceBadge raw={complexity.space} />
            </div>
          )}
        </section>
      )}
    </aside>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* LiveComplexityChart — SVG line chart that grows step by step               */
/* ─────────────────────────────────────────────────────────────────────────── */

const W = 260, H = 130, PAD = { top: 8, right: 12, bottom: 28, left: 34 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top  - PAD.bottom

/** Generate the theoretical curve points (0..N steps) for a given Big-O tier */
function theoreticalPoints(tierKey, N) {
  if (N < 2) return []
  const pts = []
  for (let i = 0; i <= N; i++) {
    const x = i / N
    let y
    switch (tierKey) {
      case 'O(1)':       y = 1;                          break
      case 'O(log n)':   y = Math.log2(1 + x * N + 1);  break
      case 'O(n)':       y = x;                          break
      case 'O(n log n)': y = x * Math.log2(1 + x * N);  break
      case 'O(n²)':      y = x * x;                      break
      case 'O(2ⁿ)':      y = Math.min(1, Math.pow(2, x * N) / Math.pow(2, N)); break
      case 'O(n!)':      y = x;                          break  // factorial too extreme; show linear stand-in
      default:           y = x;
    }
    pts.push({ x, y })
  }
  // normalise y to [0,1]
  const maxY = Math.max(...pts.map(p => p.y), 1e-9)
  return pts.map(p => ({ x: p.x, y: p.y / maxY }))
}

/** Convert unit [0,1] coords to SVG pixel coords */
function toSVG(xUnit, yUnit) {
  return {
    x: PAD.left + xUnit * CW,
    y: PAD.top  + (1 - yUnit) * CH,
  }
}

/** Points array → SVG polyline points string */
function polyline(pts) {
  return pts.map(p => {
    const s = toSVG(p.x, p.y)
    return `${s.x.toFixed(1)},${s.y.toFixed(1)}`
  }).join(' ')
}

function LiveComplexityChart({ hook, stats, timeComplexity }) {
  const currentStep = hook?.currentStep ?? -1
  const totalSteps  = hook?.totalSteps  ?? 0

  // Accumulate total ops from stats on each step (sum all numeric values)
  const totalOps = useMemo(() => {
    const nums = Object.values(stats ?? {}).filter(v => typeof v === 'number')
    return nums.length ? nums.reduce((a, b) => a + b, 0) : 0
  }, [stats])

  // History: array of {step, ops} kept in a ref so it persists across renders
  const historyRef = useRef([])

  // Reset history when algorithm/test changes (step goes back to -1)
  useEffect(() => {
    if (currentStep === -1) historyRef.current = []
  }, [currentStep])

  // Append current point whenever step advances
  useEffect(() => {
    if (currentStep < 0) return
    const last = historyRef.current[historyRef.current.length - 1]
    if (!last || last.step !== currentStep) {
      historyRef.current = [...historyRef.current, { step: currentStep, ops: totalOps }]
    }
  })

  const history = historyRef.current
  const tier    = classifyComplexity(timeComplexity)
  const color   = COMPLEXITY_COLORS.time   // blue

  // Theoretical curve scaled to totalSteps
  const N = Math.max(totalSteps, 1)
  const theoCurve = useMemo(() => theoreticalPoints(tier?.key ?? 'O(n)', N), [tier?.key, N]) // eslint-disable-line

  // Scale actual history to [0,1]
  const maxOps = Math.max(...history.map(h => h.ops), 1)
  const actualPts = history.map(h => ({
    x: N > 1 ? h.step / (N - 1) : 0,
    y: h.ops / maxOps,
  }))

  // Dot for the current point
  const dot = actualPts[actualPts.length - 1]

  // x-axis labels
  const xLabels = [0, Math.round(N / 2), N - 1].filter((v, i, a) => a.indexOf(v) === i)
  // y-axis labels
  const yTicks = [0, Math.round(maxOps / 2), maxOps]

  const hasData = history.length > 1

  return (
    <div className={styles.liveChart}>
      {/* Notation + tier badge at top */}
      <div className={styles.liveChartHeader}>
        <span className={styles.liveChartNotation} style={{ color }}>
          {tier?.key ?? timeComplexity ?? '—'}
        </span>
        <span className={styles.liveChartTier} style={{ color }}>
          {tier?.label ?? 'Custom'}
        </span>
        {hasData && (
          <span className={styles.liveChartOps}>
            {totalOps.toLocaleString()} ops
          </span>
        )}
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.liveChartSvg}
        aria-label={`Live time complexity chart — ${tier?.key ?? ''}`}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => {
          const y = toSVG(0, t).y
          return (
            <line key={t}
              x1={PAD.left} y1={y} x2={PAD.left + CW} y2={y}
              stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3"
            />
          )
        })}

        {/* Y-axis ticks */}
        {yTicks.map(v => {
          const yFrac = maxOps > 0 ? v / maxOps : 0
          const sv    = toSVG(0, yFrac)
          return (
            <text key={v}
              x={PAD.left - 4} y={sv.y + 3.5}
              textAnchor="end" fontSize="9" fill="var(--text-muted)"
            >
              {v > 999 ? `${(v/1000).toFixed(1)}k` : v}
            </text>
          )
        })}

        {/* X-axis ticks */}
        {xLabels.map(v => {
          const xFrac = N > 1 ? v / (N - 1) : 0
          const sv    = toSVG(xFrac, 0)
          return (
            <text key={v}
              x={sv.x} y={H - PAD.bottom + 12}
              textAnchor="middle" fontSize="9" fill="var(--text-muted)"
            >
              {v}
            </text>
          )
        })}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CH}
          stroke="var(--border-strong)" strokeWidth="1" />
        <line x1={PAD.left} y1={PAD.top + CH} x2={PAD.left + CW} y2={PAD.top + CH}
          stroke="var(--border-strong)" strokeWidth="1" />

        {/* X-axis label */}
        <text x={PAD.left + CW / 2} y={H - 2}
          textAnchor="middle" fontSize="9" fill="var(--text-muted)">
          Steps
        </text>

        {/* Y-axis label */}
        <text
          x={10} y={PAD.top + CH / 2}
          textAnchor="middle" fontSize="9" fill="var(--text-muted)"
          transform={`rotate(-90, 10, ${PAD.top + CH / 2})`}
        >
          Ops
        </text>

        {/* Theoretical curve (dashed) */}
        {theoCurve.length > 1 && (
          <polyline
            points={polyline(theoCurve)}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="5,3"
            opacity="0.35"
          />
        )}

        {/* Actual ops curve (solid) */}
        {hasData && (
          <>
            {/* Area fill under actual */}
            <polyline
              points={[
                `${toSVG(actualPts[0].x, 0).x.toFixed(1)},${(PAD.top + CH).toFixed(1)}`,
                ...actualPts.map(p => {
                  const s = toSVG(p.x, p.y)
                  return `${s.x.toFixed(1)},${s.y.toFixed(1)}`
                }),
                `${toSVG(actualPts[actualPts.length-1].x, 0).x.toFixed(1)},${(PAD.top + CH).toFixed(1)}`,
              ].join(' ')}
              fill={color}
              opacity="0.08"
              stroke="none"
            />
            <polyline
              points={polyline(actualPts)}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Live dot */}
            {dot && (() => {
              const s = toSVG(dot.x, dot.y)
              return (
                <circle cx={s.x} cy={s.y} r="4"
                  fill={color} stroke="var(--bg-surface)" strokeWidth="2"
                />
              )
            })()}
          </>
        )}

        {/* "Not started" overlay */}
        {!hasData && (
          <text
            x={PAD.left + CW / 2} y={PAD.top + CH / 2 + 4}
            textAnchor="middle" fontSize="11" fill="var(--text-muted)"
          >
            Press Play to begin
          </text>
        )}
      </svg>

      {/* Legend row */}
      <div className={styles.liveChartLegend}>
        <span className={styles.liveChartLegendItem}>
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={color} strokeWidth="2"/></svg>
          Actual
        </span>
        <span className={styles.liveChartLegendItem}>
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5"/></svg>
          Theoretical {tier?.key ?? ''}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Space badge — static pill                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
function SpaceBadge({ raw }) {
  const tier  = classifyComplexity(raw)
  const color = COMPLEXITY_COLORS.space
  return (
    <div className={styles.spaceBadge} style={{ borderColor: `${color}44` }}>
      <span className={styles.spaceBadgeNotation} style={{ color }}>
        {tier?.key ?? raw}
      </span>
      <span className={styles.spaceBadgeTier} style={{ color }}>
        {tier?.label ?? 'Custom'}
      </span>
    </div>
  )
}

/** Side-by-side complexity column — kept for potential reuse */
function ComplexityCol({ label, raw, color }) {
  const tier = classifyComplexity(raw)
  if (!tier) return (
    <div className={styles.complexityCol}>
      <div className={styles.complexityColLabel}>{label}</div>
      <div className={styles.complexityNA}>—</div>
    </div>
  )
  return (
    <div className={styles.complexityCol}>
      <div className={styles.complexityColLabel}>{label}</div>
      <div className={styles.complexityNotation} style={{ color }}>{tier.key}</div>
      <div className={styles.complexityTrack}>
        <div
          className={styles.complexityFill}
          style={{ width: `${tier.width}%`, background: color }}
        />
      </div>
      <div className={styles.complexityTier} style={{ color }}>{tier.label}</div>
    </div>
  )
}
