import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './MinWindow.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',         detail: 's="ADOBECODEBANC" t="ABC"',    s: 'ADOBECODEBANC', t: 'ABC'  },
  { label: 'Test 2 — Exact match',      detail: 's="a" t="a"',                  s: 'a',             t: 'a'   },
  { label: 'Test 3 — No valid window',  detail: 's="a" t="aa"',                 s: 'a',             t: 'aa'  },
  { label: 'Test 4 — Duplicates in t',  detail: 's="ADOBECODEBANC" t="AABC"',   s: 'ADOBECODEBANC', t: 'AABC' },
  { label: 'Test 5 — Short',            detail: 's="cabwefgewcwaefgcf" t="cae"', s: 'cabwefgewcwaefgcf', t: 'cae' },
]

const ALGORITHMS = [
  { id: 'sliding', name: 'Sliding Window (Optimal)', complexity: 'O(m+n) time · O(m+n) space' },
]

const CODE = {
  sliding: ['Build tCount from t', 'left=0, formed=0', 'for right in 0..m-1:', '  add s[right] to window', '  if window satisfies all t counts:', '    try shrinking from left', '    record if new minimum', '    remove s[left], left++', 'return minWindow'],
}

const LEGEND = [
  { token: 'current',  label: 'In current window' },
  { token: 'compare',  label: 'Window char that is in t' },
  { token: 'special',  label: 'New minimum window' },
  { token: 'match',    label: 'Final answer' },
  { token: 'discard',  label: 'Being removed (contract)' },
]


export default function MinWindowVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sliding')
  const [customCase,   setCustomCase]   = useState(null)

  const { s, t } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, s, t), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const chars = s.split('')
  const tSet  = new Set(t.split(''))

  const getState = (i) => {
    if (!step) return ''
    const { left, right, minLeft, minRight, phase } = step
    const inWindow = right >= 0 && i >= left && i <= right
    const inBest   = minLeft >= 0 && i >= minLeft && i <= minRight

    if (phase === 'complete' && inBest)              return 'match'
    if (phase === 'newmin'   && inWindow)             return 'special'
    if (phase === 'contract' && i === left - 1)       return 'discard'
    if (inWindow && tSet.has(chars[i]))               return 'compare'
    if (inWindow)                                     return 'current'
    return ''
  }

  const tCount  = step?.tCount       ?? {}
  const wCount  = step?.windowCount  ?? {}
  const tEntries = Object.keys(tCount)


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "s",
                "label": "s",
                "type": "text",
                "placeholder": "ADOBECODEBANC"
            },
            {
                "key": "t",
                "label": "t",
                "type": "text",
                "placeholder": "ABC"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ s: parsed.s, t: parsed.t }); hook.reset()
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
        'Left':    step.left,
        'Right':   step.right >= 0 ? step.right : '—',
        'Formed':  `${step.formed} / ${step.required}`,
        'Win Len': step.right >= step.left && step.right >= 0 ? step.right - step.left + 1 : 0,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* String display */}
        <div className={styles.charRow}>
          {chars.map((ch, i) => {
            const state   = getState(i)
            const isLeft  = step && i === step.left && step.left <= step.right
            const isRight = step && i === step.right && step.right >= 0
            return (
              <div key={i} className={`${styles.cell} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {isLeft  && <PointerLabel label="L" type="current" />}
                  {isRight && <PointerLabel label="R" type="compare" />}
                </div>
                <div className={styles.charVal}>{ch}</div>
                <div className={styles.charIdx}>{i}</div>
              </div>
            )
          })}
        </div>

        {/* Best window display */}
        <div className={styles.bestRow}>
          <span className={styles.bestLabel}>Best window:</span>
          <span className={styles.bestValue}>
            {step?.minLeft >= 0 ? `"${s.slice(step.minLeft, step.minRight + 1)}"` : '—'}
          </span>
        </div>

        {/* t-count tracker */}
        {tEntries.length > 0 && (
          <div className={styles.counts}>
            <div className={styles.countsTitle}>Character counts (have / need)</div>
            <div className={styles.countGrid}>
              {tEntries.map(ch => {
                const need = tCount[ch], have = wCount[ch] || 0, met = have >= need
                return (
                  <div key={ch} className={`${styles.countEntry} ${met ? styles.met : styles.need}`}>
                    <span className={styles.countChar}>'{ch}'</span>
                    <span className={styles.countSep}>:</span>
                    <span className={styles.countHave}>{have}</span>
                    <span className={styles.countSlash}>/</span>
                    <span className={styles.countNeed}>{need}</span>
                    <span className={styles.countStatus}>{met ? '✓' : '✗'}</span>
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
