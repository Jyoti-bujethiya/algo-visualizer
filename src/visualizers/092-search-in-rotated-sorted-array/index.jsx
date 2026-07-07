import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './SearchRotated.module.css'

const TEST_CASES = [
  { label: 'Test 1 — target=0',  detail: 'Found at index 4', nums: [4,5,6,7,0,1,2], target: 0 },
  { label: 'Test 2 — target=3',  detail: 'Not found → -1',   nums: [4,5,6,7,0,1,2], target: 3 },
  { label: 'Test 3 — target=1',  detail: 'Found at index 1', nums: [1],              target: 0 },
  { label: 'Test 4 — target=5',  detail: 'Found at index 1', nums: [3,5,1],          target: 5 },
]

const ALGORITHMS = [
  { id: 'binary', name: 'Binary Search (One-pass)', complexity: 'O(log n) time · O(1) space' },
]

const CODE = {
  binary: [
    'function search(nums, target):',
    '  lo = 0, hi = nums.length - 1',
    '  while lo <= hi:',
    '    mid = (lo + hi) >>> 1',
    '    if nums[mid] == target: return mid',
    '    if nums[lo] <= nums[mid]:   // left sorted',
    '      if nums[lo] <= target < nums[mid]: hi = mid - 1',
    '      else: lo = mid + 1',
    '    else:                        // right sorted',
    '      if nums[mid] < target <= nums[hi]: lo = mid + 1',
    '      else: hi = mid - 1',
    '    return -1',
  ],
}

const LEGEND = [
  { token: 'special', label: 'lo / hi bounds' },
  { token: 'current', label: 'mid (being checked)' },
  { token: 'compare', label: 'Active search range' },
  { token: 'match',   label: 'Found!' },
]

function getCellClass(i, highlights, styles) {
  const hl = highlights[i]
  if (hl === 'match')   return styles.cellMatch
  if (hl === 'current') return styles.cellCurrent
  if (hl === 'compare') return styles.cellCompare
  if (hl === 'special') return styles.cellSpecial
  return ''
}

export default function SearchRotatedVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('binary')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums, target } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums, target), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const highlights = step?.highlights ?? {}
  const lo     = step?.lo ?? 0
  const hi     = step?.hi ?? nums.length - 1
  const mid    = step?.mid ?? -1
  const result = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Rotated nums",
                "type": "array",
                "placeholder": "4,5,6,7,0,1,2"
            },
            {
                "key": "target",
                "label": "Target",
                "type": "number",
                "placeholder": "0"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums, target: parsed.target }); hook.reset()
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
        'Target': target,
        'lo': lo,
        'hi': hi,
        ...(mid >= 0 ? { 'mid': mid, 'nums[mid]': nums[mid] } : {}),
        ...(result !== undefined ? { 'Result': result === -1 ? 'Not found' : `Index ${result}` } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result === -1 ? styles.resultNone : ''}`}>
            {result === -1 ? 'Not Found (-1)' : `Found at index ${result}`}
          </div>
        )}
        <div className={styles.arrayWrap}>
          <div className={styles.arrayRow}>
            {nums.map((v, i) => (
              <div key={i} className={`${styles.cell} ${getCellClass(i, highlights, styles)}`}>
                {v}
              </div>
            ))}
          </div>
          <div className={styles.pointerRow}>
            {nums.map((_, i) => (
              <div key={i} className={`${styles.ptr} ${i === mid ? styles.ptrMid : (i === lo || i === hi) ? styles.ptrLo : ''}`}>
                {i === lo && i === hi ? 'lo=hi' : i === lo ? 'lo' : i === hi ? 'hi' : i === mid ? 'mid' : ''}
              </div>
            ))}
          </div>
          <div className={styles.label}>indices</div>
          <div className={styles.arrayRow}>
            {nums.map((_, i) => (
              <div key={i} className={styles.ptr}>{i}</div>
            ))}
          </div>
        </div>
      </div>
    </VisualizerShell>
  )
}
