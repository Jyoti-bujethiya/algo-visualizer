import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './DailyTemps.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [73,74,75,71,69,72,76,73]', detail: '[1,1,4,2,1,1,0,0]', temps:[73,74,75,71,69,72,76,73] },
  { label: 'Test 2 — [30,40,50,60]',              detail: '[1,1,1,0]',          temps:[30,40,50,60] },
  { label: 'Test 3 — [30,60,90]',                 detail: '[1,1,0]',            temps:[30,60,90] },
  { label: 'Test 4 — [89,62,70,58,47,47,46,76,100,70]', detail: '[8,1,5,4,3,2,1,1,0,0]', temps:[89,62,70,58,47,47,46,76,100,70] },
]

const ALGORITHMS = [
  { id: 'mono', name: 'Monotonic Stack', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  mono: [
    'function dailyTemperatures(T):',
    '  answer=[0,...]; stack=[]',
    '  for i = 0 to n-1:',
    '    while stack and T[i] > T[stack.top]:',
    '      j = stack.pop()',
    '      answer[j] = i - j',
    '    stack.push(i)',
    '  return answer',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Today ☀️/🌤️' },
  { token: 'compare', label: 'On the stack (waiting)' },
  { token: 'match',   label: 'Warmer day found → answer set' },
]

/* ── Sun SVG for hot days ── */
function SunSVG() {


  return (
    <svg viewBox="0 0 28 28" className={styles.weatherIcon}>
      <circle cx="14" cy="14" r="6" fill="#f59e0b"/>
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = a * Math.PI / 180
        return <line key={a} x1={14+9*Math.cos(r)} y1={14+9*Math.sin(r)} x2={14+12*Math.cos(r)} y2={14+12*Math.sin(r)} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      })}
    </svg>
  )
}

/* ── Cloud SVG for cool days ── */
function CloudSVG() {
  return (
    <svg viewBox="0 0 28 20" className={styles.weatherIconWide}>
      <ellipse cx="14" cy="13" rx="10" ry="6" fill="#94a3b8"/>
      <circle cx="10" cy="11" r="5" fill="#94a3b8"/>
      <circle cx="16" cy="9"  r="6" fill="#cbd5e1"/>
      <ellipse cx="14" cy="13" rx="10" ry="6" fill="#cbd5e1"/>
    </svg>
  )
}

/* ── Thermometer SVG for stack items ── */
function ThermSVG({ temp, maxTemp }) {
  const pct = Math.max(0.1, temp / maxTemp)
  return (
    <svg viewBox="0 0 20 44" className={styles.thermSvg}>
      {/* tube */}
      <rect x="7" y="4" width="6" height="28" rx="3" fill="#e5e7eb"/>
      {/* mercury fill */}
      <rect x="8" y={4 + 28 * (1 - pct)} width="4" height={28 * pct} rx="2" fill="#ef4444"/>
      {/* bulb */}
      <circle cx="10" cy="35" r="6" fill="#ef4444"/>
      {/* glass shine */}
      <rect x="9" y="5" width="1.5" height="18" rx="1" fill="#fff" opacity="0.5"/>
    </svg>
  )
}

function getBarState(i, highlights) {
  const h = highlights[String(i)]
  if (h === 'current') return 'current'
  if (h === 'compare') return 'stacked'
  if (h === 'match')   return 'popped'
  return 'neutral'
}

export default function DailyTemperaturesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('mono')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "temps",
                "label": "Temperatures",
                "type": "array",
                "placeholder": "73,74,75,71,69,72,76,73"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ temps: parsed.temps }); hook.reset()
      }}
    />
  )
  const { temps } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(temps), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const stack      = step?.stack      ?? []
  const answer     = step?.answer     ?? new Array(temps.length).fill(0)
  const highlights = step?.highlights ?? {}

  const maxT  = Math.max(...temps, 1)
  const HOT_THRESH = maxT * 0.7   // top 30% = hot (sun), below = cloud

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? { 'n': temps.length, 'Stack depth': stack.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* ── Bar chart with weather icons ── */}
        <div className={styles.label}>Temperatures</div>
        <div className={styles.chart}>
          {temps.map((t, i) => {
            const state  = getBarState(i, highlights)
            const frac   = t / (maxT + 10)
            const isHot  = t >= HOT_THRESH
            return (
              <div key={i} className={styles.barCol}>
                {/* weather icon above bar */}
                <div className={styles.iconSlot}>
                  {state === 'current'
                    ? (isHot ? <SunSVG /> : <CloudSVG />)
                    : state === 'popped'
                      ? <SunSVG />
                      : null
                  }
                </div>
                {/* answer days badge */}
                {answer[i] > 0 && (
                  <div className={styles.answerBadge}>+{answer[i]}d</div>
                )}
                {/* bar */}
                <div
                  className={`${styles.bar} ${
                    state === 'current' ? styles.barCurrent :
                    state === 'stacked' ? styles.barStacked :
                    state === 'popped'  ? styles.barPopped  : ''
                  }`}
                  style={{ height: `${Math.max(frac * 140, 12)}px` }}
                >
                  <span className={styles.barTemp}>{t}</span>
                </div>
                <div className={styles.barIdx}>[{i}]</div>
              </div>
            )
          })}
        </div>

        {/* ── Monotonic stack ── */}
        <div className={styles.label}>Stack (indices) — top →</div>
        <div className={styles.stackRow}>
          {stack.length === 0
            ? <span className={styles.empty}>[ empty ]</span>
            : [...stack].reverse().map((idx, i) => (
              <div key={i} className={`${styles.stackCell} ${i === 0 ? styles.stackTop : ''}`}>
                <ThermSVG temp={temps[idx]} maxTemp={maxT} />
                <span className={styles.stackIdx}>{idx}</span>
                <span className={styles.stackTemp}>{temps[idx]}°</span>
              </div>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
