import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './ClimbingStairs.module.css'

const TEST_CASES = [
  { label: 'Test 1 — n=5', detail: '8 ways',   n: 5  },
  { label: 'Test 2 — n=6', detail: '13 ways',  n: 6  },
  { label: 'Test 3 — n=3', detail: '3 ways',   n: 3  },
  { label: 'Test 4 — n=10',detail: '89 ways',  n: 10 },
]

const ALGORITHMS = [
  { id: 'tab',  name: 'Bottom-up (Tabulation)', complexity: 'O(n) time · O(n) space' },
  { id: 'memo', name: 'Top-down (Memoization)', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  tab: [
    'function climbStairs(n):',
    '  dp = array of size n+1',
    '  dp[0] = 1; dp[1] = 1',
    '  for i = 2 to n:',
    '    dp[i] = dp[i-1] + dp[i-2]',
    '  return dp[n]',
  ],
  memo: [
    'function climbStairs(n):',
    '  memo = {}',
    '  function dp(i):',
    '    if i <= 1: return 1',
    '    if i in memo: return memo[i]',
    '    memo[i] = dp(i-1) + dp(i-2)',
    '    return memo[i]',
    '  return dp(n)',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (step 0, 1)' },
  { token: 'current', label: 'Step being computed now' },
  { token: 'compare', label: 'Dependencies (dp[i-1], dp[i-2])' },
  { token: 'match',   label: 'Computed ✓' },
]

/* ── Stick-figure climber SVG ── */
function ClimberSVG() {
  return (
    <svg viewBox="0 0 24 36" fill="none" className={styles.climberSvg}>
      {/* head */}
      <circle cx="12" cy="5" r="4" fill="#1d4ed8" stroke="#fff" strokeWidth="1"/>
      {/* body */}
      <line x1="12" y1="9" x2="12" y2="22" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round"/>
      {/* arms raised */}
      <line x1="12" y1="13" x2="4"  y2="9"  stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="13" x2="20" y2="9"  stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
      {/* legs */}
      <line x1="12" y1="22" x2="7"  y2="32" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="22" x2="17" y2="32" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function getStepClass(i, highlights, styles) {
  const h = highlights[String(i)]
  if (h === 'special') return styles.stepBase
  if (h === 'current') return styles.stepCurrent
  if (h === 'compare') return styles.stepCompare
  if (h === 'match')   return styles.stepDone
  return styles.stepEmpty
}

export default function ClimbingStairsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const { n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, n), [selectedAlgo, n]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(n + 1).fill(null)
  const highlights = step?.highlights ?? {}
  const result     = step?.result

  const climberStep = dp.reduce((acc, v, i) => v !== null ? i : acc, 0)

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'n', label: 'Stairs (n)', type: 'number', placeholder: '7' }]}
      onApply={({ n: val }) => {
        const clamped = Math.max(1, Math.min(15, Math.round(val)))
        setCustomCase({ n: clamped })
        hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'n (steps)': n,
        ...(result !== undefined ? { 'Ways': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            🪜 Ways to climb {n} stairs: <strong>{result}</strong>
          </div>
        )}

        {/* ── Staircase ── */}
        <div className={styles.staircaseWrap}>
          <div className={styles.staircase}>
            {/* Steps drawn right-to-left, ascending left-to-right */}
            {Array.from({ length: n + 1 }, (_, i) => {
              const stepIdx = n - i          // step n is highest (rightmost in ascending layout)
              const cls = getStepClass(stepIdx, highlights, styles)
              const val = dp[stepIdx]
              const isClimber = stepIdx === climberStep && val !== null
              return (
                <div
                  key={stepIdx}
                  className={`${styles.stairStep} ${cls}`}
                  style={{ height: `${24 + stepIdx * 18}px` }}
                >
                  {isClimber && (
                    <div className={styles.climberWrap}>
                      <ClimberSVG />
                    </div>
                  )}
                  <span className={styles.stepVal}>{val !== null ? val : '?'}</span>
                  <span className={styles.stepLabel}>{stepIdx}</span>
                </div>
              )
            })}
          </div>
          <div className={styles.groundLine} />
        </div>
      </div>
    </VisualizerShell>
  )
}
