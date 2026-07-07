import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './Heap.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [3,2,1,5,6,4], k=2', detail: 'Answer: 5',  nums:[3,2,1,5,6,4], k:2 },
  { label: 'Test 2 — [3,2,3,1,2,4,5,5,6], k=4', detail: 'Answer: 4', nums:[3,2,3,1,2,4,5,5,6], k:4 },
  { label: 'Test 3 — [1], k=1',             detail: 'Answer: 1',  nums:[1], k:1 },
  { label: 'Test 4 — [7,6,5,4,3,2,1], k=3',detail: 'Answer: 5',  nums:[7,6,5,4,3,2,1], k:3 },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Min-Heap of size k', complexity: 'O(n log k) time · O(k) space' },
]

const CODE = {
  heap: [
    'function findKthLargest(nums, k):',
    '  heap = min-heap (size k)',
    '  for each num in nums:',
    '    heap.push(num)',
    '    if heap.size > k: heap.pop()  // remove min',
    '  return heap.top  // = kth largest',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current element' },
  { token: 'match',   label: 'In heap (kept)' },
  { token: 'discard', label: 'Popped — too small' },
]

export default function KthLargestVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { nums, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const heap       = step?.heap       ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const arrHL = Object.entries(highlights).map(([i, t]) => ({ index: Number(i), type: t }))


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "3,2,1,5,6,4"
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
      stats={step ? { 'k': k, 'Heap size': heap.length, ...(result !== undefined ? { 'kth largest': result } : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>Input array</div>
        <ArrayDisplay elements={nums} highlights={arrHL} />
        {result !== undefined && <div className={styles.resultBadge}>{k}th Largest: {result}</div>}
        <div className={styles.label}>Min-Heap (size ≤ k={k})</div>
        <div className={styles.heapRow}>
          {heap.length === 0
            ? <span className={styles.empty}>empty</span>
            : heap.map((v, i) => (
              <span key={i} className={`${styles.heapCell} ${i === 0 ? styles.heapRoot : ''}`}>{v}</span>
            ))
          }
        </div>
        {heap.length > 0 && <div className={styles.rootLabel}>Root (min) = {heap[0]}</div>}
      </div>
    </VisualizerShell>
  )
}
