import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './MergeIntervals.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Overlap',    detail: '[[1,3],[2,6],[8,10],[15,18]]', intervals: [[1,3],[2,6],[8,10],[15,18]] },
  { label: 'Test 2 — Touch',      detail: '[[1,4],[4,5]]',                intervals: [[1,4],[4,5]] },
  { label: 'Test 3 — No overlap', detail: '[[1,2],[3,4],[5,6]]',          intervals: [[1,2],[3,4],[5,6]] },
  { label: 'Test 4 — Full cont.', detail: '[[1,10],[2,3],[4,5],[6,7]]',   intervals: [[1,10],[2,3],[4,5],[6,7]] },
  { label: 'Test 5 — Unsorted',   detail: '[[2,3],[4,5],[6,7],[8,9],[1,10]]', intervals: [[2,3],[4,5],[6,7],[8,9],[1,10]] },
]

const ALGORITHMS = [
  { id: 'sort',  name: 'Sort + Linear Scan', complexity: 'O(n log n) time · O(n) space' },
  { id: 'brute', name: 'Brute Force',        complexity: 'O(n²) time · O(n) space' },
]

const CODE = {
  sort:  ['Sort by start', 'result = [intervals[0]]', 'for iv in intervals[1:]:', '  if iv[0] <= result[-1][1]:', '    result[-1][1] = max(result[-1][1], iv[1])', '  else: result.append(iv)', 'return result'],
  brute: ['repeat until no merge:', '  for each pair (a, b):', '    if overlap: merge a into b, remove b', 'return result'],
}

const LEGEND = [
  { token: 'current', label: 'Active interval being checked' },
  { token: 'match',   label: 'Merged / appended' },
  { token: 'compare', label: 'Both intervals being compared' },
  { token: 'special', label: 'Final result' },
]

const fmtIv = iv => `[${iv[0]},${iv[1]}]`

export default function MergeIntervalsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sort')
  const [customCase,   setCustomCase]   = useState(null)

  const { intervals } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, intervals), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const source = step?.sorted ?? intervals
  const result = step?.result ?? []
  const allNums = [...source.flat(), ...result.flat()]
  const minV = allNums.length ? Math.min(...allNums) : 0
  const maxV = allNums.length ? Math.max(...allNums) : 1
  const range = Math.max(maxV - minV, 1)
  const toX = v => ((v - minV) / range) * 100

  const getBarState = (idx, iv) => {
    if (!step) return ''
    if (step.complete)                                    return 'special'
    if (step.activeIdx === idx && step.merged)            return 'match'
    if (step.activeIdx === idx && step.appended)          return 'match'
    if (step.activeIdx === idx)                           return 'current'
    if (step.cmpA === idx || step.cmpB === idx)           return 'compare'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "intervals",
                "label": "Intervals (pairs)",
                "type": "text",
                "placeholder": "[[1,3],[2,6],[8,10],[15,18]]"
            }
        ]}
      onApply={parsed => {
        const intervals = JSON.parse(parsed.intervals)
        setCustomCase({ intervals }); hook.reset()
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
        'Input':   intervals.length,
        'Output':  (step.complete ? step.sorted : result).length || '—',
        'Merged':  intervals.length - (step.complete ? step.sorted : result).length || 0,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.sectionLabel}>Input / Sorted Intervals</div>
        <div className={styles.timeline}>
          {source.map((iv, idx) => {
            const state = getBarState(idx, iv)
            const isActive = step?.activeIdx === idx || step?.cmpA === idx || step?.cmpB === idx
            return (
              <div key={idx} className={styles.tlRow}>
                <div className={styles.tlLabel}>
                  {isActive && <PointerLabel label="i" type="current" />}
                  {fmtIv(iv)}
                </div>
                <div className={styles.tlTrack}>
                  <div
                    className={`${styles.tlBar} ${state ? styles[state] : ''}`}
                    style={{ left: `${toX(iv[0])}%`, width: `${Math.max(toX(iv[1]) - toX(iv[0]), 1.5)}%` }}
                  >
                    <span className={styles.tick}>{iv[0]}</span>
                    <span className={`${styles.tick} ${styles.tickEnd}`}>{iv[1]}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {result.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Result</div>
            <div className={styles.resultTrack}>
              {result.map((iv, idx) => (
                <div
                  key={idx}
                  className={`${styles.resultBar} ${step?.complete ? styles.special : ''}`}
                  style={{ left: `${toX(iv[0])}%`, width: `${Math.max(toX(iv[1]) - toX(iv[0]), 1.5)}%` }}
                >
                  <span className={styles.resultLbl}>{fmtIv(iv)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </VisualizerShell>
  )
}
