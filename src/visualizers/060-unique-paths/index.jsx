import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './UniquePaths.module.css'

const TEST_CASES = [
  { label: 'Test 1 — 3×7',  detail: 'Answer: 28',  m: 3, n: 7 },
  { label: 'Test 2 — 3×2',  detail: 'Answer: 3',   m: 3, n: 2 },
  { label: 'Test 3 — 4×4',  detail: 'Answer: 20',  m: 4, n: 4 },
  { label: 'Test 4 — 5×5',  detail: 'Answer: 70',  m: 5, n: 5 },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up 2D DP', complexity: 'O(m·n) time · O(m·n) space' },
]

const CODE = {
  tab: [
    'function uniquePaths(m, n):',
    '  dp = m×n table, all 0',
    '  for j in range(n): dp[0][j] = 1  // top row',
    '  for i in range(m): dp[i][0] = 1  // left col',
    '  for i = 1 to m-1:',
    '    for j = 1 to n-1:',
    '      dp[i][j] = dp[i-1][j] + dp[i][j-1]',
    '  return dp[m-1][n-1]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (row 0 / col 0)' },
  { token: 'current', label: 'Currently filling' },
  { token: 'compare', label: 'Top + Left cell (sources)' },
  { token: 'match',   label: 'Filled' },
]

/* ── Robot SVG ── */
function RobotSVG() {


  return (
    <svg viewBox="0 0 32 32" className={styles.cellIcon}>
      {/* antenna */}
      <line x1="16" y1="3" x2="16" y2="8" stroke="#2563eb" strokeWidth="1.5"/>
      <circle cx="16" cy="3" r="2" fill="#3b82f6"/>
      {/* head */}
      <rect x="9" y="8" width="14" height="10" rx="3" fill="#2563eb"/>
      <rect x="11" y="10" width="4" height="3" rx="1" fill="#93c5fd"/>
      <rect x="17" y="10" width="4" height="3" rx="1" fill="#93c5fd"/>
      {/* body */}
      <rect x="8" y="19" width="16" height="10" rx="2" fill="#1d4ed8"/>
      {/* arms */}
      <rect x="3"  y="20" width="4" height="7" rx="2" fill="#2563eb"/>
      <rect x="25" y="20" width="4" height="7" rx="2" fill="#2563eb"/>
      {/* legs */}
      <rect x="9"  y="29" width="5" height="3" rx="1.5" fill="#1e40af"/>
      <rect x="18" y="29" width="5" height="3" rx="1.5" fill="#1e40af"/>
      {/* chest light */}
      <circle cx="16" cy="24" r="2" fill="#60a5fa"/>
    </svg>
  )
}

/* ── Flag SVG ── */
function FlagSVG() {
  return (
    <svg viewBox="0 0 32 32" className={styles.cellIcon}>
      {/* pole */}
      <line x1="8" y1="4" x2="8" y2="28" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      {/* flag */}
      <path d="M8,4 L24,10 L8,16 Z" fill="#16a34a"/>
      {/* base */}
      <rect x="5" y="26" width="6" height="3" rx="1.5" fill="#374151"/>
    </svg>
  )
}

function getCellState(i, j, highlights) {
  const k = `${i},${j}`
  const h = highlights[k]
  if (h === 'special') return 'base'
  if (h === 'current') return 'current'
  if (h === 'compare') return 'compare'
  if (h === 'match')   return 'done'
  return 'empty'
}

function getCellClass(state, styles) {
  if (state === 'base')    return styles.cellBase
  if (state === 'current') return styles.cellCurrent
  if (state === 'compare') return styles.cellCompare
  if (state === 'done')    return styles.cellDone
  return styles.cellEmpty
}

export default function UniquePathsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "m",
                "label": "m (rows)",
                "type": "number",
                "placeholder": "3"
            },
            {
                "key": "n",
                "label": "n (cols)",
                "type": "number",
                "placeholder": "7"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ m: parsed.m, n: parsed.n }); hook.reset()
      }}
    />
  )

  const { m, n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(m, n), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? Array.from({ length: m }, () => new Array(n).fill(0))
  const highlights = step?.highlights ?? {}
  const result     = step?.result

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Grid': `${m}×${n}`,
        ...(result !== undefined ? { 'Unique paths': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>🤖 → 🏁 Paths: {result}</div>
        )}

        {/* ── dp grid ── */}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${n}, 52px)` }}
        >
          {dp.map((row, i) =>
            row.map((val, j) => {
              const state = getCellState(i, j, highlights)
              const cls   = getCellClass(state, styles)
              const isStart  = i === 0 && j === 0
              const isFinish = i === m - 1 && j === n - 1
              return (
                <div key={`${i},${j}`} className={`${styles.cell} ${cls}`}>
                  {isStart
                    ? <RobotSVG />
                    : isFinish
                      ? <FlagSVG />
                      : <span className={styles.cellVal}>{val > 0 ? val : ''}</span>
                  }
                </div>
              )
            })
          )}
        </div>
        <div className={styles.hint}>🤖 starts top-left · 🏁 goal is bottom-right · moves: → and ↓ only</div>
      </div>
    </VisualizerShell>
  )
}
