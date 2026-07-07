import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MeetingRooms.module.css'

const TEST_CASES = [
  { label: 'Test 1 — 3 meetings, can attend', detail: '[[0,30],[5,10],[15,20]] → true... wait this overlaps', intervals: [[0,30],[35,40],[45,60]] },
  { label: 'Test 2 — overlap at 15',           detail: '[[0,30],[5,10],[15,20]] → false', intervals: [[0,30],[5,10],[15,20]] },
  { label: 'Test 3 — sequential',              detail: '[[0,5],[5,10],[10,15]] → true',   intervals: [[0,5],[5,10],[10,15]] },
  { label: 'Test 4 — back-to-back with gap',   detail: '[[1,5],[6,10]] → true',           intervals: [[1,5],[6,10]] },
]

const ALGORITHMS = [
  { id: 'sort', name: 'Sort + Linear Scan', complexity: 'O(n log n) time · O(1) space' },
]

const CODE = {
  sort: [
    'function canAttendMeetings(intervals):',
    '  sort intervals by start time',
    '  for i from 1 to n-1:',
    '    if intervals[i].start < intervals[i-1].end:',
    '      return false  // overlap found',
    '  return true',
  ],
}

const LEGEND = [
  { token: 'compare', label: 'Previous interval' },
  { token: 'current', label: 'Current interval' },
  { token: 'done',    label: 'No overlap — OK' },
  { token: 'error',   label: 'Overlap detected!' },
]

// Compute a nice timeline scale
function getScale(intervals) {
  const maxEnd = Math.max(...intervals.map(x => x[1]))
  return maxEnd || 1
}

export default function MeetingRoomsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sort')
  const [customCase,   setCustomCase]   = useState(null)

  const { intervals } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(intervals), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const sorted     = step?.sorted ?? [...intervals].sort((a,b)=>a[0]-b[0])
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const maxVal     = getScale(sorted)

  function getBarClass(i) {
    const hl = highlights[i]
    if (hl === 'error')   return styles.barError
    if (hl === 'current') return styles.barCurrent
    if (hl === 'done')    return styles.barDone
    return styles.bar
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "intervals",
                "label": "Intervals (pairs)",
                "type": "text",
                "placeholder": "[[0,30],[5,10],[15,20]]"
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
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Meetings': intervals.length,
        ...(result !== undefined ? { 'Can attend all': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? 'Can attend all meetings ✓' : 'Cannot attend all meetings ✗'}
          </div>
        )}
        <div className={styles.label}>Timeline (sorted by start)</div>
        <div className={styles.timeline}>
          {sorted.map((interval, i) => {
            const [s, e] = interval
            const left  = `${(s / maxVal) * 100}%`
            const width = `${Math.max(((e - s) / maxVal) * 100, 2)}%`
            return (
              <div key={i} className={styles.intervalRow}>
                <span className={styles.intervalLabel}>[{s},{e}]</span>
                <div className={styles.intervalBar}>
                  <div
                    className={getBarClass(i)}
                    style={{ left, width }}
                  >
                    {e - s > 0 ? `${s}-${e}` : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.axisRow}>
          <span>0</span><span>{Math.round(maxVal / 2)}</span><span>{maxVal}</span>
        </div>
      </div>
    </VisualizerShell>
  )
}
