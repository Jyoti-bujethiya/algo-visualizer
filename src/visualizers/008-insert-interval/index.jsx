import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './InsertInterval.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Mid + Merge', detail: 'ivs=[[1,3],[6,9]] new=[2,5]',        intervals: [[1,3],[6,9]],             newInterval: [2,5]  },
  { label: 'Test 2 — Multi-merge', detail: 'ivs=[[1,2],[3,5],[6,7],[8,10],[12,16]] new=[4,8]', intervals: [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval: [4,8]  },
  { label: 'Test 3 — At start',    detail: 'ivs=[[3,5],[6,9]] new=[1,2]',         intervals: [[3,5],[6,9]],             newInterval: [1,2]  },
  { label: 'Test 4 — At end',      detail: 'ivs=[[1,5]] new=[6,8]',               intervals: [[1,5]],                  newInterval: [6,8]  },
  { label: 'Test 5 — Overlap all', detail: 'ivs=[[2,3],[4,5],[6,7]] new=[1,8]',   intervals: [[2,3],[4,5],[6,7]],       newInterval: [1,8]  },
]

const ALGORITHMS = [
  { id: 'threepart', name: 'Three-Part Merge',       complexity: 'O(n) time · O(n) space' },
  { id: 'binsearch', name: 'Binary Search + Merge',  complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  threepart: ['Phase 1: while iv.end < new.start → add', 'Phase 2: while iv.start <= new.end → merge', '  new = [min(new.s,iv.s), max(new.e,iv.e)]', 'add merged new', 'Phase 3: add remaining'],
  binsearch: ['BS to find insertion index', 'Insert new at index', 'Linear merge pass (same as merge-intervals)'],
}

const LEGEND = [
  { token: 'special', label: 'New interval' },
  { token: 'current', label: 'Active / being checked' },
  { token: 'match',   label: 'Merged / added' },
  { token: 'compare', label: 'Binary search mid' },
]

const fmtIv = iv => `[${iv[0]},${iv[1]}]`

export default function InsertIntervalVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('threepart')
  const [customCase,   setCustomCase]   = useState(null)

  const { intervals, newInterval } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(
    () => generateSteps(selectedAlgo, intervals, newInterval),
    [selectedAlgo, selectedTest] // eslint-disable-line
  )
  const hook = useVisualizer(steps)
  const step = hook.step

  const ivs    = step?.intervals    ?? intervals
  const ni     = step?.newInterval  ?? newInterval
  const result = step?.result       ?? []
  const allNums = [...ivs.flat(), ...ni]
  const minV   = Math.min(...allNums), maxV = Math.max(...allNums)
  const range  = Math.max(maxV - minV, 1)
  const toX    = v => ((v - minV) / range) * 100

  const getState = (idx) => {
    if (!step) return ''
    if (step.complete)                              return 'special'
    if (step.activeIdx === idx && step.merging)     return 'match'
    if (step.activeIdx === idx && step.added)       return 'match'
    if (step.activeIdx === idx)                     return 'current'
    if (step.bsMid === idx)                         return 'compare'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "intervals",
                "label": "Intervals",
                "type": "text",
                "placeholder": "[[1,2],[3,5],[6,7],[8,10],[12,16]]"
            },
            {
                "key": "newInterval",
                "label": "New interval",
                "type": "text",
                "placeholder": "[4,8]"
            }
        ]}
      onApply={parsed => {
        const intervals = JSON.parse(parsed.intervals)
        const newInterval = JSON.parse(parsed.newInterval)
        setCustomCase({ intervals, newInterval }); hook.reset()
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
        'Input':     intervals.length,
        'Output':    result.length || '—',
        'New Iv':    `[${ni[0]},${ni[1]}]`,
        'Phase':     step.complete ? 'Done ✅' : step.phase ? `Phase ${step.phase}` : '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* New interval row */}
        <div className={styles.sectionLabel}>New Interval</div>
        <div className={styles.tlTrack}>
          <div
            className={`${styles.tlBar} ${styles.special}`}
            style={{ left: `${toX(ni[0])}%`, width: `${Math.max(toX(ni[1]) - toX(ni[0]), 1.5)}%` }}
          >
            <span className={styles.tick}>{ni[0]}</span>
            <span className={`${styles.tick} ${styles.tickEnd}`}>{ni[1]}</span>
          </div>
        </div>

        <div className={styles.sectionLabel}>Existing Intervals</div>
        <div className={styles.timeline}>
          {ivs.map((iv, idx) => {
            const state   = getState(idx)
            const isActive = state === 'current' || state === 'match' || state === 'compare'
            return (
            <div key={idx} className={styles.tlRow}>
              <div className={styles.tlLabel}>
                {isActive && <PointerLabel label={step?.bsMid === idx ? 'mid' : 'i'} type={step?.bsMid === idx ? 'special' : 'current'} />}
                {fmtIv(iv)}
              </div>
              <div className={styles.tlTrack}>
                <div
                  className={`${styles.tlBar} ${getState(idx) ? styles[getState(idx)] : ''}`}
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
                  className={`${styles.resultBar} ${step?.complete ? styles.match : ''}`}
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
