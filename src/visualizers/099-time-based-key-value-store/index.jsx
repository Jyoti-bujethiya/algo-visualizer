import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './TimeMap.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — foo/bar queries',
    detail: 'LeetCode example 1',
    operations: [
      { type: 'set', key: 'foo', value: 'bar',  timestamp: 1 },
      { type: 'get', key: 'foo', timestamp: 1 },   // bar
      { type: 'get', key: 'foo', timestamp: 3 },   // bar
      { type: 'set', key: 'foo', value: 'bar2', timestamp: 4 },
      { type: 'get', key: 'foo', timestamp: 4 },   // bar2
      { type: 'get', key: 'foo', timestamp: 5 },   // bar2
    ],
  },
  {
    label: 'Test 2 — LeetCode example 2',
    detail: 'love/high/low',
    operations: [
      { type: 'set', key: 'love', value: 'high', timestamp: 10 },
      { type: 'set', key: 'love', value: 'low',  timestamp: 20 },
      { type: 'get', key: 'love', timestamp: 5 },   // ''
      { type: 'get', key: 'love', timestamp: 10 },  // high
      { type: 'get', key: 'love', timestamp: 15 },  // high
      { type: 'get', key: 'love', timestamp: 20 },  // low
      { type: 'get', key: 'love', timestamp: 25 },  // low
    ],
  },
  {
    label: 'Test 3 — Multiple keys',
    detail: 'a and b separate',
    operations: [
      { type: 'set', key: 'a', value: 'x', timestamp: 1 },
      { type: 'set', key: 'b', value: 'y', timestamp: 2 },
      { type: 'get', key: 'a', timestamp: 1 },  // x
      { type: 'get', key: 'b', timestamp: 3 },  // y
    ],
  },
  {
    label: 'Test 4 — Miss before first entry',
    detail: 'get before any set → ""',
    operations: [
      { type: 'set', key: 'k', value: 'v1', timestamp: 5 },
      { type: 'get', key: 'k', timestamp: 3 },  // ''
      { type: 'get', key: 'k', timestamp: 5 },  // v1
    ],
  },
]

const ALGORITHMS = [
  { id: 'timemap', name: 'Binary Search on Timestamps', complexity: 'set O(1) · get O(log n)' },
]

const CODE = {
  timemap: [
    'TimeMap:',
    '  store = {}  // key → [[timestamp, value], ...]',
    '  function set(key, value, timestamp):',
    '    store[key].push([timestamp, value])',
    '  function get(key, timestamp):',
    '    entries = store[key]',
    '    lo=0, hi=entries.length-1',
    '    while lo <= hi:',
    '      mid = (lo+hi)/2',
    '      if entries[mid][0] == timestamp: return entries[mid][1]',
    '      if entries[mid][0] < timestamp: lo=mid+1; bestVal=entries[mid][1]',
    '      else: hi=mid-1',
    '    return bestVal',
  ],
}

const LEGEND = [
  { token: 'special',  label: 'Key identifier' },
  { token: 'current',  label: 'mid entry (binary search)' },
  { token: 'compare',  label: 'Active search range' },
  { token: 'done',     label: 'Best candidate so far' },
  { token: 'match',    label: 'Exact match / final result' },
]

export default function TimeBasedKVVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('timemap')
  const [customCase,   setCustomCase]   = useState(null)

  const { operations } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(operations), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const store      = step?.store ?? {}
  const highlights = step?.highlights ?? {}
  const getResult  = step?.getResult

  function getEntryClass(key, idx) {
    const hl = highlights[`${key}_${idx}`]
    if (hl === 'match')   return styles.entryMatch
    if (hl === 'current') return styles.entryCurrent
    if (hl === 'compare') return styles.entryCompare
    if (hl === 'done')    return styles.entryDone
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "operations",
                "label": "Ops (JSON array)",
                "type": "text",
                "placeholder": "[[\"set\",\"foo\",\"bar\",1],[\"get\",\"foo\",1]]"
            }
        ]}
      onApply={parsed => {
        const operations = JSON.parse(parsed.operations)
        setCustomCase({ operations }); hook.reset()
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
        'Keys stored': Object.keys(store).length,
        ...(getResult !== undefined ? { 'get() result': `"${getResult}"` } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {getResult !== undefined && (
          <div className={styles.resultBadge}>get → "{getResult}"</div>
        )}
        <div className={styles.label}>Store</div>
        <div className={styles.storeWrap}>
          {Object.keys(store).length === 0
            ? <span className={styles.empty}>empty</span>
            : Object.keys(store).map(key => (
              <div key={key} className={styles.keyRow}>
                <span className={styles.keyLabel}>{key}:</span>
                <div className={styles.entriesRow}>
                  {store[key].map(([ts, val], idx) => (
                    <span key={idx} className={`${styles.entryCell} ${getEntryClass(key, idx)}`}>
                      t={ts} → {val}
                    </span>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
