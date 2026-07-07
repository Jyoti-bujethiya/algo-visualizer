import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './QuickSelect.module.css'

const TEST_CASES = [
  { label: 'Test 1 — k=2, [3,2,1,5,6,4]',       detail: '2nd largest = 5',  nums: [3,2,1,5,6,4],    k: 2 },
  { label: 'Test 2 — k=4, [3,2,3,1,2,4,5,5,6]', detail: '4th largest = 4',  nums: [3,2,3,1,2,4,5,5,6], k: 4 },
  { label: 'Test 3 — k=1, [1]',                  detail: '1st largest = 1',  nums: [1],               k: 1 },
  { label: 'Test 4 — k=3, [7,10,4,3,20,15]',     detail: '3rd largest = 10', nums: [7,10,4,3,20,15],  k: 3 },
]

const ALGORITHMS = [
  { id: 'quickselect', name: 'QuickSelect',     complexity: 'O(n) avg · O(n²) worst · O(1) space' },
  { id: 'sort',        name: 'Sort (baseline)', complexity: 'O(n log n) time · O(1) space' },
]

const CODE = {
  quickselect: [
    'function findKthLargest(nums, k):',
    '  target = n - k  (kth largest = (n-k)th smallest)',
    '  function quickSelect(lo, hi):',
    '    pivot = nums[hi]',
    '    p = lo',
    '    for i from lo to hi-1:',
    '      if nums[i] <= pivot: swap(nums[i], nums[p]); p++',
    '    swap(nums[p], nums[hi])  // pivot final place',
    '    if p == target: return nums[p]',
    '    else if p < target: return quickSelect(p+1, hi)',
    '    else: return quickSelect(lo, p-1)',
    '  return quickSelect(0, n-1)',
  ],
  sort: [
    'function findKthLargest(nums, k):',
    '  sort nums descending',
    '  return nums[k-1]',
  ],
}

const LEGEND = [
  { token: 'compare',  label: 'Active partition range' },
  { token: 'special',  label: 'Pivot' },
  { token: 'current',  label: 'Element being compared' },
  { token: 'visiting', label: 'Swapped to left partition' },
  { token: 'match',    label: 'Pivot in final position / answer' },
]

function getCellClass(i, highlights, styles) {
  const hl = highlights[i]
  if (hl === 'match')    return styles.cellMatch
  if (hl === 'current')  return styles.cellCurrent
  if (hl === 'compare')  return styles.cellCompare
  if (hl === 'visiting') return styles.cellVisiting
  return ''
}

export default function KthLargestQuickSelectVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('quickselect')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const arr        = step?.arr ?? nums
  const highlights = step?.highlights ?? {}
  const result     = step?.result


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
      stats={step ? {
        'k': k,
        'target idx (0-based)': nums.length - k,
        ...(result !== undefined ? { [`${k}th largest`]: result } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            {k}th Largest = {result}
          </div>
        )}
        <div className={styles.arrayWrap}>
          <div className={styles.arrayRow}>
            {arr.map((v, i) => (
              <div key={i} className={`${styles.cell} ${getCellClass(i, highlights, styles)}`}>
                {v}
              </div>
            ))}
          </div>
          <div className={styles.pointerRow}>
            {arr.map((_, i) => {
              const hl = highlights[i]
              return (
                <div key={i} className={`${styles.ptr} ${hl ? styles.ptrP : ''}`}>
                  {i === nums.length - k ? 't' : ''}
                </div>
              )
            })}
          </div>
          <div className={styles.label}>t = target index ({nums.length - k})</div>
        </div>
      </div>
    </VisualizerShell>
  )
}
