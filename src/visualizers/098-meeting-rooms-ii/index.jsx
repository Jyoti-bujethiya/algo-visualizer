import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MeetingRoomsII.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [[0,30],[5,10],[15,20]]', detail: '2 rooms needed', intervals: [[0,30],[5,10],[15,20]] },
  { label: 'Test 2 — [[7,10],[2,4]]',          detail: '1 room needed',  intervals: [[7,10],[2,4]] },
  { label: 'Test 3 — [[1,5],[2,6],[3,7]]',     detail: '3 rooms needed', intervals: [[1,5],[2,6],[3,7]] },
  { label: 'Test 4 — [[1,5],[5,10],[10,15]]',  detail: '1 room (back-to-back)', intervals: [[1,5],[5,10],[10,15]] },
]

const ALGORITHMS = [
  { id: 'heap',  name: 'Min-Heap (End Times)', complexity: 'O(n log n) time · O(n) space' },
  { id: 'chron', name: 'Chronological Split',  complexity: 'O(n log n) time · O(n) space' },
]

const CODE = {
  heap: [
    'function minMeetingRooms(intervals):',
    '  sort by start time',
    '  heap = min-heap of end times',
    '  for each [start, end]:',
    '    if heap.top <= start: heap.pop()  // room reusable',
    '    heap.push(end)',
    '  return heap.size  // min rooms needed',
  ],
  chron: [
    'function minMeetingRooms(intervals):',
    '  starts = sorted start times; ends = sorted end times',
    '  rooms = 0, maxRooms = 0, e = 0',
    '  for each s in starts:',
    '    if s < ends[e]: rooms++; maxRooms = max(maxRooms, rooms)',
    '    else: e++',
    '  return maxRooms',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Meeting being processed' },
  { token: 'done',     label: 'Completed / in heap' },
  { token: 'special',  label: 'Heap root (next to end)' },
  { token: 'compare',  label: 'In queue / comparing' },
  { token: 'visiting', label: 'New room opened' },
]

function getHeapCellClass(i, styles) {
  return i === 0 ? styles.heapRoot : ''
}

export default function MeetingRoomsIIVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)

  const { intervals } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, intervals), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const heap       = step?.heap ?? []
  const highlights = step?.highlights ?? {}
  const rooms      = step?.rooms
  const maxRooms   = step?.maxRooms

  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  const maxVal = Math.max(...intervals.map(x => x[1])) || 1

  function getBarClass(i) {
    const hl = highlights[i]
    if (hl === 'current') return styles.barCurrent
    if (hl === 'done')    return styles.barDone
    return styles.bar
  }

  // Chron: starts/ends
  const starts = [...intervals].map(x => x[0]).sort((a, b) => a - b)
  const ends   = [...intervals].map(x => x[1]).sort((a, b) => a - b)


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
        ...(rooms !== undefined  ? { 'Rooms in use': rooms }  : {}),
        ...(maxRooms !== undefined ? { 'Max rooms': maxRooms } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {(rooms !== undefined || maxRooms !== undefined) && (
          <div className={styles.roomsBadge}>
            Rooms: {selectedAlgo === 'heap' ? (heap.length || rooms) : (maxRooms !== undefined ? maxRooms : rooms)}
          </div>
        )}

        {selectedAlgo === 'heap' ? (
          <>
            <div className={styles.label}>Timeline (sorted)</div>
            <div className={styles.timeline}>
              {sorted.map((interval, i) => {
                const [s, e] = interval
                const left  = `${(s / maxVal) * 100}%`
                const width = `${Math.max(((e - s) / maxVal) * 100, 3)}%`
                return (
                  <div key={i} className={styles.intervalRow}>
                    <span className={styles.intervalLabel}>[{s},{e}]</span>
                    <div className={styles.intervalBar}>
                      <div className={getBarClass(i)} style={{ left, width }}>
                        {s}-{e}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.label}>Min-Heap (end times)</div>
            <div className={styles.heapRow}>
              {heap.length === 0
                ? <span className={styles.heapCell} style={{opacity:.4}}>empty</span>
                : heap.map((v, i) => (
                  <span key={i} className={`${styles.heapCell} ${getHeapCellClass(i, styles)}`}>
                    {v}
                  </span>
                ))
              }
            </div>
          </>
        ) : (
          <div className={styles.chronoWrap}>
            <div className={styles.chronoBlock}>
              <div className={styles.chronoTitle}>Starts (sorted)</div>
              <div className={styles.chronoRow}>
                {starts.map((s, i) => {
                  const hl = highlights[`s${i}`]
                  return (
                    <div key={i} className={`${styles.chronoCell} ${
                      hl === 'current' ? styles.chronoCurrent :
                      hl === 'visiting' ? styles.chronoVisiting :
                      hl === 'done' ? styles.chronoDone : ''
                    }`}>{s}</div>
                  )
                })}
              </div>
            </div>
            <div className={styles.chronoBlock}>
              <div className={styles.chronoTitle}>Ends (sorted)</div>
              <div className={styles.chronoRow}>
                {ends.map((e, i) => {
                  const hl = highlights[`e${i}`]
                  return (
                    <div key={i} className={`${styles.chronoCell} ${
                      hl === 'compare' ? styles.chronoCompare :
                      hl === 'done' ? styles.chronoDone : ''
                    }`}>{e}</div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
