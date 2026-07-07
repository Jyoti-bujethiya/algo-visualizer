import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './LongestPalin.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',   detail: '"babad"',    str: 'babad' },
  { label: 'Test 2 — Even',      detail: '"cbbd"',     str: 'cbbd' },
  { label: 'Test 3 — Full',      detail: '"racecar"',  str: 'racecar' },
  { label: 'Test 4 — All same',  detail: '"aaaa"',     str: 'aaaa' },
  { label: 'Test 5 — Mixed',     detail: '"abacaba"',  str: 'abacaba' },
  { label: 'Test 6 — Single',    detail: '"a"',        str: 'a' },
]

const ALGORITHMS = [
  { id: 'expand',   name: 'Expand Around Center', complexity: 'O(n²) time · O(1) space' },
  { id: 'dp',       name: 'Dynamic Programming',  complexity: 'O(n²) time · O(n²) space' },
  { id: 'manacher', name: "Manacher's Algorithm", complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  expand:   ['for i in 0..n-1:', '  expand from center i (odd)', '  expand from center i,i+1 (even)', '  update best'],
  dp:       ['dp[i][i] = true for all i', 'check len-2 pairs', 'for len=3..n: dp[i][j] = s[i]==s[j] && dp[i+1][j-1]', 'track best'],
  manacher: ['transform s → "#a#b#…#"', 'for i in 1..n-1:', '  p[i] = mirror or 0', '  expand while match', '  update C, R'],
}

const LEGEND = [
  { token: 'current', label: 'Expansion center' },
  { token: 'compare', label: 'Current expansion window' },
  { token: 'special', label: 'Current best palindrome' },
  { token: 'match',   label: 'Final answer' },
]

export default function LongestPalinVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('expand')
  const [customCase,   setCustomCase]   = useState(null)

  const { str } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, str), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const chars = str.split('')

  const getState = (i) => {
    if (!step) return ''
    const { expandL, expandR, bestL, bestR, centerL, centerR, complete } = step
    if (complete && i >= bestL && i <= bestR)               return 'match'
    if (expandL >= 0 && i >= expandL && i <= expandR)       return 'compare'
    if (i === centerL || i === centerR)                      return 'current'
    if (i >= bestL && i <= bestR)                            return 'special'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "str",
                "label": "String",
                "type": "text",
                "placeholder": "babad"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ str: parsed.str }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Window': step.expandL >= 0 && step.expandR >= step.expandL ? `[${step.expandL}..${step.expandR}]` : '—',
        'Len':    step.expandL >= 0 && step.expandR >= step.expandL ? step.expandR - step.expandL + 1 : '—',
        'Best':   `"${str.slice(step.bestL, step.bestR + 1)}"`,
        'Best Len': step.bestR - step.bestL + 1,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Character row */}
        <div className={styles.charRow}>
          {chars.map((ch, i) => {
            const state = getState(i)
            const { expandL, expandR, centerL, centerR } = step ?? {}
            const isCenter = i === centerL || i === centerR
            const isEdgeL  = i === expandL && expandL !== centerL
            const isEdgeR  = i === expandR && expandR !== centerR
            return (
              <div key={i} className={`${styles.cell} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {isCenter && <PointerLabel label="c"  type="current" />}
                  {isEdgeL  && <PointerLabel label="L"  type="compare" />}
                  {isEdgeR  && <PointerLabel label="R"  type="compare" />}
                </div>
                <div className={styles.charVal}>{ch}</div>
                <div className={styles.charIdx}>{i}</div>
              </div>
            )
          })}
        </div>

        {/* Expansion bracket */}
        {step?.expandL >= 0 && step?.expandR >= step?.expandL && !step?.complete && (
          <div className={styles.expandLabel}>
            Current window: &ldquo;{str.slice(step.expandL, step.expandR + 1)}&rdquo;
          </div>
        )}

        {/* Best so far */}
        {step?.bestL >= 0 && (
          <div className={styles.bestLabel}>
            Best: &ldquo;{str.slice(step.bestL, step.bestR + 1)}&rdquo; (length {step.bestR - step.bestL + 1})
          </div>
        )}

        {/* Manacher p-array */}
        {selectedAlgo === 'manacher' && step?.pArr && step?.transformed && (
          <div className={styles.manacherSection}>
            <div className={styles.manacherTitle}>Transformed string + p[]</div>
            <div className={styles.manacherRow}>
              {step.transformed.split('').map((ch, i) => {
                const isCurr  = step.ti === i
                const inPalin = step.ti >= 0 && Math.abs(i - step.ti) <= (step.pArr[step.ti] ?? 0)
                return (
                  <div key={i} className={`${styles.mCell} ${isCurr ? styles.mCurrent : inPalin ? styles.mPalin : ''}`}>
                    <div className={styles.mChar}>{ch}</div>
                    {step.pArr[i] > 0 && <div className={styles.mP}>{step.pArr[i]}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
