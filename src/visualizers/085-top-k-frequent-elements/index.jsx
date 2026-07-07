import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './TopKFreq.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,1,1,2,2,3], k=2', detail: '[1,2]',    nums:[1,1,1,2,2,3],         k:2 },
  { label: 'Test 2 — [1], k=1',            detail: '[1]',      nums:[1],                   k:1 },
  { label: 'Test 3 — [4,1,2,2,3,3], k=2', detail: '[2,3]',    nums:[4,1,2,2,3,3],         k:2 },
  { label: 'Test 4 — [1,2,3,4,5,5,5,5], k=3', detail: '[2,3,5] or similar', nums:[1,2,3,4,5,5,5,5], k:3 },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Min-Heap of size k', complexity: 'O(n log k) time · O(n) space' },
]

const CODE = {
  heap: [
    'function topKFrequent(nums, k):',
    '  freq = count frequencies',
    '  heap = min-heap (by freq, size k)',
    '  for each (num, count) in freq:',
    '    heap.push([count, num])',
    '    if heap.size > k: heap.pop()',
    '  return heap elements',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being processed' },
  { token: 'match',   label: 'In heap (kept)' },
  { token: 'discard', label: 'Popped — less frequent' },
]

export default function TopKFreqVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { nums, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const freq       = step?.freq       ?? {}
  const heap       = step?.heap       ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result

  const uniqNums = [...new Set(nums)]
  const arrHL    = uniqNums.map((n, i) => ({ index: i, type: highlights[String(n)] })).filter(h => h.type)


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,1,1,2,2,3"
            },
            {
                "key": "k",
                "label": "k",
                "type": "number",
                "placeholder": "2"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums, k: parsed.k }); hook.reset()
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
      stats={step ? { 'k': k, 'Unique nums': Object.keys(freq).length, 'Heap size': heap.length, ...(result ? { 'Top-k': `[${result.join(',')}]` } : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>Input</div>
        <ArrayDisplay elements={nums} highlights={[]} />
        {Object.keys(freq).length > 0 && (
          <>
            <div className={styles.label}>Frequencies</div>
            <div className={styles.freqRow}>
              {Object.entries(freq).map(([n, c]) => (
                <span key={n} className={`${styles.freqChip} ${highlights[n] === 'match' ? styles.freqKept : highlights[n] === 'discard' ? styles.freqDiscard : ''}`}>
                  {n}:{c}
                </span>
              ))}
            </div>
          </>
        )}
        {result && <div className={styles.resultBadge}>Top-{k}: [{result.join(', ')}]</div>}
        <div className={styles.label}>Min-Heap (by freq, size ≤ {k})</div>
        <div className={styles.heapRow}>
          {heap.length === 0 ? <span className={styles.empty}>empty</span>
            : heap.map(([c, n], i) => (
              <span key={i} className={`${styles.heapCell} ${i === 0 ? styles.heapRoot : ''}`}>{n}<br /><span className={styles.freqLbl}>f={c}</span></span>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
