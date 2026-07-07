import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './LCS.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "abcde" / "ace"',   detail: 'LCS=3',  text1: 'abcde', text2: 'ace' },
  { label: 'Test 2 — "abc" / "abc"',     detail: 'LCS=3',  text1: 'abc',   text2: 'abc' },
  { label: 'Test 3 — "abc" / "def"',     detail: 'LCS=0',  text1: 'abc',   text2: 'def' },
  { label: 'Test 4 — "oxcpqr" / "xmjyauz"', detail: 'LCS=3', text1: 'oxcpqr', text2: 'xmjyauz' },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up 2D DP', complexity: 'O(m·n) time · O(m·n) space' },
]

const CODE = {
  tab: [
    'function lcs(text1, text2):',
    '  dp = (m+1)×(n+1) table, all 0',
    '  for i = 1 to m:',
    '    for j = 1 to n:',
    '      if text1[i-1] == text2[j-1]:',
    '        dp[i][j] = dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '  return dp[m][n]',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Cell being filled' },
  { token: 'compare', label: 'Cells used in formula' },
  { token: 'match',   label: 'Filled' },
]

/* ── Char-match sparkle SVG ── */
function MatchSparkSVG() {


  return (
    <svg viewBox="0 0 20 20" className={styles.sparkIcon}>
      <path d="M10,2 L11.5,8.5 L18,10 L11.5,11.5 L10,18 L8.5,11.5 L2,10 L8.5,8.5 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8"/>
    </svg>
  )
}

export default function LCSVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "text1",
                "label": "text1",
                "type": "text",
                "placeholder": "abcde"
            },
            {
                "key": "text2",
                "label": "text2",
                "type": "text",
                "placeholder": "ace"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ text1: parsed.text1, text2: parsed.text2 }); hook.reset()
      }}
    />
  )

  const { text1, text2 } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(text1, text2), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const m = text1.length, n = text2.length
  const dp         = step?.dp ?? Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeI    = step?.activeI  // current row being filled
  const activeJ    = step?.activeJ  // current col being filled
  const isMatch    = step?.isMatch  // whether text1[i-1] == text2[j-1]

  const colHeaders = ['', ...text2.split('')]
  const rowHeaders = ['', ...text1.split('')]

  // Find matching character positions for display
  const matchPairs = []
  for (let i = 0; i < text1.length; i++) {
    for (let j = 0; j < text2.length; j++) {
      if (text1[i] === text2[j]) matchPairs.push([i, j])
    }
  }

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'text1': text1,
        'text2': text2,
        ...(result !== undefined ? { 'LCS length': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            <MatchSparkSVG />
            LCS Length: {result}
          </div>
        )}

        {/* Char alignment display */}
        <div className={styles.alignWrap}>
          {/* text1 row */}
          <div className={styles.alignRow}>
            <span className={styles.alignLabel}>T1:</span>
            {text1.split('').map((ch, i) => {
              const isActive = activeI !== undefined && i === activeI - 1
              const isCommon = matchPairs.some(([pi]) => pi === i)
              return (
                <span
                  key={i}
                  className={`${styles.alignChar} ${isActive ? styles.alignCharActive : isCommon ? styles.alignCharCommon : ''}`}
                >
                  {ch}
                </span>
              )
            })}
          </div>
          {/* text2 row */}
          <div className={styles.alignRow}>
            <span className={styles.alignLabel}>T2:</span>
            {text2.split('').map((ch, j) => {
              const isActive = activeJ !== undefined && j === activeJ - 1
              const isCommon = matchPairs.some(([, pj]) => pj === j)
              return (
                <span
                  key={j}
                  className={`${styles.alignChar} ${isActive ? styles.alignCharActive : isCommon ? styles.alignCharCommon : ''}`}
                >
                  {ch}
                </span>
              )
            })}
          </div>
          {/* Match indicator */}
          {isMatch && (
            <div className={styles.matchRow}>
              <MatchSparkSVG />
              <span className={styles.matchText}>Match: {text1[activeI - 1]}</span>
            </div>
          )}
        </div>

        <DPTableDisplay
          dp={dp}
          highlights={highlights}
          colHeaders={colHeaders}
          rowHeaders={rowHeaders}
        />
      </div>
    </VisualizerShell>
  )
}
