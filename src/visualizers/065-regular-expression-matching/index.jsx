import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './RegexMatching.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "aa" / "a*"',     detail: 'true',  s: 'aa',    p: 'a*'    },
  { label: 'Test 2 — "aa" / "a"',      detail: 'false', s: 'aa',    p: 'a'     },
  { label: 'Test 3 — "ab" / ".*"',     detail: 'true',  s: 'ab',    p: '.*'    },
  { label: 'Test 4 — "aab" / "c*a*b"', detail: 'true',  s: 'aab',   p: 'c*a*b' },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up 2D DP', complexity: 'O(m·n) time · O(m·n) space' },
]

const CODE = {
  tab: [
    'function isMatch(s, p):',
    '  dp[0][0]=true; handle p[j-1]="*" in row 0',
    '  for j=1..n: if p[j-1]=="*": dp[0][j]=dp[0][j-2]',
    '  for i=1 to m:',
    '    for j=1 to n:',
    '      if p[j-1]=="." or p[j-1]==s[i-1]:',
    '        dp[i][j] = dp[i-1][j-1]',
    '      elif p[j-1]=="*":',
    '        dp[i][j] = dp[i][j-2]  // zero uses',
    '        if p[j-2] matches s[i-1]:',
    '          dp[i][j] |= dp[i-1][j]  // one+ uses',
    '  return dp[m][n]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (dp[0][0] / star patterns)' },
  { token: 'current', label: 'Currently filling' },
  { token: 'compare', label: 'Source cell used' },
  { token: 'match',   label: 'True — matches' },
  { token: 'discard', label: 'False — no match' },
]

/* ── Pattern char type badge ── */
function PatCharBadge({ ch }) {
  const isDot  = ch === '.'
  const isStar = ch === '*'
  const cls    = isDot ? styles.patDot : isStar ? styles.patStar : styles.patLit
  const title  = isDot ? 'any char' : isStar ? 'zero or more' : 'literal'


  return (
    <span className={`${styles.patBadge} ${cls}`} title={title}>
      {ch}
      {(isDot || isStar) && <sup className={styles.patSup}>{isDot ? '?' : '*'}</sup>}
    </span>
  )
}

/* ── String char display ── */
function StrCharBadge({ ch, isActive }) {
  return (
    <span className={`${styles.strBadge} ${isActive ? styles.strBadgeActive : ''}`}>
      {ch}
    </span>
  )
}

export default function RegexMatchingVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "s",
                "label": "s",
                "type": "text",
                "placeholder": "aa"
            },
            {
                "key": "p",
                "label": "pattern p",
                "type": "text",
                "placeholder": "a*"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ s: parsed.s, p: parsed.p }); hook.reset()
      }}
    />
  )

  const { s, p } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s, p), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const m = s.length, n = p.length
  const dp = step?.dp ?? Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false))
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeI    = step?.activeI
  const activeJ    = step?.activeJ

  const colHeaders = ['', ...p.split('')]
  const rowHeaders = ['', ...s.split('')]

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        's': s,
        'p': p,
        ...(result !== undefined ? { 'Matches': result ? 'Yes ✓' : 'No ✗' } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? `"${s}" matches "${p}" ✓` : `"${s}" does NOT match "${p}" ✗`}
          </div>
        )}

        {/* Aligned char header rows */}
        <div className={styles.headerWrap}>
          {/* String s */}
          <div className={styles.headerRow}>
            <span className={styles.headerLabel}>s:</span>
            {s.split('').map((ch, i) => (
              <StrCharBadge key={i} ch={ch} isActive={activeI !== undefined && i === activeI - 1} />
            ))}
          </div>
          {/* Pattern p with type badges */}
          <div className={styles.headerRow}>
            <span className={styles.headerLabel}>p:</span>
            {p.split('').map((ch, j) => (
              <PatCharBadge key={j} ch={ch} isActive={activeJ !== undefined && j === activeJ - 1} />
            ))}
          </div>
        </div>

        <DPTableDisplay
          dp={dp.map(row => row.map(v => v ? 'T' : 'F'))}
          highlights={highlights}
          colHeaders={colHeaders}
          rowHeaders={rowHeaders}
        />
      </div>
    </VisualizerShell>
  )
}
