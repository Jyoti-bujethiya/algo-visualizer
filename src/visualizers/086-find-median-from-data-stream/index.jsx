import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MedianStream.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3,4,5]',   detail: 'Median after each: 1,1.5,2,2.5,3', nums:[1,2,3,4,5] },
  { label: 'Test 2 — [6,1,5,4,3]',   detail: 'LeetCode example',                 nums:[6,1,5,4,3] },
  { label: 'Test 3 — [5,5,5,5]',     detail: 'All same → median=5',              nums:[5,5,5,5] },
  { label: 'Test 4 — [1,7,3,9,2,8]', detail: 'Mixed ascending/descending',       nums:[1,7,3,9,2,8] },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Two Heaps', complexity: 'O(log n) addNum · O(1) findMedian' },
]

const CODE = {
  heap: [
    'class MedianFinder:',
    '  lo=maxHeap; hi=minHeap',
    '  function addNum(num):',
    '    lo.push(num)',
    '    hi.push(lo.pop())',
    '    if lo.size < hi.size:',
    '      lo.push(hi.pop())',
    '  function findMedian():',
    '    if equal: (lo.top+hi.top)/2',
    '    else: lo.top',
  ],
}

const LEGEND = [
  { token: 'special', label: 'maxHeap root (median candidate)' },
  { token: 'compare', label: 'minHeap root (median candidate)' },
  { token: 'match',   label: 'Computed median' },
]

export default function MedianStreamVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const lo     = step?.lo     ?? []
  const hi     = step?.hi     ?? []
  const median = step?.median ?? null


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Stream nums",
                "type": "array",
                "placeholder": "1,2,3,4,5"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
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
      stats={step ? { 'lo size': lo.length, 'hi size': hi.length, ...(median !== null ? { 'Median': median } : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {median !== null && <div className={styles.medianBadge}>Median: {median}</div>}
        <div className={styles.twoHeap}>
          <div className={styles.heapBlock}>
            <div className={styles.heapTitle}>maxHeap (lo) — lower half</div>
            <div className={styles.heapRow}>
              {lo.length === 0 ? <span className={styles.empty}>empty</span>
                : lo.map((v,i) => <span key={i} className={`${styles.heapCell} ${i===0?styles.heapLoTop:''}`}>{v}</span>)
              }
            </div>
          </div>
          <div className={styles.heapBlock}>
            <div className={styles.heapTitle}>minHeap (hi) — upper half</div>
            <div className={styles.heapRow}>
              {hi.length === 0 ? <span className={styles.empty}>empty</span>
                : hi.map((v,i) => <span key={i} className={`${styles.heapCell} ${i===0?styles.heapHiTop:''}`}>{v}</span>)
              }
            </div>
          </div>
        </div>
      </div>
    </VisualizerShell>
  )
}
