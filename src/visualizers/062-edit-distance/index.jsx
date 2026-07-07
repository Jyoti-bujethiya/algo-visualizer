import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './EditDistance.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "horse"/"ros"',    detail: 'Answer: 3', word1: 'horse', word2: 'ros'    },
  { label: 'Test 2 — "intention"/"execution"', detail: 'Answer: 5', word1: 'intention', word2: 'execution' },
  { label: 'Test 3 — "abc"/"abc"',      detail: 'Answer: 0', word1: 'abc',   word2: 'abc'    },
  { label: 'Test 4 — "sunday"/"saturday"', detail: 'Answer: 3', word1: 'sunday', word2: 'saturday' },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up 2D DP', complexity: 'O(m·n) time · O(m·n) space' },
]

const CODE = {
  tab: [
    'function minDistance(word1, word2):',
    '  dp[i][0]=i, dp[0][j]=j  // base cases',
    '  for i = 1 to m:',
    '    for j = 1 to n:',
    '      if word1[i-1] == word2[j-1]:',
    '        dp[i][j] = dp[i-1][j-1]',
    '      else:',
    '        dp[i][j] = 1 + min(dp[i-1][j],   // delete',
    '                           dp[i][j-1],   // insert',
    '                           dp[i-1][j-1]) // replace',
    '  return dp[m][n]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base cases (row 0 / col 0)' },
  { token: 'current', label: 'Currently filling' },
  { token: 'compare', label: 'Delete / insert / replace source' },
  { token: 'match',   label: 'Filled' },
]

/* ── Operation SVGs ── */
function DeleteSVG() {


  return (
    <svg viewBox="0 0 24 24" className={styles.opIcon}>
      {/* scissors */}
      <circle cx="6" cy="7" r="3" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
      <circle cx="6" cy="17" r="3" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
      <line x1="8.5" y1="9" x2="20" y2="20" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="8.5" y1="15" x2="20" y2="4" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function InsertSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.opIcon}>
      <circle cx="12" cy="12" r="9" fill="#d1fae5" stroke="#16a34a" strokeWidth="1.8"/>
      <line x1="12" y1="7" x2="12" y2="17" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function ReplaceSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.opIcon}>
      <path d="M4 12 Q4 6 12 6 Q18 6 20 10" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M20 12 Q20 18 12 18 Q6 18 4 14" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <polyline points="17,7 20,10 17,13" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,11 4,14 7,17" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MatchOpSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.opIcon}>
      <circle cx="12" cy="12" r="9" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8"/>
      <path d="M7 12 L10.5 15.5 L17 9" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function getOpInfo(op) {
  if (op === 'delete')  return { label: 'Delete',  icon: <DeleteSVG  />, cls: 'opDelete'  }
  if (op === 'insert')  return { label: 'Insert',  icon: <InsertSVG  />, cls: 'opInsert'  }
  if (op === 'replace') return { label: 'Replace', icon: <ReplaceSVG />, cls: 'opReplace' }
  if (op === 'match')   return { label: 'Match',   icon: <MatchOpSVG/>, cls: 'opMatch'   }
  return null
}

export default function EditDistanceVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "word1",
                "label": "word1",
                "type": "text",
                "placeholder": "horse"
            },
            {
                "key": "word2",
                "label": "word2",
                "type": "text",
                "placeholder": "ros"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ word1: parsed.word1, word2: parsed.word2 }); hook.reset()
      }}
    />
  )

  const { word1, word2 } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(word1, word2), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const m = word1.length, n = word2.length
  const dp = step?.dp ?? Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const lastOp     = step?.lastOp   // 'delete' | 'insert' | 'replace' | 'match'
  const activeI    = step?.activeI
  const activeJ    = step?.activeJ

  const colHeaders = ['', ...word2.split('')]
  const rowHeaders = ['', ...word1.split('')]
  const opInfo = getOpInfo(lastOp)

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'word1': word1,
        'word2': word2,
        ...(result !== undefined ? { 'Edit distance': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            <svg viewBox="0 0 22 22" className={styles.editIcon}><path d="M3 17 L7 17 L17 7 L13 3 L3 13 Z" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/><line x1="14" y1="5" x2="18" y2="9" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Edit Distance: {result}
          </div>
        )}

        {/* Word pair diff row */}
        <div className={styles.diffWrap}>
          {/* word1 row */}
          <div className={styles.diffRow}>
            <span className={styles.diffLabel}>W1:</span>
            {word1.split('').map((ch, i) => {
              const isActive = activeI !== undefined && i === activeI - 1
              return (
                <span key={i} className={`${styles.diffChar} ${isActive ? styles.diffCharActive : ''}`}>
                  {ch}
                </span>
              )
            })}
          </div>
          {/* word2 row */}
          <div className={styles.diffRow}>
            <span className={styles.diffLabel}>W2:</span>
            {word2.split('').map((ch, j) => {
              const isActive = activeJ !== undefined && j === activeJ - 1
              return (
                <span key={j} className={`${styles.diffChar} ${isActive ? styles.diffCharActive : ''}`}>
                  {ch}
                </span>
              )
            })}
          </div>

          {/* Current operation badge */}
          {opInfo && (
            <div className={`${styles.opBadge} ${styles[opInfo.cls]}`}>
              {opInfo.icon}
              <span>{opInfo.label}</span>
            </div>
          )}
        </div>

        <DPTableDisplay dp={dp} highlights={highlights} colHeaders={colHeaders} rowHeaders={rowHeaders} />
      </div>
    </VisualizerShell>
  )
}
